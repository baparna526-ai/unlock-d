**System Architecture & Orchestration**
Instead of a monolithic application where all the code runs together, we designed the platform using a decoupled, multi-container architecture managed through Docker Compose. This splits the ecosystem into two isolated microservices that run independently and communicate over the network via standard HTTP API requests.

Frontend Client Layer (React + Vite): Running inside its own container on port 5173. It handles UI rendering, single-page routing (switching between the Dashboard, Analytics, and Groups views), and client-side state tracking. To keep clean architectural boundaries, the frontend never touches the database directly; it relies entirely on dispatching asynchronous JSON network requests to the backend whenever a user interacts with the app.

Backend API Layer (Node.js + Express + MongoDB): Hosted in a separate container on port 5000. This serves as the central brain of the project, housing our core business logic, balance validation mechanisms, and the dynamic math behind our group expense splits. It securely persists and pulls data by interfacing with our MongoDB database through a Mongoose Object Data Modeling (ODM) layer.


**Key Engineering Benefits**
Fault Isolation: Because the frontend and backend are sandboxed, a database crash or server-side timeout won't freeze the client browser or bring down the UI, preventing a backend bug from causing a total project failure.

Unified Runtimes: Dockerizing these decoupled layers completely eliminates local setup friction (like mismatched local Node versions or OS-specific path bugs), ensuring that our teammates and the judges run the exact same environment out of the box with zero configuration headache.

Database Schema & Data Models
To enforce data consistency across our MERN stack layers, we defined strict object models using Mongoose schemas. We structured our database around three primary models to isolate personal banking actions from shared group tracking logic:

User / Auth Schema: Handles the secure identity metrics needed for account access. It captures essential profile fields including a unique username, dateOfBirth, and encrypted password strings.

Transaction Schema: Tracks personal monetary movement across the ecosystem. It maps the user's selected sub-account type (Savings, Checking, or Business), logs the recipientName, records the specific numerical amount, appends custom text remarks, and defaults to a Success status coupled with an automated creation timestamp.

Group Expense Schema: Architected specifically to support our collaborative expense ledger features. It initializes a distinct groupName and hosts an array of dynamic members. Nested within each group document is a running list of tracked expenses, capturing the expenseName, amount, and paidBy fields for every single item logged alongside a primary totalExpense integer that dynamically updates based on real-time backend calculations.


**Core Logic Flow & Data Lifecycles**
Rather than forcing heavy browser refreshes, our system relies on a predictable, single-page lifecycle to handle state updates smoothly across container boundaries in real time.

The lifecycle starts at the Client Trigger & Capture phase. When a user interacts with the UI—whether they are entering a text remark on the money transfer page or logging a new group expense—React instantly captures the raw input parameters directly into its local component state.

From there, the application triggers an Asynchronous API Dispatch. The frontend bundles those state variables into a structured JSON payload and fires an asynchronous HTTP network request directly to our Express server endpoints.

Once received, the system enters Backend Validation & Execution. The Express server catches the incoming request and passes it to our controller logic, executing real-time computations on the fly. The backend verifies that a user's available balance can cover a transfer, aggregates financial averages to supply data to the analytics bar charts, or recalculates group expense splits.

Finally, the cycle concludes with Database Persistence & UI Sync. Once the data passes validation, the backend updates MongoDB via our Mongoose layer. The database returns the freshly updated record to the Express server, which pipes it right back to the client container. React catches the new data payload, instantly hydrates the global state tree, and updates the view in real time automatically shifting the progress meter on the monthly budget bar or instantly appending a new name to the recent transactions log.


**Technical Problem-Solving & Engineering Fixes****
Moving a local MERN stack app into a strict containerized state always uncovers environment wrinkles. During the integration phase, we ran into and debugged two critical architectural roadblocks to make sure the workspace deploys flawlessly:

Cross-Platform Architecture Conflict: Running Docker containers on Windows host machines initially threw a severe native binary binding error with our frontend building engine (Cannot find module '@rolldown/binding-linux-x64-musl'). This happened because the bundler expected a host-specific environment rather than the container's virtualized Linux system. We engineered around this host-to-container friction by configuring anonymous volume overrides (/app/node_modules and /app/.vite) in our master docker-compose.yml file, which forced all dependency layers to compile cleanly and isolate inside the target Linux container runtime environment.

Runtime Pathing & Module Disconnects: When we first booted up the container cluster, our backend service suffered instant runtime crashes because Node was attempting to execute a default entry script file (/app/index.js) that didn't match our specific workspace folder structure. We traced the problem back to unaligned entry points inside the backend configurations. We resolved the crash by explicitly mapping the primary execution script entry points directly to the real JavaScript source files, establishing a continuous, high-availability backend cluster that starts up successfully with a single command.
