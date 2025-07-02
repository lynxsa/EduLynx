# 🦁 LYNXLearn LMS - South African High School Learning Platform

A modern, comprehensive Learning Management System specifically designed for
South African high school students (Grades 8-12) with CAPS-aligned curriculum
and AI-powered learning assistance.

## 🚀 **IMPLEMENTATION STATUS**

### ✅ **Completed - PR 1: Repo Audit & UI Components**

- **Enhanced Course Structure**: Complete course detail pages with modules and
  lessons
- **Lesson Player**: Full-featured lesson page with video player, resources, and
  quiz integration
- **UI Component Library**: Badge, Button, Card, Progress, Chat Widget, Quiz
  System, Theme Toggle
- **Theme System**: Complete dark/light mode support with system preference
  detection
- **API Routes**: Enhanced courses API with filtering, pagination, and detailed
  course data
- **Navigation**: Modern sidebar navigation with user profiles and quick actions
- **Error Handling**: Comprehensive error boundaries and loading states

### ✅ **Completed - PR 2: Landing Page & Theme Toggle**

- **Modern Landing Page**: Hero slider with featured courses and "Why EduLynx?"
  section
- **Theme Provider**: Complete theme management system with localStorage
  persistence
- **Dark Mode**: Full dark mode support across all components
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Course Grid**: Interactive course browsing with ratings and enrollment
  status

### 🔄 **In Progress - PR 3: Auth Flow & Demo Seed**

- **Enhanced Auth Pages**: Modern sign-in/sign-up with Formik validation
- **Demo Accounts**: Pre-configured demo users with course enrollments
- **SSO Integration**: Shared authentication with EduLynx marketing site

### 📋 **Roadmap - Remaining PRs**

#### **PR 4: Dashboard & Student Flow**

- Enhanced dashboard with learning analytics
- Continue Learning cards with progress tracking
- Upcoming deadlines and notifications
- Course recommendations based on performance

#### **PR 5: Course & Lesson View + AI Chat**

- Complete ProfLynx AI integration
- Interactive lesson content with real-time feedback
- Chat widget with lesson context awareness
- Video player with note-taking capabilities

#### **PR 6: API Routes & Database Seeding**

- Complete CAPS-aligned course content
- Database schema with proper relationships
- Seeding scripts for realistic data
- Analytics and progress tracking APIs

#### **PR 7: Accessibility & Admin Portal**

- WCAG 2.1 AA compliance
- Keyboard navigation and screen reader support
- Admin portal for content management
- Offline capabilities with service workers

#### **PR 8: CI/CD & Documentation**

- GitHub Actions for testing and deployment
- Lighthouse CI for performance monitoring
- Jest unit tests and Cypress E2E tests
- Complete API documentation

## 🎯 **Key Features**

### **For Students:**

- 📚 **CAPS-Aligned Content**: Complete Grade 8-12 curriculum
- 🤖 **ProfLynx AI Tutor**: 24/7 learning assistance and explanations
- 📱 **Mobile-First Design**: Optimized for smartphones and tablets
- 🌍 **Multilingual Support**: 11 South African official languages
- 📊 **Progress Tracking**: Detailed analytics and performance insights
- 🏆 **Gamification**: Points, badges, and achievement systems
- 📥 **Offline Mode**: Download lessons for offline studying

### **For Educators:**

- 📈 **Analytics Dashboard**: Student progress and engagement metrics
- 📝 **Content Management**: Easy course creation and editing tools
- 🎯 **Assessment Tools**: Quiz builder and automated grading
- 💬 **Communication**: Direct messaging and announcement systems
- 📋 **Gradebook**: Comprehensive grade tracking and reporting

### **For Parents:**

- 👀 **Progress Monitoring**: Real-time updates on student performance
- 📧 **Notifications**: Email alerts for assignments and deadlines
- 📊 **Reports**: Weekly/monthly progress summaries
- 🎯 **Goal Setting**: Collaborative target setting with students

## 🛠 **Technology Stack**

### **Frontend:**

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v3** - Utility-first styling with dark mode
- **React 18** - Latest React features and concurrent rendering
- **Lucide React** - Beautiful, customizable icons
- **Framer Motion** - Smooth animations and transitions

### **Backend & Database:**

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **NextAuth.js** - Authentication and session management

### **Development & Quality:**

- **ESLint & Prettier** - Code linting and formatting
- **Husky** - Git hooks for quality gates
- **Jest** - Unit testing framework
- **Cypress** - End-to-end testing
- **GitHub Actions** - CI/CD pipeline

## 🚀 **Getting Started**

### **Prerequisites:**

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Git

### **Installation:**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/lynxsa/EduLynx.git
   cd EduLynx/packages/lynxlearn-lms
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Setup environment variables:**

   ```bash
   cp .env.example .env.local
   ```

4. **Configure your `.env.local`:**

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/lynxlearn"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

5. **Setup database:**

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

6. **Start development server:**

   ```bash
   npm run dev
   ```

7. **Open your browser:** Navigate to `http://localhost:3000`

### **Demo Accounts:**

- **Student**: `student@demo.com` / `Demo123!`
- **Teacher**: `teacher@demo.com` / `Demo123!`
- **Admin**: `admin@demo.com` / `Demo123!`

## 📚 **Course Structure**

### **Available Subjects (CAPS-Aligned):**

- **Mathematics** (Grades 8-12)
- **Physical Sciences** (Grades 10-12)
- **Life Sciences** (Grades 10-12)
- **English Home Language** (Grades 8-12)
- **Afrikaans First Additional Language** (Grades 8-12)
- **History** (Grades 8-12)
- **Geography** (Grades 8-12)
- **Accounting** (Grades 10-12)
- **Business Studies** (Grades 10-12)
- **Information Technology** (Grades 10-12)

### **Learning Features:**

- 🎥 **Video Lessons** with subtitles in multiple languages
- 📖 **Interactive Reading Materials** with note-taking
- 🧪 **Virtual Labs** for science subjects
- 📝 **Practice Quizzes** with instant feedback
- 📊 **Progress Tracking** and performance analytics
- 🤖 **AI Tutoring** with ProfLynx assistant

## 🎨 **Design System**

### **Colors:**

- **Primary**: Purple (#9333ea) - Learning and growth
- **Secondary**: Blue (#3b82f6) - Trust and reliability
- **Accent**: Green (#10b981) - Success and achievement
- **Warning**: Orange (#f59e0b) - Attention and caution
- **Error**: Red (#ef4444) - Errors and critical alerts

### **Typography:**

- **Headings**: Inter (Bold, Semibold)
- **Body**: Inter (Regular, Medium)
- **Code**: JetBrains Mono

### **Components:**

All components follow consistent design patterns with:

- Proper focus states for accessibility
- Dark mode variants
- Responsive breakpoints
- Loading and error states

## 🔧 **Development Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Database
npx prisma studio    # Open Prisma Studio
npx prisma db seed   # Seed database with demo data
npx prisma migrate   # Run database migrations

# Testing
npm run test         # Run Jest unit tests
npm run test:e2e     # Run Cypress E2E tests
npm run test:watch   # Run tests in watch mode
```

## 📱 **Mobile App**

The LYNXLearn mobile app (React Native) provides:

- Offline lesson downloads
- Push notifications for assignments
- Biometric authentication
- Native video player
- Background audio for podcasts

## 🌍 **Localization**

Supported languages:

- **English** (Primary)
- **Afrikaans**
- **isiZulu**
- **isiXhosa**
- **Sepedi**
- **Setswana**
- **Sesotho**
- **Xitsonga**
- **siSwati**
- **Tshivenda**
- **isiNdebele**

## 🤝 **Contributing**

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md)
for details on:

- Code of Conduct
- Development workflow
- Testing requirements
- Pull request process

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## 🏢 **About LYNX Consulting**

LYNXLearn is developed by **LYNX Consulting South Africa (Pty) Ltd**, a leading
educational technology company focused on transforming learning experiences
across Africa.

**Contact:**

- 📧 Email: support@edulynx.co.za
- 🌐 Website: https://edulynx.co.za
- 📱 WhatsApp: +27 XX XXX XXXX

---

**Made with ❤️ in South Africa for the future of African education**
