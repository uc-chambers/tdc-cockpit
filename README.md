# 🏭 TDC Cockpit

<div align="center">

**Premium Warehouse Operations Dashboard**

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Demo](#-demo) • [Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Deployment](#-deployment)

</div>

---

## 📋 Overview

TDC Cockpit is a premium SaaS-style operations dashboard designed for warehouse distribution center management. It provides a comprehensive cockpit interface to manage employees, equipment, operations, and daily tasks with a modern glassmorphism design and iOS-inspired animations.

**Access Password:** `tdc2026@`

## ✨ Features

### 🎯 Core Modules

- **📊 Dashboard** - Real-time overview with KPIs, location info, and quick stats
- **👥 Employees** - Complete employee management with seniority tracking
- **📞 Phone Directory** - Contact management with search functionality
- **🚜 Forklifts** - Fleet management with operator assignments
- **📻 Equipment Inventory** - Track radios and computers with assignments
- **📋 Operations Log** - Daily operations tracking with Excel import
- **📝 Quick Notes** - Color-coded notes with pin functionality
- **✅ Tasks** - Priority-based task management with auto-hide

### 🎨 Design & UX

- **Glassmorphism UI** - Modern translucent surfaces with backdrop blur
- **Dark/Light Mode** - Seamless theme switching with smooth transitions
- **Bilingual** - Full English/Spanish support
- **iOS Animations** - Smooth micro-interactions and page transitions
- **Responsive** - Optimized for desktop, tablet, and mobile
- **Premium Gradients** - Purple, blue, cyan color palette

### 🔐 Security

- **Password Protection** - Secure login system
- **Session Lock** - Lock screen with quick unlock
- **Excel Import Protection** - Password confirmation for data imports

## 🚀 Demo

### Login Credentials

```
Password: tdc2026@
```

### Screenshots

<details>
<summary>📸 View Screenshots</summary>

- Dashboard with KPIs and location card
- Employee management interface
- Operations log with Excel import
- Dark mode theme
- Mobile responsive view

</details>

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS
- **Lucide React** - Icon library
- **UUID** - Unique ID generation
- **XLSX** - Excel file parsing

### State Management
- **React Context API** - Global state
- **localStorage** - Data persistence
- **Supabase** - Optional cloud database

### Deployment
- **Netlify** - Hosting platform
- **GitHub** - Version control

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/tdc-cockpit.git
cd tdc-cockpit
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run dev
```

4. **Open browser**

Navigate to `http://localhost:5173`

## 🎮 Usage

### Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck
```

### Production Build

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

### Environment Variables (Optional)

If using Supabase, create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 📁 Project Structure

```
tdc-cockpit/
├── src/
│   ├── components/
│   │   └── Layout.tsx              # Main layout with sidebar
│   ├── context/
│   │   ├── AuthContext.tsx         # Authentication state
│   │   ├── DataContext.tsx         # Data management
│   │   ├── LanguageContext.tsx     # i18n support
│   │   └── ThemeContext.tsx        # Theme management
│   ├── i18n/
│   │   └── translations.ts        # EN/ES translations
│   ├── pages/
│   │   ├── Dashboard.tsx           # Main dashboard
│   │   ├── Employees.tsx           # Employee management
│   │   ├── PhoneDirectory.tsx      # Contact directory
│   │   ├── Forklifts.tsx           # Forklift management
│   │   ├── Equipment.tsx           # Equipment inventory
│   │   ├── Operations.tsx          # Operations log
│   │   ├── Notes.tsx               # Quick notes
│   │   ├── Tasks.tsx               # Task management
│   │   ├── Login.tsx               # Login screen
│   │   └── LockedScreen.tsx        # Lock screen
│   ├── App.tsx                     # Root component
│   ├── AppContent.tsx              # Main content router
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── public/                         # Static assets
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.js                  # Vite config
└── README.md                       # This file
```

## 🌐 Deployment

### Deploy to Netlify

#### Option 1: Automatic (Recommended)

1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy automatically on every push

#### Option 2: Manual

1. Build the project:
   ```bash
   npm run build
   ```

2. Drag and drop the `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)

### Environment Variables

Add these in Netlify dashboard if using Supabase:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🎨 Design System

### Color Palette

**Light Mode:**
- Background: Gradient (#f8fafc → #e0e7ff)
- Surface: rgba(255, 255, 255, 0.85)
- Accent: #6366f1 (Indigo)

**Dark Mode:**
- Background: Gradient (#0f172a → #312e81)
- Surface: rgba(30, 27, 75, 0.65)
- Accent: #818cf8 (Light Indigo)

### Typography

- **Font:** Inter
- **Display:** 2rem, 800 weight
- **Heading:** 1.5rem, 700 weight
- **Body:** 0.875rem, 400 weight

### Effects

- **Glassmorphism:** backdrop-filter: blur(16px) saturate(180%)
- **Shadows:** Soft, layered shadows with indigo tint
- **Animations:** iOS-style spring animations (150-350ms)

## 🔧 Configuration

### TypeScript

TypeScript is configured with strict mode. Run type checking:

```bash
npm run typecheck
```

### Tailwind CSS

Tailwind v4 is configured with custom design tokens in `src/index.css`.

### Vite

Vite is configured with React and Tailwind plugins in `vite.config.js`.

## 📊 Features Detail

### Dashboard

- Welcome card with gradient text
- Location card with TDC info and SQF badge
- 4 KPI cards with animated counters
- Daily operations summary
- Recent activity feed
- Quick info cards (Top Customers, Active Drivers, Business Units)

### Operations Log

- Monthly dashboard with filters
- Daily dashboard with date picker
- Previous day comparison
- Full operations table with search
- **Excel import** with password protection
- Smart column mapping (EN/ES)

### Notes

- 6 color themes
- Pin/unpin functionality
- Chronological sorting
- Create, edit, delete notes

### Tasks

- Priority levels (High, Medium, Low)
- Due date tracking
- Auto-hide completed tasks
- Visual priority indicators

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Uriel Ceballos**

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Supabase](https://supabase.com/)

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

---

<div align="center">

**Designed & Created by Uriel Ceballos**

Made with ❤️ using React + TypeScript + Tailwind CSS

</div>
