## UniPlan – Academic Calendar for Students
 Tired of having to check multiple places to figure out where and when you have classes? Use **UniPlan** - an academic calendar for students.

> Instead of juggling multiple university systems, spreadsheets, and screenshots
> of schedules, UniPlan gives you a clean weekly view of your classes and other
> events, grouped into calendars you actually control.

UniPlan was originally meant to be an app for myself and my friends, but I decided to open-source it in case someone else finds it useful.

---

### What UniPlan does

- **Weekly calendar view**: See your current week at a glance, with start/end
  times and a focus on "what's next".
- **Groups / calendars**:
  - **Class groups** – shared calendars for courses or groups of people.
  - **Personal calendar** – created automatically on sign‑up, just for you.
- **Recurring events**: Model lectures, labs, or other repeating activities via
  recurring event templates.
- **Per‑group visibility**: Choose which groups are visible on your
  calendar and color-code them to your liking.


The project is still in active development, so expect rough edges and breaking
changes. It is **not** production-ready software – more of a playground for
ideas around student scheduling and group management.

---

### Tech stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **API layer**: [tRPC](https://trpc.io) with React Query
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) +
  [Prisma](https://www.prisma.io)
- **Auth**: [Better Auth](https://better-auth.com/) (Email-based authentication)
- **Styling & UI**:
  - [Tailwind CSS 4](https://tailwindcss.com/)
  - [shadcn/ui](https://ui.shadcn.com/) + [Radix](https://www.radix-ui.com/)
  - [lucide-react](https://lucide.dev/) icons

> The project was originally bootstrapped with `create-t3-app`.

---

### Getting started (local development)

#### 1. Prerequisites

- **Node.js** 
- **pnpm** 
- **PostgreSQL** instance

#### 2. Clone and install

```bash
git clone https://github.com/yanuu1337/uniplan.git
cd uniplan
pnpm install
```

#### 3. Environment variables

Use the provided example file:

```bash
cp .env.example .env
```

Then fill in:

If you need to add more environment variables, update the schema in `src/env.js`.

#### 4. Database

Generate and apply migrations using Prisma:

```bash
pnpm db:generate    # prisma migrate dev
# or
pnpm db:push        # prisma db push (for quick local setup)
```

You can inspect the database with:

```bash
pnpm db:studio
```

#### 5. Run the dev server

```bash
pnpm dev
```

By default the app runs on `http://localhost:3067`.

Sign up with your email – UniPlan will automatically create a **personal
calendar group** for you behind the scenes.

---



### Contributions

This is a personal / hobby project, so the roadmap and priorities are driven by
what seems useful at the moment.

If you're reading this and feel like contributing (bug fixes, UX/UI improvements,
or new ideas), feel free to open an issue or a pull request – even small ones are welcome.

---

