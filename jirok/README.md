*This project has been created as part of the 42 curriculum by ekanaeva, altoulle, fmoses, & rdalal.*

# Jirok

## Description

Jirok is a task management platform built in the style of Jira. It allows user to create projects, manage members, and track issues.

The project is a full-stack typescript application built with Next.js, NestJS, Prisma, and PostgreSQL.

### Key features

- Email/password authentication with JWT cookies
- 42 OAuth login
- Two-factor authentication setup and verification (using TOTP)
- Project creation and member management
- Issue creation, assignment, status changes, and backlog views
- Real-time project updates using WebSocket
- User profiles with avatar upload
- Next.js & tailwind frontend
- Nest.js backend
- Swagger API documentation

## Instructions

### Prerequisites

Their are two ways to run the application: using Docker (recommended) or manually (more complicated).

For Docker:
- Docker and Docker Compose v2
- make

Without Docker:
- Node.js 20
- PostgreSQL 15

### Environment variables

Create a root `.env` file before starting the stack.

```env
POSTGRES_USER=jirok
POSTGRES_PASSWORD=jirok_secret
POSTGRES_DB=jirok_db
DATABASE_URL=postgresql://jirok:jirok_secret@localhost:5432/jirok_db?schema=public
JWT_SECRET=change-me
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
FORTY_TWO_CLIENT_ID=your_42_client_id
FORTY_TWO_CLIENT_SECRET=your_42_client_secret
FORTY_TWO_CALLBACK_URL=http://localhost:3001/auth/42/callback
```

### Run with Docker

From the repository root:

```bash
make start
```

Useful commands:

```bash
make logs
make ps
make clean
make fclean
make re
```

### Run locally without Docker

Backend:

```bash
cd backend
npm install
npm run start:dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

### URLs

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:3001`
- Backend Swagger docs: `http://localhost:3001/docs`

## Team Information

| Member   | Assigned role(s)                    |
| -------- | ----------------------------------- |
| ekanaeva | Product Owner + Frontend Developer  |
| altoulle | Project Manager + Backend Developer |
| fmoses   | Technical Lead + Frontend Developer |
| rdalal   | Backend Developer + DevOps          |

The original project idea & design came from ekanaeva & altoulle. fmoses & rdalal joined later and contributed to discussions on technical choices and architecture.

## Project Management

- Project Managment: We used jira to create tasks (sadly we had not yet implemented Jirok, otherwise we would have used it).
- Task distribution: We split up between frontend and backend developers. Each developer would take a new task from the backlog and work on it.
- Meetings / sync cadence: We meet every Tuesday at 13h30
- Communication channel: Discord group chat, fairly frequent 
- Code Managment: We used github. Each ticket had it's own branch and all changes must be done in a pull request.

## Technical Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI primitives
- shadcn-style component structure
- TanStack Query for client state and server cache
- React Hook Form + Zod for forms and validation
- DnD Kit for drag and drop interactions
- react-hot-toast for user feedback

### Backend

- NestJS 11
- Prisma ORM
- PostgreSQL
- Passport JWT authentication
- Passport OAuth2 for 42 login
- Swagger for API documentation
- `ws` for WebSocket updates
- bcrypt for password hashing
- otplib and qrcode for two-factor authentication

### But Why???????

We chose a javascript based stack since it's very popular and usefull to know career wise. As for the specific choices of Next.js, NestJS, & Prisma, we chose them for their strong type and validation support, making it easier to write clean, secure, & error free code. PostgreSQL was chosen for it's first class support from Prisma.

## Database Schema

```mermaid
erDiagram
  User ||--o{ UserProject : joins
  Project ||--o{ UserProject : has
  Project ||--o{ Issue : contains
  User ||--o{ Issue : reports
  User ||--o{ Issue : assigned_to
  User ||--o{ Issue : changed_by
  Issue ||--o{ Comment : has
  User ||--o{ Comment : writes
  User ||--o{ Attachment : uploads
  User ||--o{ Notification : receives
  User ||--o{ ApiKey : owns
  Project ||--o{ ApiKey : uses
```

### Tables

- `users`
  - Stores profile data, authentication data, 2FA settings, and avatar information.
  - Key fields: `id`, `name`, `surname`, `email`, `password_hash`, `forty_two_id`, `avatar_url`, `two_factor_secret`, `is_two_factor_enabled`.
- `projects`
  - Stores project identity and metadata.
  - Key fields: `id`, `name`, `project_key`.
- `user_projects`
  - Join table linking users to projects with a role.
  - Key fields: `user_id`, `project_id`, `role`, `joined_at`.
- `issues`
  - Stores task and bug tracking data.
  - Key fields: `id`, `project_id`, `reporter_id`, `assignee_id`, `status`, `type`, `title`, `priority`.
- `comments`
  - Stores issue discussion messages.
  - Key fields: `id`, `issue_id`, `author_id`, `description`.
- `attachments`
  - Stores uploaded files linked to an entity.
  - Key fields: `id`, `file_name`, `file_size`, `storage_path`, `entity_type`, `entity_id`.
- `notifications`
  - Stores user notifications and event metadata.
  - Key fields: `id`, `user_id`, `entity_type`, `entity_id`, `event_type`, `is_read`.
- `api_keys`
  - Stores hashed API keys tied to a user and project.
  - Key fields: `id`, `user_id`, `project_id`, `key_hash`.

## Features List

| Feature | Description | Team member(s) |
| --- | --- | --- |
| Authentication | Sign up, sign in, JWT cookie sessions, logout, protected routes. | TBD |
| 42 OAuth | OAuth login through the 42 intra provider. | TBD |
| Two-factor authentication | Generate a QR code, enable TOTP, and verify login codes. | TBD |
| Project management | Create and update projects, navigate dashboards, and view project data. | TBD |
| Membership management | List members, invite by email, change roles, and remove members. | TBD |
| Issue tracking | Create issues, edit them, assign users, change status, and browse backlog views. | TBD |
| Drag and drop board | Move issues between statuses on the board. | TBD |
| Realtime updates | Push project and issue changes to connected clients over WebSocket. | TBD |
| User profiles | View and edit personal data, upload avatars, and browse other profiles. | TBD |
| Notifications / activity views | Display project activity and related updates. | TBD |
| Documentation pages | Privacy policy and terms links in the footer. | TBD |

## Modules

| Module | Points | Justification | Implementation | Team member(s) |
| --- | --- | --- | --- | --- |
| Use a framework for both the frontend and backend | 2 | TBD | TBD | TBD |
| Implement real-time features using WebSockets or similar technology | 2 |
| A public API to interact with the database with a secured API key, rate
limiting, documentation, and at least 5 endpoints | 2 |
| Use an ORM for the database | 1 |
| Custom-made design system | 1 | 
| Support for additional browsers | 1 |
| Standard user management and authentication | 2 |
| Implement remote authentication with OAuth 2.0 (Google, GitHub, 42,
etc.) | 1 | 
| Advanced permissions system | 2 |
| Implement a complete 2FA (Two-Factor Authentication) system for the
users | 1 | 
| User activity analytics and insights dashboard | 1 |
| Modules of choice minor: Dark Mode | 1 | 
| Modules of choice minor: Mobile Complient | 1 | 

Total: 18 points

### Module implementation notes

- Authentication uses JWT cookies, guarded routes, and 42 OAuth
- Two-factor authentication uses TOTP secret generation and verification.
- Real-time updates are implemented with a WebSocket server on `/ws/projects`.
- The issue board uses drag and drop to move tasks across statuses.

## Individual Contributions

| Member   | Main contribution areas | Challenges / notes |
| -------- | --- | --- |
| ekanaeva | TBD | TBD |
| altoulle | TBD | TBD |
| fmoses   | TBD | TBD |
| rdalal   | TBD | TBD |

## Resources

### References

- NestJS documentation: https://docs.nestjs.com/
- NestJS Swagger documentation: https://docs.nestjs.com/openapi/introduction
- Prisma documentation: https://www.prisma.io/docs
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Next.js documentation: https://nextjs.org/docs
- React documentation: https://react.dev/
- Passport documentation: https://www.passportjs.org/
- WebSocket RFC 6455 overview: https://www.rfc-editor.org/rfc/rfc6455
- Tailwind CSS documentation: https://tailwindcss.com/docs

### AI usage

- used to help identify bugs (retroactivly and proactivly)
- used to synthesis docs
