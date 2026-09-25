Build a simple, modern, responsive web application called **AI Workplace Productivity Assistant**.

IMPORTANT: Keep the implementation simple and lightweight so the entire initial build stays within a **10-credit limit**. Do not add unnecessary features, dependencies, authentication, database infrastructure, payments, or external integrations.

## PURPOSE

The application demonstrates how AI can help professionals save time with common workplace tasks.

It must have four working AI features:

1. Meeting Notes Summarizer
2. AI Task Planner
3. Smart Email Generator
4. AI Chatbot

The application should be beginner-friendly and easy to demonstrate.

---

# 1. DESIGN

Use a clean professional SaaS-style interface.

* Light grey page background
* White content cards
* Dark navy sidebar
* Pink primary buttons/highlights
* Inter font
* Rounded cards and buttons
* Simple icons
* Clear headings
* Good spacing
* Responsive desktop and mobile layout

Use a single consistent design system throughout the application.

On desktop:

* Fixed/collapsible dark navy sidebar on the left
* Main content area on the right

On mobile:

* Sidebar becomes a simple mobile navigation/menu
* Content cards stack vertically
* Inputs and buttons become full width where appropriate

Do not over-design the application.

---

# 2. NAVIGATION

Create these sidebar navigation items:

* Dashboard
* Meeting Notes
* Task Planner
* Email Generator
* AI Chatbot
* Settings
* Responsible AI

Each navigation item must actually work.

Use client-side navigation rather than creating unnecessary backend infrastructure.

---

# 3. DASHBOARD

Create a welcoming dashboard.

Heading:

**AI Workplace Productivity Assistant**

Welcome text:

"Save time by turning workplace information into summaries, tasks and professional communication."

Show four feature cards:

### Meeting Notes

Turn meeting notes into a concise summary and action items.

Button:
**Open Meeting Notes**

### Task Planner

Organise meeting action items into a daily or weekly plan.

Button:
**Open Task Planner**

### Email Generator

Create a professional follow-up email from your meeting information.

Button:
**Open Email Generator**

### AI Chatbot

Ask questions about your meeting notes.

Button:
**Open AI Chatbot**

Also show a small "Responsible AI" reminder.

---

# 4. RESPONSIBLE AI WARNING

Place this warning **above every user input box**:

**"Please do not enter confidential or sensitive information."**

At the bottom of EVERY page include this disclaimer:

**"AI can make mistakes. Always review AI-generated information before using it for important decisions or workplace communication."**

Do not remove these warnings.

---

# 5. MEETING NOTES SUMMARIZER

Create a page called **Meeting Notes**.

Input:

Large textarea labelled:

**Paste your meeting notes**

Show the responsible AI warning immediately above it.

Button:

**Summarize Notes**

The AI should produce four clearly separated sections:

### Summary

A short, concise summary of the meeting.

### Main Decisions

List the decisions explicitly mentioned.

### Action Items

List tasks explicitly mentioned.

For every action item show:

* Task
* Responsible person
* Deadline

If the notes do not contain a responsible person's name, leave the responsible person blank.

If the notes do not contain a deadline, leave the deadline blank.

NEVER invent missing information.

### Key Information

Show other useful information explicitly contained in the notes.

Add buttons:

**Send Action Items to Task Planner**

**Clear**

Allow generated summary content to be edited.

Store the user's meeting notes locally on their device.

---

# 6. AI TASK PLANNER

Create a page called **Task Planner**.

The planner should use action items generated from Meeting Notes.

Allow the user to select:

**Plan type**

* Daily
* Weekly

Organise tasks by priority:

* High
* Medium
* Low

Each task should display:

* Task
* Responsible person
* Deadline
* Priority
* Suggested date
* Complete checkbox

Important:

Do not invent names, dates, deadlines or task details.

If a responsible person is missing, leave it blank.

If a deadline is missing, leave it blank.

If a suggested date cannot be determined from information supplied by the user, leave it blank rather than inventing a date.

Allow users to:

* Mark tasks complete
* Edit tasks
* Change priority
* Delete tasks
* Add a task manually

Add a button:

**Send Tasks to Email Generator**

Store tasks locally on the user's device.

---

# 7. SMART EMAIL GENERATOR

Create a page called **Email Generator**.

Use information available from:

* Meeting Notes
* Task Planner

Do not invent information.

Allow the user to select an email tone:

* Formal
* Friendly
* Persuasive

Show:

### Subject

An editable subject input.

### Email Message

A large editable text area.

Button:

**Generate Email**

Button:

**Copy Email**

The generated email should be professional and suitable as a workplace follow-up.

Only include information supplied by the user or information already generated from the user's supplied meeting notes.

Never invent:

* Names
* Dates
* Deadlines
* Tasks
* Decisions
* Other facts

If information is unavailable, simply omit it.

Allow the generated subject and message to be edited before copying.

---

# 8. AI CHATBOT

Create a page called **AI Chatbot**.

Show a simple chat interface.

Input:

**Ask a question about your meeting notes...**

Show the responsible AI warning above the input.

The chatbot must answer questions using ONLY the current meeting notes.

Keep answers short and clear.

If the answer cannot be found in the notes, the response MUST be exactly:

**"That wasn't covered in the notes."**

Do not use outside knowledge.

Do not make up information.

Include:

* Chat history
* User message
* AI response
* Clear chat button

The chatbot should use the notes stored by the Meeting Notes page.

---

# 9. SETTINGS

Create a very simple Settings page.

Include:

### Saved Data

Show that the application stores information locally on the user's device.

Include buttons:

**Clear Meeting Notes**

**Clear Tasks**

**Clear All Saved Data**

Add a simple confirmation before clearing all data.

Do not create accounts or a database.

---

# 10. RESPONSIBLE AI PAGE

Create a page titled:

**Responsible AI**

Explain four topics using short, beginner-friendly sections:

### Privacy

Do not enter confidential or sensitive workplace information.

### Accuracy

AI can make mistakes, so generated information should always be checked.

### Bias

AI outputs can contain bias and should be reviewed critically.

### Human Review

AI should assist people, not replace human judgment. Important workplace information should be checked before being used.

Include the standard AI disclaimer at the bottom.

---

# 11. DATA STORAGE

Use browser local storage only.

Save:

* Meeting notes
* Generated summary
* Action items
* Tasks
* Completed task status
* Email draft
* User settings

When the application is reopened, restore saved information.

Do NOT use:

* Login
* Authentication
* Database
* Payment system
* Cloud storage
* Unnecessary APIs

---

# 12. FEATURE CONNECTIONS

The four features must connect together.

Flow:

Meeting Notes
→ Summary
→ Action Items
→ Task Planner
→ Email Generator

The AI Chatbot should also use the saved Meeting Notes.

Make these connections obvious through buttons.

---

# 13. AI BEHAVIOUR

The most important requirement is:

**NEVER INVENT INFORMATION.**

The AI must only use information supplied by the user.

Never fabricate:

* Names
* Deadlines
* Dates
* Responsibilities
* Decisions
* Facts

When information is missing, leave the relevant field blank or omit it.

For the chatbot specifically, if information is not present in the meeting notes, respond exactly:

**"That wasn't covered in the notes."**

---

# 14. SIMPLE TECHNICAL IMPLEMENTATION

Keep the implementation lightweight.

Prefer:

* React
* TypeScript
* Tailwind CSS
* Simple reusable components
* Browser localStorage

Avoid unnecessary libraries.

Create reusable components for:

* Sidebar
* Page header
* Cards
* Buttons
* Input warnings
* AI disclaimer
* Task rows
* Empty states

Use mock/local AI behaviour if an actual AI API is not already available.

Do not require users to configure API keys.

The application must still demonstrate the complete user experience without requiring external setup.

---

# 15. UX DETAILS

Include useful empty states.

For example:

"No meeting notes yet."

"No tasks have been added."

"No email has been generated."

"No meeting notes are available for the chatbot."

Buttons should clearly indicate what they do.

Show a small loading state when generating AI content.

Show a simple success message after copying an email.

Make all forms accessible and easy to understand.

---

# 16. FINAL QUALITY CHECK

Before finishing, verify that:

* All sidebar navigation works.
* Dashboard cards open their corresponding pages.
* Meeting notes can be entered.
* Meeting summary can be generated.
* Decisions and action items are displayed.
* Missing names remain blank.
* Missing deadlines remain blank.
* Action items can be sent to Task Planner.
* Tasks can be edited.
* Tasks can be marked complete.
* Tasks can be sent to Email Generator.
* Email tone can be selected.
* Email subject and message are editable.
* Email can be copied.
* Chatbot uses only meeting notes.
* Chatbot returns exactly "That wasn't covered in the notes." when the answer is unavailable.
* Settings can clear saved data.
* Data persists using localStorage.
* Responsible AI warnings appear above every input.
* AI disclaimer appears at the bottom of every page.
* Responsible AI page works.
* Mobile layout works.
* No login, payment, database or unnecessary features are included.

Prioritize working functionality and simplicity over visual complexity.

Build the complete application now.
