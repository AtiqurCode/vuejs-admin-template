# Quasar Admin Dashboard

A modern, professional admin dashboard built with Vue 3, TypeScript, Quasar Framework, and Supabase.

## 🚀 Features

- **Dashboard** - Overview with statistics and user management
- **User Management** - Complete CRUD operations with advanced filtering and pagination
- **Reports** - Analytics and reporting tools
- **Calendar** - Full-featured calendar with month/week/day views and event management
- **Settings** - User profile and application settings
- **Command Palette** - Quick command launcher (⌘K / Ctrl+K)
- **Drag & Drop** - Reorderable dashboard widgets
- **Notifications** - Real-time notification center
- **Authentication** - Supabase-powered authentication system

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (for authentication)

## 🛠️ Installation

1. Clone the repository
```bash
git clone <repository-url>
cd admin-template
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Start development server
```bash
npm run dev
```

5. Build for production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/          # Vue components
│   ├── AuthModal.vue
│   ├── CalendarPage.vue
│   ├── CommandPalette.vue
│   ├── NotificationCenter.vue
│   ├── ReportsPage.vue
│   ├── SettingsPage.vue
│   └── UsersPage.vue
├── composables/         # Vue composables
│   └── useNotifications.ts
├── lib/                 # Utilities and services
│   └── supabase.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Helper functions
│   └── errorHandler.ts
├── App.vue              # Root component
├── main.ts              # Application entry point
└── style.css            # Global styles
```

## 🎨 Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Quasar Framework** - UI component library
- **Vite** - Build tool and dev server
- **Supabase** - Backend and authentication
- **date-fns** - Date manipulation
- **vue-draggable-plus** - Drag and drop functionality

## 📝 Key Features

### Dashboard
- Real-time statistics cards
- User management table
- Quick actions panel
- Recent activity timeline

### User Management
- Advanced filtering (role, status, department)
- Search functionality
- Pagination
- Sortable columns
- Add/Edit/Delete users

### Calendar
- Month, Week, and Day views
- Create and manage events
- Color-coded events
- Time slot selection

### Command Palette
- Quick navigation (⌘K / Ctrl+K)
- Search commands
- Keyboard shortcuts
- Command categories

## 🔒 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 Documentation

For detailed code review and improvement suggestions, see [PROJECT_CODE_REVIEW.md](./PROJECT_CODE_REVIEW.md)

## 🐛 Known Issues

- Console.log statements should be removed in production
- Some TypeScript `any` types need to be replaced with proper interfaces
- Large components should be split into smaller ones

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

---

Made with ❤️ using Vue 3 and Quasar
