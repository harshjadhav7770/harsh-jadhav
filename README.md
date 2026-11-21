# SKILLHUB Dynamic Portfolio Management System

A production-ready, secure, high-performance, dynamic portfolio CMS platform engineered for candidates of **SKILLHUB IT SOLUTION**.

- **Organization**: SKILLHUB IT SOLUTION
- **Author**: Akash Dhone
- **Brand Credit**: Built with SKILLHUB
- **Website**: [https://www.skillhubdev.com](https://www.skillhubdev.com)

---

## 🌟 Overview

The SKILLHUB Dynamic Portfolio System is not a static portfolio template. It is a full-featured Content Management System (CMS) with an interactive multi-step installation wizard and single-administrator control panel.

Candidates can clone this repository, configure their environment variables via CLI or `.env.local`, select their professional track (**Data Analytics**, **Full Stack Development**, or **Both**), and automatically generate an enterprise-grade portfolio with realistic case studies and skills.

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone <repository-url>
cd <project-directory>
npm install
```

### 2. Configure Environment Variables
Run the interactive terminal helper:
```bash
npm run setup:env
```
Or copy `.env.example` to `.env.local` and define `SKILLHUB_MONGODB_URI` and `SKILLHUB_AUTH_SECRET`.

### 3. Launch Development Server
```bash
npm run dev
```

### 4. Complete Setup Wizard
Visit [http://localhost:3000](http://localhost:3000) in your browser. The application will automatically guide you through:
1. **Welcome & Attribution**: Review setup objectives.
2. **Environment Validation**: Verify that required variables are loaded.
3. **Database Test**: Real-time ping to your MongoDB cluster.
4. **Specialization Selection**: Choose **Data Analytics**, **Full Stack**, or **Both**.
5. **Admin Account**: Set up your exclusive admin credentials.
6. **Express or Full Setup**: Seed starter case studies and competencies.
7. **Launch**: Lock setup and publish your live portfolio!

---

## 📚 Documentation Index

- [Installation Guide (INSTALLATION.md)](./INSTALLATION.md) — Detailed walkthrough of local & cloud setup.
- [Environment Configuration (ENVIRONMENT.md)](./ENVIRONMENT.md) — Reference for all `SKILLHUB_*` environment variables.
- [Database Architecture (DATABASE.md)](./DATABASE.md) — 14 Mongoose collections, relationships, and indexing.
- [Vercel Deployment Guide (DEPLOYMENT.md)](./DEPLOYMENT.md) — Step-by-step production deployment to Vercel and MongoDB Atlas.
- [Security Architecture (SECURITY.md)](./SECURITY.md) — Rate-limiting, password hashing, and cookie session security.
- [Admin CMS Guide (ADMIN_GUIDE.md)](./ADMIN_GUIDE.md) — Managing case studies, skills, media, and site settings.

---

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router, Server Components by default)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS & shadcn/ui (`sidebar-07` layout)
- **Database**: MongoDB with Mongoose ODM (singleton connection cache)
- **Authentication**: Stateless encrypted JWT (`jose`) in HttpOnly cookies
- **Password Hashing**: `bcryptjs` with salt factor 12
- **Validation**: Zod schema validation
- **Media CDN**: Cloudinary with secure server-signed direct uploads
- **Email**: Nodemailer with Gmail SMTP (dual responsive branded templates)
- **Hosting**: Optimized for Vercel Serverless Architecture

---

## 📄 License & Attribution

Developed by **Akash Dhone** for **SKILLHUB IT SOLUTION**.  
Attribution: **Built with SKILLHUB** &bull; [www.skillhubdev.com](https://www.skillhubdev.com)
