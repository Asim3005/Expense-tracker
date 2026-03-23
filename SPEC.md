# Personal Finance Tracker - Specification

## Overview

The Personal Finance Tracker is a full-stack web application that enables users to monitor, categorize, and analyze their financial transactions. Users can add income and expenses, view their balance over time, and gain insights into their spending patterns through visual analytics.

### Core Features

- Transaction Management: Add, edit, and delete income/expense transactions
- Categories: Categorize transactions with custom categories (create, edit, delete)
- Dashboard: View account balance, total income, total expenses, and recent transactions
- Transaction History: Browse and filter transaction records with advanced filters
- Analytics: Visual representation of spending by category and monthly trends
- Budget Tracking: Track spending against budget limits with progress indicators
- Settings: Configure application preferences
- Theme Support: Dark/light mode with system preference detection
- Search: Search transactions by description or category
- Responsive Design: Mobile-first layout with collapsible sidebar

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **HTTP Client**: fetch API (built-in browser API)
- **UI Components**: Custom component library (Button, Card, Dialog, etc.)
- **Charts**: Recharts 3.7.0
- **Icons**: Lucide React 0.575.0
- **Date Utilities**: date-fns 4.1.0

### Backend
- **Framework**: FastAPI (Python)
- **Language**: Python 3.11+
- **Server**: Uvicorn (local development only)
- **ORM**: SQLAlchemy (Async)
- **Migration Tool**: Alembic

### Database
- **Database**: Neon PostgreSQL (cloud production)
- **Connection**: asyncpg driver (PostgreSQL)
- **Provider**: Neon (Serverless PostgreSQL)
- **Connection String**: Configured in .env file

### Development Tools
- **Package Manager**: uv (Python)
- **Node.js Manager**: npm/yarn/pnpm
- **API Documentation**: FastAPI automatic Swagger UI

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                       (Next.js App)                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  Transactions│  │  Analytics   │      │
│  │    Page      │  │     Page     │  │    Page      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                 │                  │               │
│         └─────────────────┼──────────────────┘               │
│                           │                                  │
│                    ┌──────▼──────┐                           │
│                    │  API Client │                           │
│                    │  (fetch)    │                           │
│                    └──────┬──────┘                           │
└───────────────────────────┼───────────────────────────────────┘
                            │ HTTP/REST
                            │
┌───────────────────────────▼───────────────────────────────────┐
│                        Backend                                │
│                      (FastAPI App)                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   API Routes                          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐  │   │
│  │  │Transactions││ Categories││ Analytics││ Health│  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────┘  │   │
│  └─────────────────────────┬──────────────────────────────┘   │
│                            │                                  │
│                    ┌───────▼────────┐                         │
│                    │  Service Layer │                         │
│                    │  (Business Logic)                       │
│                    └───────┬────────┘                         │
└────────────────────────────┼───────────────────────────────────┘
                             │
                             │ Async DB Queries
                             │
┌────────────────────────────▼───────────────────────────────────┐
│                      Database                                 │
│                   (Neon PostgreSQL)                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ transactions │  │ categories   │  │    indexes   │      │
│  │    table     │  │    table     │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  Provider: Neon (Serverless PostgreSQL)                      │
│  Connection: via asyncpg driver                              │
└──────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
Finance_Tracker/
├── frontend/                 # Next.js Application
│   ├── app/
│   │   ├── layout.tsx       # Root layout with theme provider
│   │   ├── globals.css       # Global styles with CSS variables
│   │   ├── page.tsx          # Dashboard page
│   │   ├── transactions/
│   │   │   └── page.tsx      # Transactions list page
│   │   ├── analytics/
│   │   │   └── page.tsx      # Analytics page
│   │   ├── categories/
│   │   │   └── page.tsx      # Categories management page
│   │   ├── budget/
│   │   │   └── page.tsx      # Budget tracking page
│   │   └── settings/
│   │       └── page.tsx      # Settings page
│   ├── components/
│   │   ├── dashboard/         # Dashboard-specific components
│   │   │   ├── dashboard-content.tsx
│   │   │   ├── stats-card.tsx
│   │   │   ├── spending-chart.tsx
│   │   │   ├── income-expense-chart.tsx
│   │   │   └── recent-transactions.tsx
│   │   ├── transactions/      # Transaction components
│   │   │   ├── transactions-content.tsx
│   │   │   ├── transactions-table.tsx
│   │   │   └── transactions-filters.tsx
│   │   ├── analytics/         # Analytics components
│   │   │   └── analytics-content.tsx
│   │   ├── categories/       # Category components
│   │   │   ├── categories-content.tsx
│   │   │   ├── category-card.tsx
│   │   │   └── category-form.tsx
│   │   ├── budget/           # Budget components
│   │   │   ├── budget-content.tsx
│   │   │   └── budget-progress.tsx
│   │   ├── settings/         # Settings components
│   │   │   └── settings-content.tsx
│   │   ├── layout/           # Layout components
│   │   │   └── sidebar.tsx
│   │   ├── providers/       # React providers
│   │   │   └── theme-provider.tsx
│   │   └── ui/              # Reusable UI components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── select.tsx
│   │       ├── textarea.tsx
│   │       ├── checkbox.tsx
│   │       ├── switch.tsx
│   │       ├── badge.tsx
│   │       ├── progress.tsx
│   │       ├── dialog.tsx
│   │       ├── separator.tsx
│   │       ├── avatar.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── empty-state.tsx
│   │       ├── skeleton.tsx
│   │       ├── icon-picker.tsx
│   │       ├── color-picker.tsx
│   │       ├── toast.tsx
│   │       └── toaster.tsx
│   ├── lib/
│   │   ├── api.ts            # API client functions
│   │   ├── types.ts          # TypeScript types
│   │   ├── utils.ts          # Utility functions
│   │   └── hooks/            # Custom React hooks
│   │       ├── use-theme.ts
│   │       ├── use-local-storage.ts
│   │       ├── use-debounce.ts
│   │       └── use-media-query.ts
│   └── package.json
│
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI app entry point
│   │   ├── config.py         # Configuration settings
│   │   ├── database.py       # Database connection
│   │   ├── models/           # SQLAlchemy Models
│   │   │   ├── __init__.py
│   │   │   ├── transaction.py
│   │   │   └── category.py
│   │   ├── schemas/          # Pydantic Schemas
│   │   │   ├── __init__.py
│   │   │   ├── transaction.py
│   │   │   └── category.py
│   │   ├── api/              # API Routes
│   │   │   ├── __init__.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── transactions.py
│   │   │       ├── categories.py
│   │   │       └── analytics.py
│   │   └── services/         # Business Logic
│   │       ├── __init__.py
│   │       ├── transaction_service.py
│   │       └── analytics_service.py
│   ├── alembic/              # Database Migrations
│   │   ├── versions/
│   │   └── env.py
│   ├── alembic.ini
│   └── pyproject.toml        # uv dependencies
│
└── SPEC.md                   # This file
```

### Data Models

#### Transaction
- `id`: UUID (Primary Key)
- `amount`: Decimal
- `description`: String (255 chars)
- `transaction_type`: Enum ('income', 'expense')
- `category_id`: UUID (Foreign Key → Category)
- `date`: DateTime
- `created_at`: DateTime
- `updated_at`: DateTime

#### Category
- `id`: UUID (Primary Key)
- `name`: String (100 chars) - Unique
- `color`: String (7 chars, hex format)
- `icon`: String (50 chars, emoji or icon name)
- `created_at`: DateTime
- `updated_at`: DateTime

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/transactions` | List all transactions (with pagination/filter) |
| POST | `/api/v1/transactions` | Create a new transaction |
| GET | `/api/v1/transactions/{id}` | Get a single transaction |
| PUT | `/api/v1/transactions/{id}` | Update a transaction |
| DELETE | `/api/v1/transactions/{id}` | Delete a transaction |
| GET | `/api/v1/categories` | List all categories |
| POST | `/api/v1/categories` | Create a new category |
| GET | `/api/v1/categories/{id}` | Get a single category |
| PUT | `/api/v1/categories/{id}` | Update a category |
| DELETE | `/api/v1/categories/{id}` | Delete a category |
| GET | `/api/v1/analytics/summary` | Get financial summary (balance, total income, total expenses) |
| GET | `/api/v1/analytics/spending-by-category` | Get spending breakdown by category |
| GET | `/api/v1/analytics/monthly-trend` | Get monthly income/expense trends |

---

## Phase Checklists

### Phase 1: Setup

#### Environment Setup
- [x] Install Python 3.11+
- [x] Install Node.js 18+
- [x] Install uv package manager
- [x] Install pnpm (or use npm/yarn)

#### Database Setup
- [x] Create Neon account for cloud PostgreSQL
- [x] Create a new PostgreSQL project
- [x] Copy connection string
- [x] Set up environment variable for database URL (Neon PostgreSQL)

#### Backend Initialization
- [x] Create backend directory structure
- [x] Initialize uv project (`uv init`)
- [x] Add FastAPI to dependencies
- [x] Add uvicorn to dependencies
- [x] Add SQLAlchemy and asyncpg to dependencies
- [x] Add Alembic to dependencies
- [x] Add pydantic and pydantic-settings to dependencies
- [x] Add python-dotenv for environment variables
- [x] Create `.env` file in backend root
- [x] Create basic FastAPI app in `app/main.py`
- [x] Verify server starts with `uvicorn app.main:app --reload`

#### Frontend Initialization
- [x] Create Next.js project (`npx create-next-app@latest`)
- [x] Select TypeScript, Tailwind CSS, App Router options
- [x] Remove default placeholder content
- [x] Create custom UI component library (Button, Card, Dialog, etc.)
- [x] Create sidebar layout with navigation
- [x] Verify dev server starts with `pnpm dev`

#### Development Configuration
- [x] Configure CORS in FastAPI for local frontend
- [x] Create `.gitignore` files for both projects
- [x] Set up environment variable configuration

---

### Phase 2: Backend

#### Database Models
- [x] Create database connection module (`database.py`)
- [x] Define Transaction model with all fields
- [x] Define Category model with all fields
- [x] Set up model relationships

#### Pydantic Schemas
- [x] Create TransactionCreate schema
- [x] Create TransactionUpdate schema
- [x] Create TransactionResponse schema
- [x] Create CategoryCreate schema
- [x] Create CategoryUpdate schema
- [x] Create CategoryResponse schema

#### Database Migrations
- [x] Initialize Alembic
- [x] Configure Alembic to use async connection
- [x] Create initial migration script
- [x] Apply migration to Neon database (PostgreSQL)

#### Service Layer
- [x] Create TransactionService with CRUD operations
- [x] Implement get_all_transactions with filtering
- [x] Implement get_transaction_by_id
- [x] Implement create_transaction
- [x] Implement update_transaction
- [x] Implement delete_transaction
- [x] Create CategoryService with CRUD operations
- [x] Implement get_all_categories
- [x] Implement create_category
- [x] Implement update_category
- [x] Implement delete_category
- [x] Create AnalyticsService
- [x] Implement get_summary (balance, income, expenses)
- [x] Implement get_spending_by_category
- [x] Implement get_monthly_trend

#### API Routes
- [x] Create health check endpoint
- [x] Implement `/api/v1/transactions` routes (GET, POST)
- [x] Implement `/api/v1/transactions/{id}` routes (GET, PUT, DELETE)
- [x] Implement `/api/v1/categories` routes (GET, POST)
- [x] Implement `/api/v1/categories/{id}` routes (GET, PUT, DELETE)
- [x] Implement `/api/v1/analytics/summary` endpoint
- [x] Implement `/api/v1/analytics/spending-by-category` endpoint
- [x] Implement `/api/v1/analytics/monthly-trend` endpoint

#### Data Seeding
- [x] Create seed script for default categories
- [x] Add default income categories (Salary, Freelance, Investment)
- [x] Add default expense categories (Food, Transportation, Housing, Entertainment, Shopping, Health)

---

### Phase 3: Frontend

#### Types & API Client
- [x] Create TypeScript types matching backend schemas
- [x] Define Transaction type
- [x] Define Category type
- [x] Define Summary type
- [x] Define Analytics types
- [x] Create API base URL configuration
- [x] Create reusable fetch wrapper function
- [x] Implement API functions for all endpoints

#### Components - Layout
- [x] Create Sidebar component with navigation
- [x] Create MainContent wrapper for page content
- [x] Implement collapsible sidebar functionality
- [x] Add responsive design for mobile

#### Components - Transactions
- [x] Create TransactionsTable component
  - [x] Table rendering with transactions
  - [x] Individual transaction row display
  - [x] Type badge (income/expense)
  - [x] Category badge
  - [x] Edit button
  - [x] Delete button
- [x] Create TransactionsFilters component
  - [x] Type selector
  - [x] Category dropdown
  - [x] Search input
  - [x] Date range picker
  - [x] Amount range inputs
  - [x] Sort selector
  - [x] Reset filters button
- [x] Create TransactionsContent component
  - [x] Integration with table and filters
  - [x] Add transaction dialog
  - [x] Edit transaction dialog
  - [x] Delete confirmation dialog
  - [x] Loading states
  - [x] Empty states

#### Components - Analytics
- [x] Create AnalyticsContent component
  - [x] Date range selector
  - [x] Spending by category chart (pie/donut)
  - [x] Monthly trend chart (line/bar)
  - [x] Category breakdown list
  - [x] Income vs expense comparison
- [x] Create Dashboard StatsCard component
  - [x] Value display with formatting
  - [x] Icon support
  - [x] Trend indicator (up/down)
  - [x] Color variants (success/danger/warning/default)
- [x] Create SpendingChart component (pie/donut)
  - [x] Category-based breakdown
  - [x] Color mapping
  - [x] Legend display
- [x] Create IncomeExpenseChart component (line/bar)
  - [x] Monthly trend display
  - [x] Income and expense lines
  - [x] Hover tooltips
- [x] Create RecentTransactions component
  - [x] List view of recent items
  - [x] Transaction type indicator
  - [x] Category display
  - [x] Date formatting

#### Pages
- [x] Create Dashboard page (`app/page.tsx`)
  - [x] Display account balance
  - [x] Display total income
  - [x] Display total expenses
  - [x] Budget progress indicator
  - [x] Quick add transaction button
  - [x] Spending by category chart
  - [x] Income vs expenses chart
  - [x] Recent transactions list
  - [x] Loading skeleton states
  - [x] Error handling with retry
- [x] Create Transactions page (`app/transactions/page.tsx`)
  - [x] Full transaction list with table
  - [x] Filter by type (income/expense)
  - [x] Filter by category
  - [x] Search by description
  - [x] Date range filter
  - [x] Amount range filter
  - [x] Sort by date or amount
  - [x] Pagination
  - [x] Add transaction dialog
  - [x] Edit transaction dialog
  - [x] Delete confirmation
- [x] Create Analytics page (`app/analytics/page.tsx`)
  - [x] Spending by category chart
  - [x] Monthly trend chart
  - [x] Date range selector
  - [x] Category breakdown list
  - [x] Income vs expense analysis
- [x] Create Categories page (`app/categories/page.tsx`)
  - [x] Category cards grid
  - [x] Create category dialog
  - [x] Edit category dialog
  - [x] Delete confirmation
  - [x] Color picker for categories
  - [x] Icon picker for categories
  - [x] Display transaction count per category
- [x] Create Budget page (`app/budget/page.tsx`)
  - [x] Budget categories list
  - [x] Progress indicators
  - [x] Budget limits display
  - [x] Visual progress bars
- [x] Create Settings page (`app/settings/page.tsx`)
  - [x] Theme toggle (light/dark/system)
  - [x] Currency settings
  - [x] Data management options

#### Components - Categories
- [x] Create CategoriesContent component
  - [x] Grid layout for category cards
  - [x] Add category button
  - [x] Search/filter categories
  - [x] Loading and empty states
- [x] Create CategoryCard component
  - [x] Category icon display
  - [x] Category name
  - [x] Transaction count
  - [x] Edit button
  - [x] Delete button
  - [x] Color preview
- [x] Create CategoryForm component
  - [x] Name input
  - [x] Color picker component
  - [x] Icon picker component
  - [x] Form validation
  - [x] Create/Update mode support

#### Components - Budget
- [x] Create BudgetContent component
  - [x] Budget categories list
  - [x] Overall budget progress
  - [x] Category-specific progress
- [x] Create BudgetProgress component
  - [x] Progress bar visualization
  - [x] Percentage calculation
  - [x] Over-budget warning state
  - [x] Color-coded progress (safe/warning/danger)

#### Components - Settings
- [x] Create SettingsContent component
  - [x] Theme toggle (light/dark/system)
  - [x] Currency settings
  - [x] Data management section

#### Components - UI Library
- [x] Create Button component (variants: default/outline/ghost, sizes)
- [x] Create Card component (for content containers)
- [x] Create Input component (text inputs)
- [x] Create Label component (form labels)
- [x] Create Select component (dropdown)
- [x] Create Textarea component (multi-line input)
- [x] Create Checkbox component
- [x] Create Switch component (toggle)
- [x] Create Badge component (small status indicators)
- [x] Create Progress component (progress bars)
- [x] Create Dialog component (modal dialogs)
- [x] Create Separator component (visual dividers)
- [x] Create Avatar component (user/profile images)
- [x] Create DropdownMenu component
- [x] Create EmptyState component (no data state)
- [x] Create Skeleton component (loading placeholders)
- [x] Create IconPicker component (emoji selection)
- [x] Create ColorPicker component (hex color selection)
- [x] Create Toast component (notifications)
- [x] Create Toaster component (notification container)

#### Components - Providers
- [x] Create ThemeProvider component
  - [x] Dark/light mode state
  - [x] System preference detection
  - [x] localStorage persistence
  - [x] CSS variable updates

#### State Management
- [x] Implement data fetching with React hooks
- [x] Add loading states
- [x] Add error handling
- [x] Implement optimistic updates for delete
- [x] Add refresh mechanism after mutations

---

### Phase 4: Integration

#### API Integration
- [x] Configure frontend to connect to local backend
- [ ] Test all API endpoints from frontend (manual testing required)
- [x] Handle API errors gracefully
- [x] Add loading indicators for all async operations
- [x] Test error states (network errors, server errors)

#### Cross-Feature Integration
- [x] Link TransactionForm to Category dropdown
- [x] Update dashboard when new transaction is added
- [x] Refresh analytics after transaction changes
- [x] Ensure category updates reflect in transaction forms
- [ ] Test delete cascading (if category deleted, handle transactions) (manual testing required)

#### User Flow Testing
- [ ] Complete flow: Add transaction → View on dashboard → Edit → Delete (manual testing required)
- [ ] Complete flow: Create category → Assign to transaction → View in analytics (manual testing required)
- [x] Test search functionality
- [x] Test filtering by date range
- [x] Test sorting transactions
- [ ] Verify all charts update with real data (manual testing required)

#### UI Polish
- [x] Add consistent color scheme
- [x] Ensure responsive design (mobile, tablet, desktop)
- [x] Add hover states and transitions
- [x] Format currency values consistently
- [x] Format dates consistently
- [x] Add empty state designs
- [x] Add error state designs
- [x] Add confirmation dialogs for destructive actions

---

### Phase 5: Testing

#### Backend Testing
- [x] Add pytest to dependencies
- [x] Add pytest-asyncio for async tests
- [x] Add httpx for API testing
- [x] Create test database configuration
- [x] Write unit tests for Service layer
- [x] Write integration tests for API endpoints
- [x] Test all CRUD operations
- [x] Test error scenarios
- [x] Test validation logic
- [x] Test analytics calculations
- [x] All 46 tests passing

#### Frontend Testing
- [x] Add testing library (React Testing Library)
- [x] Add jest or vitest
- [x] Write unit tests for components
- [ ] Write tests for API client functions
- [x] Test form validation
- [x] Test user interactions
- [x] Test loading and error states
- [x] All 14 tests passing

#### End-to-End Testing (Optional)
- [ ] Add Playwright or Cypress
- [ ] Write E2E test for transaction creation
- [ ] Write E2E test for dashboard viewing
- [ ] Write E2E test for analytics viewing

#### Manual Testing Checklist
- [ ] Test creating income transaction (requires running servers)
- [ ] Test creating expense transaction (requires running servers)
- [ ] Test editing transaction (requires running servers)
- [ ] Test deleting transaction (requires running servers)
- [ ] Test creating custom category (requires running servers)
- [ ] Test editing category (requires running servers)
- [ ] Test deleting category (requires running servers)
- [ ] Test dashboard displays correct totals (requires running servers)
- [ ] Test search filters work (requires running servers)
- [ ] Test date filters work (requires running servers)
- [ ] Test charts display correct data
- [ ] Test responsive layout on mobile
- [ ] Test error handling with invalid inputs

---

## Notes

### Development
- Database: Neon PostgreSQL (serverless cloud database)
- No authentication is required
- Package manager for frontend: pnpm
- Package manager for backend: uv
- API documentation available at `http://localhost:8000/docs` (Swagger UI)
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:8000`
- Database connection configured in backend/.env file

### Component Library
- Custom UI components built from scratch
- Uses CSS variables for theming (light/dark mode)
- Supports hover states, transitions, and animations
- Consistent design system across all pages

### Design System
- Color palette defined in CSS variables
- Spacing scale for consistent layout
- Typography with Geist fonts
- Responsive breakpoints (mobile, tablet, desktop)
- Accessible keyboard navigation

---

## Project Status Summary

### Completed
- **Setup**: Environment, backend, and frontend initialization
- **Backend**: Database models, schemas, migrations, services, API routes, data seeding
- **Frontend**: All components, pages, state management, API integration, custom UI library
- **Layout**: Sidebar navigation, responsive design, theme provider
- **Pages**: Dashboard, Transactions, Analytics, Categories, Budget, Settings
- **Components**: Dashboard, Transactions, Analytics, Categories, Budget, Settings, UI library
- **Integration**: Cross-feature integration, UI polish, error handling, loading states
- **Testing**: 46 backend tests passing, 14 frontend tests passing

### Database
- Using Neon PostgreSQL (serverless cloud database)
- All migrations applied
- 14 default categories seeded
- Sample transactions available

### Running Servers
- Backend: http://localhost:8000 (FastAPI with Uvicorn)
- Frontend: http://localhost:3000 (Next.js with Turbopack)

### Deployment
- Git repository: https://github.com/Asim3005/Expense-tracker.git
- Latest commit: fcc3cb7 - fix: Resolve database connection issues

### Recent Fixes (2026-03-23)
- Fixed backend startup issues on Windows (MINGW64) by using direct Python path
- Resolved "Failed to fetch" errors by ensuring both servers are running
- Backend now runs correctly using: `backend/.venv/Scripts/python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
- Frontend runs on: `http://localhost:3000`
- Backend runs on: `http://localhost:8000`

### Running the Application
To run the application locally:
1. **Start Backend:**
   ```bash
   cd backend
   .venv/Scripts/python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
3. **Access Application:** Open http://localhost:3000 in your browser

### Remaining Tasks (Optional)
- Manual testing of all user flows (servers running)
- Write tests for API client functions
- End-to-End testing with Playwright or Cypress
- Deploy frontend to production (Vercel/Netlify)
- Deploy backend to production (Render/Railway/Fly.io)
