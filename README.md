*This project has been created as part of the 42 curriculum by ekanaeva, altoulle, fmoses, & rdalal.*

# Jirok

## Description

Jirok is a task management platform built in the style of Jira. It allows user to create projects, manage members, and track issues. Key features include multi user shared projects, real time collaborative work boards, per project API keys, usage statics, oath, 2fa, and more! For each task in the project you can mark it's type, priority, status & assigned user.

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

There are two ways to run the application: using Docker (recommended) or manually (more complicated).

For Docker:
- Docker and Docker Compose v2
- make

Without Docker:
- Node.js 20
- PostgreSQL 15

### Environment variables

Create a root `.env` file before starting the stack.

```env
# Don't change these
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001

# Database connection info. Important: CHANGE THE PASSWORD
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=db
DATABASE_URL=postgresql://user:password@localhost:port/db?schema=public

# Token encryption key. Imporant: CHANGE ME
JWT_SECRET=change-me

# (optional) To generate 42 oath credentils go to https://profile.intra.42.fr/oauth/applications/new
FORTY_TWO_CLIENT_ID=your_42_client_id
FORTY_TWO_CLIENT_SECRET=your_42_client_secret
FORTY_TWO_CALLBACK_URL=http://localhost:3001/auth/42/callback
```

### Run with Docker

Go to jirok folder and run:

```bash
cd jirok
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

Note: You must have postgres running locally! https://www.postgresql.org/docs/current/server-start.html

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

The original project idea & design came from ekanaeva & altoulle. fmoses & rdalal joined later and contributed to discussions on technical choices and architecture. Further detials on what specific task members worked on can be found in the Features section and the Modules section.

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
- shadcn-style component structure
- TanStack Query for client state and server cache
- React Hook Form + Zod for forms and validation

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

### But Why?

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
- `api_keys`
  - Stores hashed API keys tied to a user and project.
  - Key fields: `id`, `user_id`, `project_id`, `key_hash`.

## Features List

| Feature | Description | Team member(s) |
| --- | --- | --- |
| Authentication | Sign up, sign in, JWT cookie sessions, logout, protected routes. | rdalal |
| 42 OAuth | OAuth login through the 42 intra provider. | altoulle |
| Two-factor authentication | Generate a QR code, enable TOTP, and verify login codes. | rdalal |
| Project management | Create and update projects, navigate dashboards, and view project data. | ekanaeva, altoulle |
| Membership management | List members, invite by email, change roles, and remove members. | ekanaeva, altoulle |
| Issue tracking | Create issues, edit them, assign users, change status, and browse backlog views. | ekanaeva, altoulle, fmoses |
| Drag and drop board | Move issues between statuses on the board. | fmoses |
| Realtime updates | Push project and issue changes to connected clients over WebSocket. | fmoses |
| User profiles | View and edit personal data, upload avatars, and browse other profiles. | ekanaeva, rdalal |
| Documentation pages | Privacy policy and terms links in the footer. | ekanaeva, altoulle |

## Modules

| Module | Points | Justification | Implementation | Team member(s) |
| --- | --- | --- | --- | --- |
| Use a framework for both the frontend and backend | 2 | Use modern tools for Web app development | Next.js for the frontend and NestJS for the backend, both TypeScript | ekanaeva, altoulle |
| Implement real-time features using WebSockets or similar technology | 2 | Real-time updates are essential in a collaborative task tracker so team members see changes without refreshing. Showing user online status as well. | Created a WebSocket service in NestJS that pushes changes live to the front end as they happen. Users can connect to any project they have access too any they will be informed of changes in real time, as well as being marked as online | fmoses |
| A public API to interact with the database with a secured API key, rate
limiting, documentation, and at least 5 endpoints | 2 |
A public REST API provides secure and standardized CRUD access to the database through well-documented endpoints.
 | API keys are hashed and stored per user/project; endpoints are documented via Swagger at `/docs` and cover projects, issues, users, authentication. | altoulle, rdalal |
| Use an ORM for the database | 1 |
Using an ORM allows secure, efficient, and simplified CRUD operations on the database through object-oriented code.
| Prisma is used throughout the backend for all database access and schema migrations. | altoulle, rdalal |
| Custom-made design system | 1 | A consistent design system gives the application a professional, cohesive look | Implemented a custom design system using Shadcn UI components and Tailwind CSS. | ekanaeva |
| Support for additional browsers | 1 | Ensuring the application works across major browsers improves accessibility and reaches a wider audience. | Tested and functional on Google Chrome, Firefox, and Brave using standard web APIs | rdalal |
| Standard user management and authentication | 2 | Secure authentication and user management are foundational to any multi-user platform. | Email/password sign-up and sign-in with bcrypt hashing, JWT cookie sessions, protected routes, and logout. | rdalal |
| Implement remote authentication with OAuth 2.0 (Google, GitHub, 42,
etc.) | 1 | OAuth simplifies onboarding for users who already have an account with a trusted provider. | 42 OAuth is implemented via Passport OAuth2, with callback handling and automatic account linking. | altoulle |
| Advanced permissions system | 2 | Different roles within a project require different levels of access to prevent unauthorized actions. | Users are assigned roles (e.g. admin, member, viewer) per project via the `user_projects` table; role checks are enforced at the API level. | altoulle | 
| Implement a complete 2FA (Two-Factor Authentication) system for the
users | 1 | 2FA adds a critical layer of account security on top of password authentication. | Users can scan a QR code to register a TOTP app and are prompted for a code on each login | rdalal |
| User activity analytics and insights dashboard | 1 | Giving users visibility into project activity helps teams track progress and spot bottlenecks. | A dashboard displays issue status breakdowns, and contribution metrics per project. | ekanaeva, altoulle |
| Modules of choice minor: Dark Mode | 1 | Dark mode is a feature that improves comfort for users working in low-light environments. | Next Theme was used to modify tailwind css variables to change all the colors of the site at once without have to check the theme for each individual component | fmoses |
| Modules of choice minor: Mobile Complient | 1 | Mobile compliance ensures the application is accessible, responsive, and provides a consistent user experience across mobile devices. | Implemented a responsive design using Tailwind CSS | ekanaeva, fmoses |

Total: 18 points

### Module implementation notes

- Authentication uses JWT cookies, guarded routes, and 42 OAuth
- Two-factor authentication uses TOTP secret generation and verification.
- Real-time updates are implemented with a WebSocket server on `/ws/projects`.
- The issue board uses drag and drop to move tasks across statuses.

## Individual Contributions

| Member   | Main contribution areas | Challenges / notes |
| -------- | --- | --- |
| ekanaeva | Project management frontend, membership management frontend, issue tracking frontend, user profiles frontend, activity dashboard, mobile responsiveness, custom design system (Shadcn UI + Tailwind), database architecture design (implemented through Prisma). | Building a coherent design system from scratch while simultaneously delivering features required constant attention to consistency across components. |
| altoulle | 42 OAuth, project management backend, membership management backend, issue tracking backend, advanced permissions system (admin/member/viewer roles), public API, database architecture design (implemented through Prisma), documentation pages, activity dashboard backend. | Designing a flexible role system that could be enforced consistently across all API endpoints without duplicating logic was a significant architectural challenge. |
| fmoses   | Drag and drop board, real-time updates via WebSocket, issue tracking frontend, dark mode. | Integrating WebSocket-driven state updates with the existing client-side cache required careful coordination to avoid stale or conflicting UI states. |
| rdalal   | Authentication (sign up, sign in, JWT sessions, logout, protected routes), two-factor authentication (TOTP + QR code), user profiles backend, public API, ORM setup, cross-browser testing and support. | Implementing a secure and complete auth stack — covering passwords, JWT, 2FA, and OAuth — while keeping the flow seamless for the end user was the most demanding part of the project. |

## Resources

### References

- NestJS documentation: https://docs.nestjs.com/
- NestJS Swagger documentation: https://docs.nestjs.com/openapi/introduction
- Prisma documentation: https://www.prisma.io/docs
- PostgreSQL documentation: https://www.postgresql.org/docs/
- Next.js documentation: https://nextjs.org/docs
- React documentation: https://react.dev/
- Passport documentation: https://www.passportjs.org/
- WebSocket overview: https://www.rfc-editor.org/rfc/rfc6455
- Tailwind CSS documentation: https://tailwindcss.com/docs

### AI usage

- used to help identify bugs (retroactivly and proactivly)
- used to synthesis docs
