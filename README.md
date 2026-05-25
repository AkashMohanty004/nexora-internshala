# 🚀 Nexora — Next-Gen Learning Dashboard

> A futuristic AI-powered learning dashboard built with modern web technologies, buttery smooth animations, and a premium SaaS-inspired UI.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-38BDF8?style=for-the-badge&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/FramerMotion-black?style=for-the-badge&logo=framer)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-black?style=for-the-badge&logo=vercel)

---

# ✨ Overview

Nexora is a futuristic education dashboard designed with a premium modern UI inspired by platforms like:

- 🌌 Linear
- ⚡ Vercel
- 🎨 Framer
- 🤖 Modern AI SaaS Apps

The application focuses heavily on:

✅ Smooth motion design  
✅ Zero layout shifts  
✅ Responsive Bento Grid UI  
✅ Server-side data fetching  
✅ Premium glassmorphism aesthetics  
✅ Hardware-accelerated animations  

---

# 🖥️ Features

## 🎯 Core Features

- 🌑 Dark futuristic UI
- 🧊 Glassmorphism effects
- 📦 Bento grid dashboard layout
- 📚 Dynamic course cards
- 📈 Animated progress bars
- ⚡ Framer Motion animations
- 🧠 Activity analytics tile
- 📱 Fully responsive design
- 🚀 Server-side Supabase integration
- 🔄 Skeleton loading states
- 🛡️ Graceful error handling

---

# 🧰 Tech Stack

| Technology | Usage |
|---|---|
| ⚛️ Next.js 15 | App Router Framework |
| 🔷 TypeScript | Type Safety |
| 🎨 Tailwind CSS | Styling |
| 🎬 Framer Motion | Animations |
| 🛢️ Supabase | Database & Backend |
| 🧩 Lucide React | Icons |
| ▲ Vercel | Deployment |

---

# 📂 Folder Structure

```bash
app/
├── layout.tsx
├── page.tsx
├── loading.tsx
├── globals.css

components/
├── sidebar/
│   └── Sidebar.tsx
│
├── dashboard/
│   ├── BentoGrid.tsx
│   ├── HeroTile.tsx
│   ├── CourseCard.tsx
│   ├── ActivityTile.tsx
│   └── ProgressBar.tsx

lib/
├── supabase.ts

types/
├── course.ts
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/AkashMohanty004/nexora-internshala.git
```

## 2️⃣ Navigate to Project

```bash
cd nexora-internshala
```

## 3️⃣ Install Dependencies

```bash
npm install
```

---

# 🔑 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

# 🛢️ Supabase Setup

## Create Courses Table

```sql
create table courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  progress integer not null,
  icon_name text not null,
  created_at timestamp default now()
);
```

## Insert Mock Data

```sql
insert into courses (title, progress, icon_name)
values
('Advanced React Patterns', 75, 'Code2'),
('Next.js Mastery', 45, 'Rocket'),
('UI Motion Design', 90, 'Sparkles'),
('Database Optimization', 60, 'Database');
```

---

# 🎬 Animation Strategy

Nexora uses Framer Motion for premium interactions:

✨ Staggered page reveal  
✨ Spring physics animations  
✨ Hover elevation effects  
✨ Animated progress indicators  
✨ Sidebar layout animations  
✨ GPU-accelerated transitions  

### ⚠️ Performance Note

To prevent layout shifts:

✅ Only `transform` and `opacity` are animated  
❌ Width/height/margin animations are avoided  

---

# 🧠 Architecture Decisions

## 🔥 Why Server Components?

Server Components were used for:

- Faster initial page load
- Better SEO
- Secure data fetching
- Reduced client-side JavaScript

---

## 🎨 Why Bento Grid?

The Bento Grid provides:

- Better content organization
- Modern SaaS aesthetics
- Responsive scalability
- Premium dashboard appearance

---

# 📱 Responsive Design

| Device | Layout |
|---|---|
| 💻 Desktop | Full sidebar + multi-column grid |
| 📱 Tablet | Collapsed sidebar + 2-column layout |
| 📲 Mobile | Single-column stacked layout |

---

# 🚀 Deployment

The project is deployed using:

▲ Vercel

### Deploy Steps

```bash
npm run build
```

Then import the repository into Vercel and add environment variables.

---

# 🌟 Future Improvements

- 🤖 AI Learning Recommendations
- 🌙 Dynamic Theme Customization
- 📊 Advanced Analytics
- 🔔 Real-time Notifications
- 🧠 Personalized Learning Paths

---

# 👨‍💻 Author

### Akash Mohanty

🔗 GitHub:
https://github.com/AkashMohanty004

---

# ⭐ Acknowledgements

Inspired by modern UI systems from:

- Linear
- Vercel
- Framer
- Raycast
- Apple Vision Pro UI

---

# 📜 License

This project is built for internship evaluation and educational purposes.

---

# 💫 Final Note

> “Nexora isn’t just a dashboard — it’s a futuristic learning experience designed for the next generation.”
