import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callGateway } from "./ai.server";

const NO_INVENTION =
  "CRITICAL RULE: Use ONLY information explicitly present in the user's text. Never invent or infer names, dates, deadlines, decisions, tasks or any other facts. If something is missing, leave the field as an empty string or omit it.";

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ notes: z.string().min(1) }).parse(input))
  .handler(async ({ data }) => {
    const raw = await callGateway({
      instructions: `You summarise workplace meeting notes. ${NO_INVENTION}`,
      input: data.notes,
      schema: {
        name: "meeting_summary",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["summary", "decisions", "actionItems", "keyInformation"],
          properties: {
            summary: { type: "string" },
            decisions: { type: "array", items: { type: "string" } },
            actionItems: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["task", "person", "deadline"],
                properties: {
                  task: { type: "string" },
                  person: { type: "string", description: "Empty string if not stated" },
                  deadline: { type: "string", description: "Empty string if not stated" },
                },
              },
            },
            keyInformation: { type: "array", items: { type: "string" } },
          },
        },
      },
    });

    return JSON.parse(raw) as {
      summary: string;
      decisions: string[];
      actionItems: { task: string; person: string; deadline: string }[];
      keyInformation: string[];
    };
  });

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tone: z.enum(["Formal", "Friendly", "Persuasive"]),
        context: z.string().min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const raw = await callGateway({
      instructions: `You write professional workplace follow-up emails in a ${data.tone.toLowerCase()} tone. ${NO_INVENTION} Omit anything you were not given. Do not add placeholder text such as [Name].`,
      input: data.context,
      schema: {
        name: "email_draft",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["subject", "message"],
          properties: { subject: { type: "string" }, message: { type: "string" } },
        },
      },
    });

    return JSON.parse(raw) as { subject: string; message: string };
  });

export const askChatbot = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ notes: z.string().min(1), question: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => {
    const answer = await callGateway({
      instructions:
        'Answer the question using ONLY the meeting notes provided. Keep answers short and clear. Use no outside knowledge. If the answer is not explicitly in the notes, reply with exactly: That wasn\'t covered in the notes.',
      input: `MEETING NOTES:\n${data.notes}\n\nQUESTION:\n${data.question}`,
    });

    return { answer: answer || "That wasn't covered in the notes." };
  });
