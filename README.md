# Notice Board Web Application

A premium, modern, and responsive Notice Board web application built using the Next.js Pages Router, Prisma, and TiDB Cloud Serverless (MySQL). It features full CRUD capabilities, server-side data sorting, dark mode adaptability, and an optional image attachment feature.

## Features

- **Full CRUD Capabilities**: Create, read, edit, and delete announcements seamlessly.
- **Urgent Announcement Priority**: Notices are sorted with "Urgent" notices placed first, followed by remaining notices ordered chronologically by publish date. This is managed directly at the database query level via Prisma.
- **Client & Server Validation**: Input validation guarantees required fields are present, dates are in valid formats, and categorizations/priorities conform to restricted enums.
- **Confirmation Flow**: Deletion triggers a safety modal to confirm execution and prevent accidental loss.
- **Theme Adaptability**: High-quality dark/light mode toggle with modern typography (Geist font) and custom responsive grid.
- **Optional Image Attachment**: Users can attach images to announcements which are encoded to Base64 data-URIs and persisted in the database.

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Access to a MySQL database (e.g., TiDB Cloud Serverless)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yash-2511/Notice-board-nextjs.git
   cd Notice-board-nextjs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and define your connection string (refer to `.env.example`):
   ```env
   DATABASE_URL="mysql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE>?sslaccept=strict"
   ```

4. **Sync Prisma Database Schema**:
   Synchronize the database table definition and generate Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

6. **Build for Production**:
   To validate production bundles and verify types:
   ```bash
   npm run build
   ```

---

## Future Enhancements & Scalability

If we had more time, we could implement the following features:

1. **Advanced Searching and Filtering**:
   Allow users to filter announcements by Category (Exam, Event, General), search titles/bodies using text inputs, or filter by publish date ranges.
2. **Client-Side Image Optimization**:
   Add canvas-based resizing/compression directly in the browser before encoding images to Base64, helping to keep request payloads extremely small (under 100KB) and improving database load times.
3. **Authentication & Authorization**:
   Integrate an auth library (like NextAuth.js) to restrict notice mutations (Create, Edit, Delete) to administrator accounts, while allowing public read access.
4. **Pagination / Infinite Scroll**:
   Fetch notices lazily or introduce pagination pages to manage performance as the database grows to hundreds of records.
5. **Real-time Updates**:
   Use WebSockets or server-sent events (SSE) to push new notices to active dashboard viewers in real time.

---

## AI Implementation Details

This project was built in collaboration with **Antigravity**, an agentic AI coding assistant designed by Google DeepMind. AI was utilized in the following areas:

- **Schema & Database Configuration**: Configuring the Prisma schema model, selecting appropriate database field structures (like `LongText` for base64 storage), and mapping connection credentials for TiDB Cloud integration.
- **API Design & Validation**: Generating RESTful endpoints under `/pages/api/notices.js` utilizing specific status codes, strict enum checks, and try-catch error handling.
- **Component Development**: Crafting the accessible and responsive TailwindCSS layouts, custom modal flows, form validations, and dark-mode styling tokens.
- **Automated Verification**: Running dev tasks, monitoring build output logs, and coordinating Jetski browser subagents to perform end-to-end user path validation (such as validation feedback, modal toggling, updating notices, and deletion confirmations).
