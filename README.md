Secure Task Management System - README

Setup Instructions
1. Clone the repository and navigate to the root folder.
2. Install dependencies:
•	   npm install
3. Setup environment variables by creating a `.env` file in `apps/api/` with:
•	   JWT_SECRET=your_secret_key
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_user
   DB_PASS=your_password
   DB_NAME=securetasks
4. Run backend:
•	   nx serve api
5. Run frontend:
•	   nx serve dashboard
Architecture Overview
This project is built in an NX monorepo structure, with modular separation:
• apps/api → NestJS backend with RBAC, JWT, and PostgreSQL integration
• apps/dashboard → Angular frontend with TailwindCSS & Flowbite UI
• libs/data → Shared interfaces and enums for consistency
• libs/auth → RBAC decorators, guards, and permission logic
Data Model Explanation
Entities:
• User: belongs to an Organization, has a Role (Owner/Admin/Viewer)
• Organization: hierarchical structure (OrgA, OrgB)
• Task: belongs to a User & Organization
• Role Enum: OWNER, ADMIN, VIEWER
ERD DIAGRAM (CREATED FROM DBDIAGRAM.IO)
 
Access Control Implementation
RBAC is enforced with NestJS Guards & Decorators:
• Owner: Full access within their organization
• Admin: Can manage tasks in their organization
• Viewer: Read-only access
Access is scoped by org hierarchy, checked at every request using JWT + Guards.
API Docs
Authentication:
POST /auth/login → { email, password } → { access_token }
Tasks:
• POST /tasks → Create task (requires JWT)
• GET /tasks → List accessible tasks
• PUT /tasks/:id → Edit task if permitted
• DELETE /tasks/:id → Delete task if permitted
Audit:
• GET /audit-log → Only accessible by Owner/Admin
Future Considerations
• Implement JWT refresh tokens & CSRF protection
• Optimize RBAC with caching strategies
• Extend RBAC for fine-grained permissions (per-task, per-user)
• Scaling: Sharding databases, introducing GraphQL API layer
