**Prompt to Build an Agent Hub with API Layer, Authentication, Supabase, and Vercel**

**Goal**

Design and implement a modular **Agent Hub** with the following features:

1.  Self-contained agents, each in its own folder, to handle complex and independent logic.

2.  A centralized **API layer** for task orchestration, database interaction, and securing sensitive operations.

3.  **Authentication** using Supabase to manage user sessions and enforce role-based access control (RBAC).

4.  Supabase as the backend for storing logs, tasks, and optional agent configurations.

5.  A Next.js frontend to serve as the Agent Hub dashboard for managing agents, viewing logs, and triggering tasks.

6.  Deploy the entire application on Vercel for scalability and serverless execution.

**Architecture**

**Core Components**

- **Agents**: Each agent has its own folder, including its unique logic, configuration, and task handlers. Agents should be self-contained for modularity and scalability.

- **API Layer**: Centralized serverless API endpoints for:

- Routing tasks to agents based on requests.

- Logging agent activity in the database.

- Managing authentication and enforcing secure interactions.

- **Authentication**: Use Supabase to handle user authentication and RBAC. Ensure only authorized users can access the dashboard or trigger API actions.

- **Frontend**: A Next.js dashboard that:

- Displays logs of agent activity.

- Allows users to trigger tasks manually.

- Provides role-specific controls based on authentication.

- **Database**: Use Supabase tables to:

- Store logs of agent task executions.

- Manage user data and roles.

- Optionally store agent-specific metadata or configurations.

**File Structure**

Define the following structure for clarity and modularity:

- A folder for each agent under a central agents directory, encapsulating all related logic and configuration.

- A folder for API routes to manage backend logic and task orchestration.

- Supabase integration in a db folder, including client initialization and models for logs and user data.

- A pages directory for the Next.js frontend, containing dashboard and authentication-related pages.

- A utils directory for reusable utilities like model calls, schedulers, and email handling.

**Supabase Setup**

**Authentication**

- Enable Supabase Auth to support email/password login and optional third-party providers (e.g., Google).

- Configure role-based access control (RBAC) to define roles like "admin" and "user."

- Use Supabase session management to ensure secure API access by authorized users only.

**API Tokens**

- Implement a feature in the settings section under "API Tokens" where users can generate, view, and revoke API tokens for each agent. Each token should be unique to an agent and used to authenticate API requests securely.

**Database Tables**

1.  **Logs Table**:

- Columns: id, agent_name, task, result, created_at.

- Purpose: Store details of all agent task executions.

2.  **Users Table**:

- Columns: id, email, role, created_at.

- Purpose: Manage user data and roles for authentication and RBAC.

**Implementation Steps**

1.  **Build Self-Contained Agents**:

- Each agent should include a run function to execute tasks.

- Modularize logic with subdirectories for tasks, utilities, and configurations.

2.  **Create a Centralized API Layer**:

- Define API endpoints to:

- Route tasks to the appropriate agents.

- Log task execution details in Supabase.

- Validate user authentication and role permissions before task execution.

- Ensure the API acts as a secure intermediary between the frontend and agents.

3.  **Set Up Supabase Integration**:

- Use Supabase for database and authentication.

- Store logs of agent activity in a dedicated table.

- Ensure only authenticated and authorized users can trigger agents or view logs.

4.  **Design a Frontend Dashboard**:

- Use Next.js to create a responsive, user-friendly dashboard.

- Include features to:

- View agent activity logs.

- Trigger agent tasks manually.

- Manage users and roles (if required).

- Redirect unauthorized users to a login page.

5.  **Add Authentication**:

- Use Supabase Auth for user login and session management.

- Protect API routes to ensure only authenticated users can interact with agents or fetch logs.

6.  **Deploy on Vercel**:

- Push the codebase to GitHub and connect it to Vercel.

- Configure environment variables for Supabase (SUPABASE_URL, SUPABASE_KEY) and any other sensitive data.

- Test the deployment to ensure smooth functionality across authentication, task orchestration, and frontend interaction.

**Deployment Workflow**

1.  Push your codebase to a GitHub repository.

2.  Create a Supabase project and configure authentication and database tables.

3.  Deploy the application to Vercel by connecting it to the GitHub repository.

4.  Set environment variables in Vercel for Supabase credentials and other required keys.

5.  Test the deployment for:

- User login and role-based access.

- Task execution by agents.

- Logs being stored correctly in Supabase.

### Prompt

```
Read @plan.md and start the build. You are a principle engineer at your startup building this new app for your client.

You work smart and systematic. Taking your time to reduce mistakes. If you need any help, as me, I am your product manager.
```
