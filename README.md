# 🎓 EduLynx - School Management Dashboard

**A comprehensive, modern school management system built with Next.js,
TypeScript, and Prisma**

Developed by LYNX Consulting South Africa (Pty) Ltd

---

## 🚀 Features

- **Role-Based Access Control**: Admin, Teacher, Parent, and Student dashboards
- **Real-Time Data**: Live analytics and performance tracking
- **Modern UI/UX**: Responsive design with Tailwind CSS
- **Secure Authentication**: JWT-based authentication with bcrypt password
  hashing
- **AI Integration**: Prof Lynx AI assistant powered by Google Gemini
- **Data Management**: Complete CRUD operations for all entities
- **Advanced Tables**: Sortable, searchable, and paginated data tables
- **Analytics Dashboard**: Real-time insights and reporting

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **AI**: Google Gemini API
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel-ready

## 📋 Demo Accounts

Use these accounts to test different roles:

- **Admin**: <admin@lynxacademy.co.za> / adminpass
- **Teacher**: <teacher1@lynxacademy.co.za> / teacherpass
- **Parent**: <parent1@lynxacademy.co.za> / parentpass
- **Student**: <student1@lynxacademy.co.za> / studentpass

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Git

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd EduLynx
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your database URL, JWT secret, and API keys.

1. Set up the database:

```bash
npx prisma migrate dev
npx prisma db seed
```

1. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying `app/page.tsx`. The page
auto-updates as you edit the file.

## Learn More

## 🙏 Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Table](https://tanstack.com/table/v8)

---

**© 2025 LYNX Consulting South Africa (Pty) Ltd. All rights reserved.**
