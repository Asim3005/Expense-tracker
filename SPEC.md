# Personal Finance Tracker - Specification

## Overview

The Personal Finance Tracker is a full-stack web application that enables users to monitor, categorize, and analyze their financial transactions. Users can add income and expenses, view their balance over time, and gain insights into their spending patterns through visual analytics.

### Core Features

- Transaction Management: Add, edit, and delete income/expense transactions
- Categories: Categorize transactions with custom categories
- Dashboard: View account balance, total income, and total expenses
- Transaction History: Browse and filter transaction records
- Analytics: Visual representation of spending by category
- Search: Search transactions by description or category

---

## Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: fetch API (built-in browser API)

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
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Dashboard
│   │   ├── transactions/
│   │   │   └── page.tsx      # Transactions list
│   │   └── analytics/
│   │       └── page.tsx      # Analytics page
│   ├── components/
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionList.tsx
│   │   ├── TransactionEditModal.tsx
│   │   ├── CategorySelect.tsx
│   │   ├── StatsCard.tsx
│   │   ├── ExpenseChart.tsx
│   │   ├── MonthlyTrend.tsx
│   │   ├── DashboardContent.tsx
│   │   ├── AnalyticsContent.tsx
│   │   └── TransactionsContent.tsx
│   ├── lib/
│   │   ├── api.ts            # API client functions
│   │   └── types.ts          # TypeScript types
│   ├── public/
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
- [ ] Install shadcn/ui (optional, for pre-built components)
- [x] Create basic layout with header navigation
- [x] Verify dev server starts with `npm run dev`

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
- [x] Create Header component with navigation
- [x] Create Footer component
- [x] Create Layout wrapper

#### Components - Transactions
- [x] Create TransactionForm component
  - [x] Amount input field
  - [x] Description input field
  - [x] Type selector (income/expense)
  - [x] Category dropdown
  - [x] Date picker
  - [x] Form validation
  - [x] Submit handler
- [x] Create TransactionList component
  - [x] List rendering with transactions
  - [x] Individual transaction item display
  - [x] Edit button
  - [x] Delete button
- [x] Create TransactionEdit modal/component
  - [x] Edit form with all fields
  - [x] Category dropdown
  - [x] Type selector
  - [x] Date picker
  - [x] Update handler
- [x] Create CategorySelect component

#### Components - Analytics
- [x] Create StatsCard component for summary metrics
- [x] Create ExpenseChart component (bar or pie chart)
- [x] Create MonthlyTrend component (line chart)
- [x] Install charting library (recharts or chart.js)

#### Pages
- [x] Create Dashboard page (`app/page.tsx`)
  - [x] Display account balance
  - [x] Display total income
  - [x] Display total expenses
  - [x] Quick add transaction form
  - [x] Recent transactions list
- [x] Create Transactions page (`app/transactions/page.tsx`)
  - [x] Full transaction list
  - [x] Filter by type (income/expense)
  - [x] Filter by category
  - [x] Search by description
  - [x] Sort by date or amount
  - [x] Pagination
- [x] Create Analytics page (`app/analytics/page.tsx`)
  - [x] Spending by category chart
  - [x] Monthly trend chart
  - [x] Date range selector
  - [x] Category breakdown list

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

- Database: Neon PostgreSQL (serverless cloud database)
- No authentication is required
- No deployment configuration included
- API documentation available at `http://localhost:8000/docs` (Swagger UI)
- Frontend runs on `http://localhost:3000`
- Backend runs on `http://localhost:8000`
- Database connection configured in backend/.env file

---

## Project Status Summary

### Completed
- **Setup**: Environment, backend, and frontend initialization
- **Backend**: Database models, schemas, migrations, services, API routes, data seeding
- **Frontend**: All components, pages, state management, API integration
- **Integration**: Cross-feature integration, UI polish
- **Testing**: 46 backend tests passing, 14 frontend tests passing

### Database
- Using Neon PostgreSQL (serverless cloud database)
- All migrations applied
- 14 default categories seeded
- Sample transactions available

### Running Servers
- Backend: http://localhost:8000 (FastAPI with Uvicorn)
- Frontend: http://localhost:3000 (Next.js)

### Remaining Tasks (Optional)
- Manual testing of all user flows
- Write tests for API client functions
- End-to-End testing with Playwright or Cypress
- (Optional) Add shadcn/ui components
