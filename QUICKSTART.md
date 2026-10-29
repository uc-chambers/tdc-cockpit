# 🚀 Quick Start Guide

Get TDC Cockpit up and running in less than 5 minutes!

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Git ([Download](https://git-scm.com/))

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/tdc-cockpit.git
cd tdc-cockpit
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

### 4. Open your browser

Navigate to: **http://localhost:5173**

### 5. Login

```
Password: tdc2026@
```

That's it! You're ready to use TDC Cockpit. 🎉

---

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck
```

---

## Project Structure

```
tdc-cockpit/
├── src/
│   ├── components/     # Reusable components
│   ├── context/        # State management
│   ├── i18n/          # Translations
│   ├── pages/         # Page components
│   ├── App.tsx        # Root component
│   └── main.tsx       # Entry point
├── public/            # Static assets
└── package.json       # Dependencies
```

---

## Features Overview

### 📊 Dashboard
- Real-time KPIs
- Location info
- Recent activity

### 👥 Management
- Employees
- Phone Directory
- Forklifts
- Equipment

### 📋 Operations
- Daily operations log
- Excel import
- Monthly reports

### 📝 Productivity
- Quick Notes
- Task Management

---

## Troubleshooting

### Port already in use

If port 5173 is already in use:

```bash
# Kill the process using port 5173
npx kill-port 5173

# Or start on a different port
npm run dev -- --port 3000
```

### Dependencies issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors

```bash
# Clear build cache
rm -rf dist
npm run build
```

---

## Next Steps

- 📖 Read the full [README](README.md)
- 🚀 Learn about [Deployment](DEPLOYMENT_GUIDE.md)
- 🤝 Read [Contributing Guidelines](CONTRIBUTING.md)
- 📋 Check the [Changelog](CHANGELOG.md)

---

## Need Help?

- 📧 Email: your-email@example.com
- 💬 [Open an Issue](https://github.com/yourusername/tdc-cockpit/issues/new)
- 💡 [Start a Discussion](https://github.com/yourusername/tdc-cockpit/discussions)

---

**Happy coding!** 🎨✨
