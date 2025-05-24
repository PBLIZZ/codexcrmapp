# Standard Operating Procedure (SOP): AI-First Full-Stack Development (Solo Dev Edition)

**Version:** 1.1
**Date:** 2025-04-12
**Author:** AI Assistant (based on user requirements and provided documents)

## 1. Introduction

### 1.1. Purpose
This SOP provides a structured workflow and reference guide for building **AI-first** web applications. It is designed for a solo developer starting with foundational web knowledge (HTML/CSS) and aims to leverage AI tools throughout the development lifecycle, from ideation to deployment.

### 1.2. Audience
This document is intended for:
*   Solo developers or very small teams.
*   Individuals with basic HTML/CSS knowledge aiming to build full-stack applications.
*   Developers who want to integrate AI as a **core component** of their applications.
*   Individuals who may benefit from structured, step-by-step guidance and focus-management techniques (ADHD-friendly).

### 1.3. Core Philosophy
*   **AI as a Partner:** Treat AI tools (Copilot, ChatGPT, Gemini, Claude, etc.) as your pair programmer, brainstormer, explainer, and boilerplate generator. Your role is to guide, review, refine, and connect the pieces.
*   **AI-First, Not AI-Addon:** Design applications where AI capabilities are integral to the core user value proposition, not just tacked on.
*   **Break It Down Aggressively:** Combat overwhelm by breaking large ideas into the smallest possible, actionable tasks. Focus on completing *one tiny task* at a time.
*   **Iterate and Commit:** Embrace a cycle of Prompt -> Generate -> Review -> Refine/Ask -> Test -> Commit for every small piece. Frequent commits build momentum and safety nets.
*   **Trust, But Verify:** Critically review all AI-generated code and content. AI makes mistakes, hallucinates, and can produce inefficient or insecure code. Treat AI output like code from a junior developer – it needs checking.
*   **Focus on Fundamentals:** While AI helps, understanding core concepts (programming logic, web requests, basic data structures) remains crucial for effective guidance and debugging.

### 1.4. Document Format & Usage
This document is in Markdown (`.md`) for easy reference and modification. Use clear section headers for navigation. Steps are numbered for clarity. Treat this as a living document to adapt as you learn and tools evolve.

## 2. Core Principles for Solo AI-First Development

*   **Embrace Small Steps:** Always break down features into the smallest possible coding tasks (e.g., "create a button," "add an API route," "write a function to call OpenAI").
*   **Single Task Focus:** Use techniques like the Pomodoro method (See Section 10) to work intensely on *one tiny task* before taking a break or switching.
*   **ADHD-Friendly Workflow:** This SOP incorporates strategies like checklists (implied by steps), visual task boards, and AI rubber ducking to aid focus and reduce overwhelm.
*   **Flexibility:** Be prepared to adapt. AI tools change rapidly. The goal is to learn the *process* of leveraging AI, not just memorize specific commands for one tool.
*   **Cost-Consciousness:** Prioritize free tiers and pay-as-you-go (PAYG) services suitable for learning and low-traffic MVPs.

## 3. Recommended Toolset (Starter Kit)

This initial toolset is chosen for its AI integration, free/generous free tiers, ease of use for beginners, and suitability for solo development.

*   **1. Code Editor (Your Cockpit):**
    *   **Tool:** **Cursor IDE** or **VS Code + GitHub Copilot Extension**
    *   **Why:** Excellent AI integration (inline suggestions, chat). Cursor is specifically built around AI workflows. Copilot is the industry leader for code generation. VS Code is free and highly extensible. Copilot has a free trial, often free for students, otherwise paid.
    *   **Alternatives:** Codeium (Free Copilot alternative with self-hosting options), Amazon CodeWhisperer (Good AWS integration, free tier).
*   **2. Terminal (Command Center):**
    *   **Tool:** Integrated Terminal within Cursor/VS Code.
    *   **Why:** Keeps everything in one window, reducing context switching. Use basic commands (`cd`, `mkdir`, `git`, `npm`).
    *   **Location Context:** We'll assume your projects live in `~/projects/`. (`~` usually means `/Users/peterjamesblizzard` on your Mac).
*   **3. AI Chat Models (Brainstorming, Explaining, Refining):**
    *   **Tools:** **ChatGPT (OpenAI)**, **Gemini (Google)**, **Claude (Anthropic)**
    *   **Why:** Great for brainstorming ideas, explaining concepts, debugging errors, generating larger code snippets (like boilerplate), refining clunky code, and drafting text content. Free tiers are usually sufficient for initial development. They offer APIs for programmatic integration later.
*   **4. Version Control (Safety Net):**
    *   **Tool:** **Git + GitHub**
    *   **Why:** Essential for tracking changes, reverting mistakes, and collaboration (even if solo). GitHub provides free private repositories and integrates with deployment platforms.
*   **5. Runtime Environment (Executing Backend Code):**
    *   **Tool:** **Node.js**
    *   **Why:** Popular JavaScript runtime, vast ecosystem (npm), works well for building APIs, integrates easily with frontend JavaScript frameworks. Free and cross-platform.
*   **6. Frontend Framework (Building UI):**
    *   **Tool:** **React (using Vite)**
    *   **Why:** Extremely popular, large community, component-based (good for breaking down UI), works well with AI code generation tools. Vite provides a fast development setup.
    *   **Alternatives:** Vue, Svelte, Angular (React often has strong Copilot support).
*   **7. Backend Framework (Structuring Backend):**
    *   **Tool:** **Express.js (for Node.js)**
    *   **Why:** Minimalist and flexible Node.js web framework, easy to get started with building APIs.
*   **8. Backend-as-a-Service (BaaS) / Database (Optional, Simplifies Backend):**
    *   **Tool:** **Supabase**
    *   **Why:** Open-source Firebase alternative built on PostgreSQL. Offers database, auth, storage, edge functions with a generous free tier. SQL familiarity is a plus. Simplifies backend setup significantly compared to building everything manually. Provides client libraries (SDKs) for easy frontend integration.
    *   **Alternatives:** Firebase (Google, mature, NoSQL option, good free tier but potential lock-in), Appwrite (Open Source).
*   **9. Deployment Platform (Making it Live):**
    *   **Tool:** **Vercel** or **Netlify**
    *   **Why:** Excellent DX (Developer Experience), seamless Git integration (push-to-deploy), free tiers perfect for frontend apps and serverless functions (like Node.js API routes). Vercel is optimized for Next.js (a React framework), but both work well with Vite/React.
    *   **Alternatives:** Railway.app, Render.com (Good for deploying full backends/databases easily, PAYG), Fly.io.
*   **10. UI Component Generators (Optional, Visual Speed):**
    *   **Tool:** **v0.dev (by Vercel)**
    *   **Why:** Generates React/HTML/CSS component code from text prompts or images. Useful for quickly getting visual pieces, which you then integrate and add logic to. Pay-as-you-go credits system.
    *   **Alternatives:** Galileo AI (Figma designs from text), Askimg.ai.
*   **Optional/Alternative Tools Mentioned in Ecosystem:**
    *   **Visual Builders/Prototyping:** Tools like **Bolt** or **UX Pilot** aim to generate functional UI flows or entire screens from prompts/visual editing, potentially speeding up initial UI creation significantly. They represent a more low-code approach for the initial build phase compared to writing React components directly with AI assistance (our primary workflow).
    *   **AI Documentation/Planning:** Tools like **CodeGuide** exist to auto-generate PRDs and technical docs from prompts, offering more specialized planning assistance than general chat AIs.
    *   **Database Sync:** **MCP (Model Context Protocol)** aims to automate database schema changes and migrations between IDEs like Cursor and databases like Supabase.

*(Decision: Our core workflow remains focused on Cursor/VSCode+Copilot for coding, using general AI chats for planning/docs, v0/AI chat for component generation, Supabase for BaaS, and Vercel for deployment, prioritizing learning the underlying connections. The above tools are noted as alternatives for different workflows or specific needs).*

## 4. Phase 0: Idea to Tiny Task - The HARDEST Part

**Goal:** Break down your big app idea into the *very first, smallest possible* piece you can build. AI is crucial here.

*   **Step 4.1: Define the BIG Goal (Simply):**
    *   **Action:** Write down the absolute core function of your app in one sentence. Forget fancy features for now.
    *   **Example:** "An app to summarize blog posts using AI." or "A tool to generate social media posts from a topic."
*   **Step 4.2: Use AI to Brainstorm Minimal Features (MVP):**
    *   **Action:** Ask your favorite chat AI.
    *   **Prompt:** `I want to build a simple web app for [Your BIG Goal, e.g., 'summarizing blog posts']. What are the absolute essential, minimal features needed for a first version (MVP)? List them simply.`
    *   **Why:** AI leverages its knowledge of typical apps to give you a concrete starting list.
*   **Step 4.3: Pick ONE Simplest Feature:**
    *   **Action:** Look at the AI's list. Pick the feature that feels like the easiest, most concrete starting point.
    *   **Example:** AI suggests: "Input field for URL," "Display summary," "User accounts." Simplest might be "Input field for URL" and "Display summary" (even if the summary is hardcoded initially). Or maybe just the backend logic: "API endpoint that accepts a URL."
*   **Step 4.4: Use AI to Break Down THAT Feature into Tasks:**
    *   **Action:** Ask the AI to break down the *one* feature you picked.
    *   **Prompt:** `Break down the feature '[The ONE Feature you picked, e.g., 'API endpoint that accepts a URL and returns a hardcoded summary']' for a web app into small, sequential developer tasks. If applicable, list frontend (React) and backend (Node.js/Express) steps separately.`
    *   **Why:** Turns a vague feature into a mini-checklist of actionable coding tasks. Crucial for focus.
    *   **Example Output:**
        1.  Backend: Setup basic Node.js/Express server.
        2.  Backend: Create a POST API route `/api/summarize`.
        3.  Backend: In the route, receive a URL from the request body.
        4.  Backend: Return a hardcoded JSON response like `{"summary": "This is a placeholder summary."}`.
        5.  Frontend: Create a React component `SummarizerForm`.
        6.  Frontend: Add an input field for the URL.
        7.  Frontend: Add a button "Summarize".
        8.  Frontend: On button click, send the URL to the backend API (`/api/summarize`). (Leave displaying the response for *later*).
*   **Step 4.5: Pick ONE TINY Task:**
    *   **Action:** From the AI's list of steps for that *one feature*, pick the very first, smallest task. **This is what you work on NOW.**
    *   **Example Task:** "Backend: Setup basic Node.js/Express server."
*   **Step 4.6: AI-Assisted Documentation (Optional Enhancement):**
    *   **Action:** Feed your feature list and goals into a chat AI or specialized tool (like CodeGuide).
    *   **Why:** Generates more formal Product Requirements Document (PRD) or technical specification outline.
    *   **Note:** For learning purposes, simple lists and AI brainstorming (Step 4.2) are usually sufficient.

## 5. Phase 1: Project Setup (Do this ONCE per project)

**Goal:** Get a clean slate ready locally and on GitHub. AI helps with tedious config.

*   **Step 5.1: Create Project Folder:**
    *   **Action:** Open your Terminal (inside VS Code/Cursor is fine). Navigate to your projects directory and create a folder for your new project.
    *   **Commands:**
        ```bash
        cd ~/projects
        mkdir my-ai-summarizer-app
        cd my-ai-summarizer-app
        ```
*   **Step 5.2: Open in Code Editor:**
    *   **Action:** Open the newly created folder (`my-ai-summarizer-app`) in Cursor/VS Code.
    *   **Command (if in the folder in terminal):** `code .` or `cursor .`
*   **Step 5.3: Initialize Git:**
    *   **Action:** In the integrated terminal (already in your project folder).
    *   **Command:** `git init`
    *   **Why:** Starts tracking changes locally.
*   **Step 5.4: Create Basic Structure & Initialize Backend:**
    *   **Action:** Create separate folders for frontend and backend code. Initialize Node.js in the backend.
    *   **Commands:**
        ```bash
        mkdir backend frontend
        cd backend
        npm init -y
        # This creates a package.json file for your backend
        cd ..
        ```
*   **Step 5.5: Initialize Frontend (React with Vite):**
    *   **Action:** Initialize a React project in the frontend folder using Vite.
    *   **Commands:**
        ```bash
        cd frontend
        npm create vite@latest . --template react
        # Follow prompts (e.g., choose React, JavaScript/TypeScript)
        # The '.' installs in the current directory
        npm install # Installs frontend dependencies
        cd ..
        ```
*   **Step 5.6: Use AI for Config Files (.gitignore):**
    *   **Action:** Ask chat AI to generate a `.gitignore` file for your stack. Copy-paste it into the *root* project folder (`my-ai-summarizer-app/.gitignore`).
    *   **Prompt (Chat AI):** `Generate a standard .gitignore file suitable for a project with a Node.js/Express backend and a React (Vite) frontend. Include common Node and OS ignores.`
    *   **Why:** Prevents committing unnecessary files (like `node_modules` or OS files) to Git.
*   **Step 5.7: Use AI for Config Files (README.md):**
    *   **Action:** Ask chat AI to generate a simple `README.md` template. Copy-paste it into the root project folder (`my-ai-summarizer-app/README.md`). Fill in the basics later.
    *   **Prompt (Chat AI):** `Create a very simple README.md template for a web app project. Include sections for 'Project Title', 'About', 'Tech Stack', and 'How to Run Locally'.`
*   **Step 5.8: First Commit:**
    *   **Action:** Stage all your initial files and make your first commit.
    *   **Commands:**
        ```bash
        git add .
        git commit -m "feat: Initial project setup with backend and frontend structure"
        ```
    *   **Why:** Saves your initial clean state. Use `feat:` (feature) or `chore:` (maintenance) prefixes for conventional commits (good practice).
*   **Step 5.9: (Optional but Recommended) Create GitHub Repo and Push:**
    *   **Action:** Go to GitHub.com, create a new *private* repository (e.g., `my-ai-summarizer-app`). **Do not** initialize it with a README or .gitignore on GitHub. Copy the commands GitHub provides to link your local repo and push.
    *   **Commands (Example from GitHub):**
        ```bash
        git remote add origin https://github.com/peterjamesblizzard/my-ai-summarizer-app.git
        git branch -M main
        git push -u origin main
        ```
    *   **Why:** Backs up your code remotely and enables easy deployment later.

## 6. Phase 2: Building Your First TINY Piece (The Core Loop)

**Goal:** Implement the *one tiny task* identified in Phase 0, using AI assistance heavily. Repeat this phase for *every* tiny task.

*   **Step 6.1: Navigate:**
    *   **Action:** In your editor/terminal, go to the relevant folder (e.g., `backend`) and open or create the necessary file (e.g., `server.js`).
    *   **Example Task:** "Backend: Setup basic Node.js/Express server." -> Navigate to `backend` folder, create `server.js`.
*   **Step 6.2: Prompt with Comments (Using Copilot Inline):**
    *   **Action:** Inside the file (e.g., `server.js`), write comments describing *exactly* what you need the code to do, step-by-step. Hit Enter after each comment.
    *   **Example Comments (for basic Express server):**
        ```javascript
        // Import Express library
        // Create an instance of the Express application
        // Define the port number (e.g., 5001 to avoid conflicts)
        // Define a simple GET route for the root path ('/')
        // Inside the route handler, send back a JSON response { message: 'Hello World!' }
        // Start the server and listen on the defined port
        // Log a message to the console when the server starts listening
        ```
*   **Step 6.3: Let Copilot Generate:**
    *   **Action:** As you type comments or hit Enter, Copilot will suggest code. Review the suggestion briefly (does it look roughly right?) and press `Tab` to accept it. Copilot might generate multiple lines or even the whole file based on the comments.
*   **Step 6.4: REVIEW THE CODE Critically:**
    *   **Action:** Read the code Copilot generated. Does it make sense based on your comments? Does it *look* like JavaScript/React? Don't worry if you don't understand every detail yet.
    *   **If Unsure:** Highlight a section of code.
        *   **Cursor:** Use the integrated chat/commands.
        *   **VS Code Copilot:** Right-click -> Copilot -> Explain This.
    *   **Prompt (AI Chat/Explain):** `Explain what this block of code does, assuming I'm a beginner.`
*   **Step 6.5: Refine / Fix (with AI Help):**
    *   **Action:** Did Copilot miss something? Is there an error? Is the syntax old? Ask the chat AI for help.
    *   **Prompt (Chat AI):** `This code seems to be missing error handling for the server start. How can I add basic error handling in Node.js/Express?`
    *   **Prompt (Chat AI):** `Is this the most modern way to import Express in Node.js?`
    *   **Prompt (Chat AI):** `Can you make this code clearer or more efficient? [Paste the clunky code]`
    *   **Action:** Apply the suggestions, using Copilot again if needed.
*   **Step 6.6: Test (Manually, Simply):**
    *   **Action:** Run the code and check if it does the *one tiny thing* it's supposed to do.
    *   **Example (Backend Server):**
        1.  Open terminal in `backend` folder.
        2.  Install dependencies if needed (Copilot might add `require('express')` but you haven't installed it): `npm install express`
        3.  Run the server: `node server.js`
        4.  Check console for the "Server listening..." message.
        5.  Open web browser to `http://localhost:5001` (or the port you used).
        6.  Do you see `{"message": "Hello World!"}`?
    *   **Example (Frontend Component - assuming part of a running app):**
        1.  Open terminal in `frontend` folder.
        2.  Run the dev server: `npm run dev`
        3.  Open the browser URL Vite provides (e.g., `http://localhost:5173`).
        4.  Does the component appear? Does the button exist? (Functionality test comes later). Check Browser Console (F12 or Right Click -> Inspect -> Console) for errors.
    *   **If Errors:** Copy the *entire* error message from the terminal or browser console.
    *   **Prompt (Chat AI):** `My Node.js server gave this error when I ran it: [paste full error message]. Here's my server.js code: [paste relevant code]. What's likely wrong?`
*   **Step 6.7: Commit Your Tiny Win:**
    *   **Action:** Once the tiny task is working, commit it.
    *   **Commands:**
        ```bash
        git add . # Stage all changes
        # Or be specific: git add backend/server.js
        git commit -m "feat: Setup basic Express server with hello world route"
        # Or for a fix: git commit -m "fix: Corrected port number for backend server"
        ```
    *   **Why:** Saves your progress after each successful small step. Makes it easy to go back if you break something later.

**>>> Repeat Phase 2 (Steps 6.1-6.7) for the *next* tiny task from your breakdown <<<**

## 7. Phase 3: Integrating UI Components

**Goal:** Get visual elements onto the page, potentially using AI generators, and then add logic.

*   **Step 7.1: Generate Visuals (Optional):**
    *   **Action:** Use a tool like v0.dev or ask Copilot/ChatGPT to generate the HTML/CSS or React component structure for a visual element (e.g., a card, a form layout, a styled button).
    *   **Prompt (v0/Chat AI):** `Create a simple React component for a card layout with an image placeholder, title, and description text.`
*   **Step 7.2: Integrate Snippet:**
    *   **Action:** Copy the generated code (HTML/CSS/React) into a new component file (e.g., `frontend/src/components/MyCard.jsx`) in your project. Import and use this component in your main app view (e.g., `frontend/src/App.jsx`).
*   **Step 7.3: Add Logic/State (The Tricky Part):**
    *   **Action:** This is where you make the component interactive. Use the **Core Loop (Phase 2)** to add state (e.g., `useState` in React), event handlers (`onClick`, `onChange`), and logic.
    *   **Prompt Example (Chat AI/Copilot Comment):** `// Add an onClick handler to this button that calls a function named 'handleSubmit'`
    *   **Prompt Example (Chat AI):** `I have this React component code from v0: [paste code]. How do I add an 'onClick' handler to the button that calls a function named 'handleSubmit'? Also, how do I manage the input field's value using useState?`
*   **Step 7.4: Test and Commit:** Follow Steps 6.6 and 6.7.

## 8. Phase 4: Connecting Frontend and Backend

**Goal:** Make your frontend talk to your backend API.

*   **Step 8.1: Implement API Call:**
    *   **Action:** In your frontend React component, use the `fetch` API (or a library like `axios`) to make a request to your backend endpoint (e.g., the `/api/summarize` route created earlier). Use the **Core Loop (Phase 2)**.
    *   **Example Copilot Comments (in React component):**
        ```javascript
        // Function to handle form submission
        // Inside the function, get the URL from the input state
        // Use fetch API to make a POST request to 'http://localhost:5001/api/summarize'
        // Include the URL in the request body as JSON
        // Set the appropriate headers (Content-Type: application/json)
        // Handle the response: parse the JSON data
        // Update the component's state with the received summary
        // Add basic error handling for the fetch call (e.g., console.error)
        ```
*   **Step 8.2: Handle CORS (Common Issue):**
    *   **Problem:** You might see a "CORS error" in the browser console when the frontend (e.g., `localhost:5173`) tries to call the backend (`localhost:5001`). This is a security feature.
    *   **Action:** Ask AI how to fix it for your specific setup (Node.js/Express).
    *   **Prompt (Chat AI):** `My React app running on localhost:5173 is getting a CORS error when trying to fetch data from my Express backend running on localhost:5001. How do I enable CORS in my Express server during development?`
    *   **Likely Solution:** AI will suggest installing the `cors` npm package and using it as middleware in your `server.js`. Follow the instructions (using Core Loop).
*   **Step 8.3: Test and Commit:** Ensure both backend and frontend dev servers are running. Test the full flow (enter URL, click button, check if frontend receives data, check browser/server consoles). Commit (Step 6.7).

## 9. Phase 5: Integrating Core AI Functionality

**Goal:** Make your application AI-first by calling external AI models or using AI libraries.

*   **Step 9.1: Choose Integration Pattern:** Decide how AI fits in. Common patterns:
    *   **A) Simple API Call:** Backend calls an AI service (OpenAI, Gemini, Claude) to perform a task (generate text, summarize, classify).
    *   **B) Function Calling / Agents:** AI model determines which of *your* backend functions to call based on user input (more advanced).
    *   **C) Retrieval-Augmented Generation (RAG):** Use a vector database (like Supabase pgvector, Pinecone) to provide relevant context from your own data to the AI before generating a response (most complex, powerful for knowledge-based apps).
*   **Step 9.2: Implement Backend Logic (using Core Loop - Phase 2):**
    *   **Action (Pattern A):** Modify your backend API route (e.g., `/api/summarize`).
        1.  Install the AI provider's SDK (e.g., `npm install openai`).
        2.  Securely load your API key (Use environment variables - `.env` file and `dotenv` package. **Never commit API keys to Git!** Add `.env` to `.gitignore`). Ask AI: `How to use environment variables in Node.js to store API keys securely?`
        3.  Use Copilot/Chat AI to help structure the API call to the AI service, passing the necessary input (e.g., the URL or content to summarize) and prompt.
        4.  **Prompt (Copilot Comment):** `// Call OpenAI completion API using the 'openai' SDK`
        5.  **Prompt (Chat AI):** `Using the Node.js OpenAI SDK (v4+), show me how to make a call to the chat completions endpoint (gpt-3.5-turbo model) with a system message and a user message containing text to summarize. Make sure to handle the API key using process.env.`
        6.  Parse the AI's response and return it from *your* API route.
*   **Step 9.3: Abstract the AI Call:**
    *   **Action:** Create a separate function or module in your backend (e.g., `aiService.js`) that handles the actual call to the external AI API. Your main API route (`server.js`) should call *this* internal function.
    *   **Why:** Makes it easier to switch AI providers later (Vendor Lock-in mitigation - See Section 12).
    *   **Refactoring Prompt (Chat AI):** `I have this code in my Express route handler that calls the OpenAI API: [paste code]. Can you help me refactor this into a separate async function in a file called 'aiService.js'? The main route handler should then call this function.`
*   **Step 9.4: Test and Commit:** Test the backend route (e.g., using Postman, Insomnia, or curl, or via the frontend if connected). Ensure it calls the AI and returns the expected result. Check for errors. Commit.
*   **Step 9.5 (Optional Advanced - Supabase/Cursor Users): Database Schema Sync with MCP:** If using Cursor and Supabase, investigate **Model Context Protocol (MCP)**. It may allow you to define/update database models in your code or via AI prompts in Cursor and automatically generate/apply Supabase migrations, potentially streamlining database schema management. *(Note: Check current availability, features, and any potential costs associated with MCP).*


## 10. Phase 6: Testing & Quality Assurance (AI-Specific)

**Goal:** Ensure your application, including its AI components, works reliably.

*   **Step 10.1: Unit Tests (with AI Help):**
    *   **Action:** For critical backend logic (including your `aiService.js` wrapper), write unit tests. Use Copilot/Chat AI to help generate test cases.
    *   **Prompt (Copilot - in a test file):** `// Test the summarizeText function with valid input` or `// Test the summarizeText function when the AI API returns an error`
    *   **Prompt (Chat AI):** `Generate Jest unit tests for this Node.js function: [paste function code]. Include tests for happy path and potential error cases.`
*   **Step 10.2: Integration Tests:**
    *   **Action:** Test the flow between frontend and backend (Phase 4 testing).
    *   **Action:** Test the flow between your backend and the external AI API (Phase 5 testing).
*   **Step 10.3: Manual/Exploratory Testing (Focus on AI):**
    *   **Action:** Interact with the AI features specifically.
        *   Does the AI give reasonable responses for typical inputs?
        *   Does it handle edge cases gracefully (e.g., invalid URL for summarizer)?
        *   Does it fail safely (e.g., show a fallback message if the AI API times out)? Test this by temporarily putting invalid API keys or network blocking.
        *   Is the AI output biased or inappropriate? (See Best Practices - Section 12).
*   **Step 10.4: AI Output Validation (Code):**
    *   **Action:** In your code (backend or frontend), add checks on the AI's output before displaying or using it.
    *   **Example:** If expecting a short summary, check the length. If it's excessively long, truncate or show an error. If expecting JSON, validate the structure.
    *   **Prompt (Chat AI):** `In my Node.js backend, I receive a response string from an AI model which should be a short summary. How can I add a basic check to ensure the string isn't empty and is less than, say, 1000 characters before sending it to the frontend?`
*   **Step 10.5: Test and Commit Fixes:** Follow testing steps from Phase 2 (6.6, 6.7) for any bugs found.

## 11. Phase 7: Deployment

**Goal:** Make your application accessible on the internet.

*   **Step 11.1: Choose Platform:** Select Vercel or Netlify for simple frontend + serverless function deployment. If using Supabase, it's already hosted.
*   **Step 11.2: Connect GitHub Repo:**
    *   **Action:** Sign up for Vercel/Netlify. Connect your GitHub account. Select the repository you created in Phase 1.
*   **Step 11.3: Configure Build Settings:**
    *   **Action:** The platform usually autodetects Vite/React. Ensure the build command (`npm run build`) and output directory (`dist` for Vite) are correct. Set the root directory if needed (e.g., point to the `frontend` subfolder if deploying only the frontend).
*   **Step 11.4: Configure Environment Variables:**
    *   **Action:** In the Vercel/Netlify project settings, add any environment variables needed by your app. **Crucially, add your AI API key here.** Also, add the URL of your deployed backend if frontend/backend are deployed separately.
    *   **Example:** `OPENAI_API_KEY=sk-xxxxxxxx...`, `API_BASE_URL=https://your-backend-url.vercel.app`
    *   **Security:** Mark API keys as sensitive/secret.
*   **Step 11.5: Deploy:**
    *   **Action:** Trigger the first deployment. Subsequent pushes to your `main` branch on GitHub will typically trigger automatic redeployments.
*   **Step 11.6: Pre-Deployment Security Checklist:** Before considering your MVP "shippable" (even to testers), review these crucial security points:
    *   **[ ] Enable Row-Level Security (RLS) in Supabase:** **CRITICAL.** Go to your Supabase project -> Authentication -> Policies. Ensure RLS is enabled for *every* table containing user data. Define policies (e.g., `(auth.uid() = user_id)`) to ensure users can only access their own data. *Ask Cursor/AI for help generating policies based on your schema:* `Generate Supabase RLS policies for my 'posts' table (columns: id, user_id, content) ensuring users can only select/insert/update/delete their own posts.`
    *   **[ ] Secure Secrets:** Double-check that *no* API keys, database connection strings, or other secrets are hardcoded in your frontend or backend code. Ensure they are loaded *only* from environment variables (`process.env` on backend, Vercel/Netlify dashboard settings) and your `.env` file is in `.gitignore`.
    *   **[ ] Backend Input Validation:** Ensure all data received by your backend API routes (from forms, parameters, etc.) is validated on the server-side before processing or saving. Don't rely solely on frontend validation. (e.g., check data types, lengths, formats).
    *   **[ ] Add CAPTCHA (Recommended for Auth):** If you have user signup/login, add CAPTCHA (like hCaptcha or Google reCAPTCHA - check free tiers) to prevent automated bot signups.
    *   **[ ] Dependency Check:** Run `npm audit` (or `yarn audit`) in both `frontend` and `backend` directories. Address any high or critical severity vulnerabilities by updating packages (`npm audit fix`) or finding alternatives. Remove unused dependencies.
    *   **[ ] Enable Basic WAF (If using Vercel/Platform Feature):** Check your deployment platform's security settings (e.g., Vercel -> Settings -> Security). Enable basic Web Application Firewall or Attack Challenge Mode if available on your plan. *(Note: Full WAF features may be on paid plans).*
    *   **[ ] Consider Rate Limiting (Basic):** Think about how to prevent abuse. Even a simple implementation can help. *This might be deferred post-MVP launch depending on complexity/cost.* Potential approaches: Vercel Middleware, Supabase Edge Functions, simple Node.js middleware (`express-rate-limit`). Ask AI: `How can I add simple IP-based rate limiting to my Express.js app?` *(Note: Robust rate limiting can be complex and may involve paid services).*
*   **Step 11.7: Test Live App:** Visit the deployed URL. Test core functionality, *especially authentication and data access* to ensure RLS is working correctly. Check browser/server logs.

## 12. Phase 8: Monitoring & Iteration

**Goal:** Observe how your app performs, gather feedback, and plan improvements.

*   **Step 12.1: Basic Monitoring:**
    *   **Action:** Use the built-in analytics and logs provided by your deployment platform (Vercel/Netlify) and BaaS (Supabase). Check for errors and basic usage patterns.
*   **Step 12.2: Error Tracking (Recommended):**
    *   **Action:** Integrate a service like Sentry (has a free tier). It provides detailed error reports from your frontend and backend.
    *   **Prompt (Chat AI):** `How do I add Sentry error tracking to a React (Vite) application?` and `How do I add Sentry error tracking to a Node.js/Express application?`
*   **Step 12.3: Gather Feedback:**
    *   **Action:** If possible, get real users (friends, colleagues) to try the app. Pay close attention to feedback about the AI features.
*   **Step 12.4: Iterate:**
    *   **Action:** Based on monitoring and feedback:
        *   Fix bugs (using the Core Loop).
        *   Improve AI prompts based on weird/incorrect outputs.
        *   Refine features.
        *   Add new features (go back to Phase 0: Break down the *next* feature).
    *   **Focus:** Continue breaking work into tiny, testable, committable tasks.
*   **Step 12.5: Monitoring Focus:** When reviewing logs (Supabase, Vercel, Sentry), specifically look for:
    *   Failed login attempts (potential bot activity).
    *   Sudden traffic spikes (check rate limiting if implemented).
    *   4xx errors (client errors, could indicate frontend bugs or probing).
    *   5xx errors (server errors, investigate immediately).
    *   Errors related to RLS policy violations.
    *   High resource usage (database load, function execution time).

## 13. Managing Workflow & Focus (ADHD Strategies)

**Goal:** Stay focused and maintain momentum during development.

*   **13.1. TINY Tickets / Tasks:**
    *   **Strategy:** Your primary weapon against overwhelm. Stick to the breakdown from Phase 0. Your `git commit` messages *are* your completed task list.
    *   **Action:** If a task feels too big or you get stuck for more than 15-20 minutes, stop and break it down *even smaller*. Ask AI: `I'm stuck on the task '[original task]'. Can you break this down into even smaller sub-steps?`
*   **13.2. Visual Task Board (Optional but helpful):**
    *   **Strategy:** Simple visual progress tracking.
    *   **Tools:**
        *   **Plain Text File:** Create `TODO.md` in your project root. Use Markdown checkboxes: `- [ ] Task 1`, `- [x] Task 2`.
        *   **Trello:** Free, simple drag-and-drop columns (To Do, Doing, Done). Create cards *only* for the immediate small tasks for the *current feature*. Don't list everything for the whole app.
        *   **GitHub Projects:** Integrates with your repo issues, good if using issues heavily.
*   **13.3. Focus Timer (Pomodoro Technique):**
    *   **Strategy:** Work intensely on *one tiny task* without distractions, then take a mandatory break. Prevents burnout and helps restart focus.
    *   **Action:**
        1.  Choose ONE tiny task.
        2.  Set a timer for 25 minutes.
        3.  Work *only* on that task. No email, no browsing (unless directly related to the task).
        4.  When the timer rings, stop. Mark your progress.
        5.  Take a 5-minute break (get up, stretch, walk away from the screen).
        6.  Repeat. After ~4 Pomodoros, take a longer break (15-30 minutes).
*   **13.4. AI as Your Rubber Duck / Explainer:**
    *   **Strategy:** When stuck, confused, or losing track, talk to your AI assistant. Explaining the problem often helps solve it.
    *   **Prompts (AI Chat):**
        *   `Remind me, what was the goal of the function/component in this file: [paste file path or code]?`
        *   `I'm trying to implement [tiny task]. I'm stuck on [specific problem]. What are some possible next steps or things to check?`
        *   `Explain this error message again simply: [paste error].`
        *   `Explain how [a specific concept, e.g., 'React useEffect dependency arrays'] work like I'm 10.`

## 14. Roles & Responsibilities (Solo Developer Adaptation)

As a solo developer, you wear all the hats. Here's how the tasks in this SOP map to traditional roles:

*   **Product Manager/Architect (You):** Phase 0 (Defining goal, features), ongoing decisions on features and approach.
*   **Backend Developer (You):** Phase 2, 5, 9 (Building Node.js server, API routes, AI integration logic, database interactions via Supabase/Prisma).
*   **Frontend Developer (You):** Phase 2, 3, 4, 8 (Building React components, integrating UI, calling backend APIs, implementing Sentry).
*   **DevOps Engineer (You + AI + Platform):** Phase 1 (Setup, Git, .gitignore), Phase 7 (Deployment via Vercel/Netlify, managing environment variables), Phase 8 (Basic monitoring). AI generates configs, Platforms automate builds/deploys.
*   **QA Engineer (You + AI):** Phase 6 (Manual testing, AI-assisted unit tests, AI-specific testing).
*   **AI Engineer (You + AI):** Phase 0 (Brainstorming), Phase 5 (Crafting prompts, integrating AI APIs/SDKs, abstracting calls), Phase 6 & 8 (Evaluating AI output, refining prompts).
*   **Database Admin (You + BaaS):** Phase 1/ongoing (Defining schema via Supabase UI/SQL - potentially AI-assisted), Phase 8 (Monitoring Supabase).
*   **UI/UX Designer (You + AI):** Phase 0 (Initial feature/flow ideas), Phase 3 (Using AI generators for initial visuals, refining layout/usability).
*   **Security Engineer (You + Tools):** Phase 5 (Handling API keys securely), Phase 7 (Configuring env vars), ongoing review of AI-generated code for vulnerabilities (See Section 15).

**Key Takeaway:** Leverage AI and platforms to automate/simplify tasks traditionally requiring specialists (DevOps, boilerplate coding), allowing you to focus on core logic, user experience, and AI integration.

## 15. Best Practices & Mitigating Risks for AI Development

Incorporate these practices throughout your workflow:

*   **15.1. Prompt Versioning:**
    *   **Action:** Store important/complex prompts (especially system prompts for AI agents) in constants or separate files within your project. Commit changes to Git like code.
    *   **Why:** If AI behavior changes negatively after a prompt tweak, you can roll back.
*   **15.2. AI Output Validation:**
    *   **Action:** *Never* blindly trust AI output for critical logic or user-facing content. Add code checks (length, format, basic sanity) before using/displaying AI responses (See Phase 6). Manually review important AI-generated code.
    *   **Why:** AI hallucinates, makes errors, and can generate nonsense or incorrect information.
*   **15.3. Human in the Loop (Crucial Decisions):**
    *   **Action:** If AI is involved in potentially destructive actions (e.g., deleting data, sending mass emails), require explicit human confirmation or implement very strict validation.
    *   **Why:** Prevents automated disasters caused by AI misinterpretation.
*   **15.4. Logging & Monitoring AI Behavior:**
    *   **Action:** Log key aspects of AI interactions: which prompt/model was used, input summary (no PII), response metadata (e.g., length, time taken), errors. Use Sentry/platform logs.
    *   **Why:** Essential for debugging when AI behavior becomes erratic or performance degrades.
*   **15.5. Bias & Ethical Checks:**
    *   **Action:** Be mindful of potential bias in AI outputs. If dealing with sensitive topics or user-generated content, consider using the AI provider's content moderation filters/APIs. Review outputs for fairness.
    *   **Why:** Prevents harmful or offensive content and builds user trust.
*   **15.6 Security:** *(Enhance this section)* Ensure that AI suggestions have not introduced insecure code (e.g., SQL injection if generating queries, improper handling of user input). **Always apply security reviews and principles:**
    *   **Validate ALL inputs on the backend.**
    *   **Use RLS religiously if using Supabase.**
    *   **Manage secrets via environment variables only.**
    *   **Scan AI-generated code, especially for hardcoded secrets or lack of validation.**
    *   **Keep dependencies updated and audited (`npm audit`).**
    *   **Implement CAPTCHA on public forms (especially auth).**
*   **15.7: Enable Row-Level Security (RLS):** If using databases like Supabase that support it, enable RLS from the start for any table containing user-specific or sensitive data. Define clear policies to prevent users from accessing data they shouldn't. Treat this as non-negotiable for multi-user apps.
*   **15.8: Implement Rate Limiting:** Protect your API endpoints and serverless functions from abuse (bots, denial-of-service) by implementing rate limiting. Start simple (e.g., IP-based limits) and enhance as needed. Understand the cost implications of different solutions.
*   **15.9: Utilize Web Application Firewall (WAF):** If your deployment platform offers a WAF (like Vercel), enable it for an extra layer of protection against common web attacks, often with minimal configuration. Check plan limitations and costs.
*   **15.10. Mitigating Hallucinations:**
    *   **Action:**
        *   Provide clear, specific context in prompts.
        *   Use Retrieval-Augmented Generation (RAG) if grounding answers in specific data is needed.
        *   Instruct the AI to admit uncertainty ("If you aren't sure, say so").
        *   Implement fallback logic in your code for when AI fails or times out (See Phase 9 example).
*   **15.8. Handling Quality (The "70% Problem"):**
    *   **Action:** Budget time for reviewing and refining AI outputs. AI provides a great first draft (70-90%), but human polish is often needed for robustness, maintainability, and nuance.
    *   **Why:** Don't assume "AI did it, we're done." Factor review/refinement into estimates.
*   **15.9. Vendor Lock-in Mitigation:**
    *   **Action:**
        *   **AI Provider:** Abstract external AI calls behind your own service/module (Step 9.3). Periodically explore alternative models (open source, other providers).
        *   **Platform/BaaS:** Choose services that allow data export (Supabase, Firebase do). Understand the exit path if you need to migrate later.
        *   **Legal:** Be aware of API terms of service. Have a Plan B if regulations or terms change.
*   **15.10. Cost Overruns:**
    *   **Action:** Monitor API usage (OpenAI dashboard, platform metrics). Set budget alerts if possible. Use cheaper models (e.g., GPT-3.5-turbo) for less critical tasks. Cache AI responses where appropriate (if the same input always yields the same desired output). Optimize prompts to be concise.
*   **15.11. Privacy and IP:**
    *   **Action:**
        *   Anonymize/remove Personally Identifiable Information (PII) from prompts sent to external AI services unless the provider guarantees data privacy for your use case (check terms).
        *   Be aware of potential IP issues with AI code generation (Copilot regurgitating licensed code). Use filters if available (Copilot has one). Have a human review significant AI-generated code chunks. Clarify ownership (usually, the user owns the output, but underlying IP law is evolving).

## 16. Conclusion

Building AI-first applications as a solo developer is achievable by leveraging modern tools and a structured, iterative process. Treat AI as a powerful assistant, break down complexity relentlessly, focus on one tiny step at a time, and always verify the results. This SOP provides a roadmap and a set of techniques, but the most important skill is adaptability and continuous learning in this rapidly evolving field. Embrace the journey, commit your wins frequently, and focus on building something valuable, piece by tiny piece.

## 17. Appendix: Example Prompts & Links

### 17.1. Key Prompt Examples:
*   **MVP Features:** `I want to build a simple web app for [Your BIG Goal]. What are the absolute essential, minimal features needed for a first version (MVP)? List them simply.`
*   **Feature Breakdown:** `Break down the feature '[The ONE Feature you picked]' for a web app into small, sequential developer tasks. List frontend (React) and backend (Node.js/Express) steps separately if needed.`
*   **Config Generation (.gitignore):** `Generate a standard .gitignore file suitable for a project with a Node.js/Express backend and a React (Vite) frontend.`
*   **Config Generation (README):** `Create a very simple README.md template for a web app project. Include sections for 'Project Title', 'About', 'Tech Stack', and 'How to Run Locally'.`
*   **Code Explanation:** `Explain what this block of code does, assuming I'm a beginner.` or `Explain [concept] like I'm 10.`
*   **Code Refinement:** `Can you make this code clearer or more efficient? [Paste code]` or `Is this the most modern way to do X in [language/framework]?`
*   **Debugging:** `My [Node.js/React] app gave this error: [paste full error message]. Here's my code: [paste relevant code]. What's likely wrong?`
*   **CORS Fix:** `My React app on [frontend URL] is getting a CORS error calling my Express backend on [backend URL]. How do I enable CORS in Express for development?`
*   **API Call Help:** `Using the [Provider] SDK for Node.js, show me how to call the [specific API endpoint] with [these parameters]. Handle the API key using process.env.`
*   **Refactoring:** `Help me refactor this code [paste code] into a separate function/module called [filename].`
*   **Unit Test Generation:** `Generate Jest unit tests for this Node.js function: [paste function code]. Include tests for happy path and error cases.`
*   **Focus/Stuck:** `Remind me, what was the goal of this file: [paste path]?` or `I'm stuck on [task]. Break it down smaller.` or `Explain this error simply: [paste error].`

### 17.2. Tool Links:
*   **Cursor IDE:** [https://cursor.sh/](https://cursor.sh/)
*   **VS Code:** [https://code.visualstudio.com/](https://code.visualstudio.com/)
*   **GitHub Copilot:** [https://github.com/features/copilot](https://github.com/features/copilot)
*   **Node.js:** [https://nodejs.org/](https://nodejs.org/)
*   **Vite:** [https://vitejs.dev/](https://vitejs.dev/)
*   **React:** [https://react.dev/](https://react.dev/)
*   **Express.js:** [https://expressjs.com/](https://expressjs.com/)
*   **Supabase:** [https://supabase.com/](https://supabase.com/)
*   **Vercel:** [https://vercel.com/](https://vercel.com/)
*   **Netlify:** [https://www.netlify.com/](https://www.netlify.com/)
*   **Git:** [https://git-scm.com/](https://git-scm.com/)
*   **GitHub:** [https://github.com/](https://github.com/)
*   **ChatGPT:** [https://chat.openai.com/](https://chat.openai.com/)
*   **Google Gemini:** [https://gemini.google.com/](https://gemini.google.com/)
*   **Claude:** [https://claude.ai/](https://claude.ai/)
*   **v0.dev:** [https://v0.dev/](https://v0.dev/)
*   **Sentry:** [https://sentry.io/](https://sentry.io/)
*   **Trello:** [https://trello.com/](https://trello.com/)