Project Folder structure

src/
└── app/
    ├── core/                 # STRICTLY for app-wide singletons. NO UI components here.
    │   ├── auth/             # Auth service, token storage
    │   ├── guards/           # Route guards (e.g., role.guard.ts)
    │   ├── http/             # Interceptors (e.g., jwt.interceptor.ts) and base API service
    │   └── models/           # App-wide global TypeScript interfaces
    │
    ├── shared/               # STRICTLY for "dumb" UI components and utilities. 
    │   ├── ui/               # Reusable Tailwind components (button, data-table, badge)
    │   ├── pipes/            # Custom formatters (e.g., currency formatter)
    │   └── utils/            # Helper functions (e.g., date-validators)
    │
    ├── layout/               # UI layout wrappers (Shells)
    │   ├── app-layout/       # Sidebar + Topbar for authenticated users
    │   └── public-layout/    # Minimal wrapper for Login/Landing
    │
    ├── features/             # (Also called 'domains') Smart components & business logic
    │   ├── auth/             # Login & Register pages
    │   ├── dashboard/        
    │   ├── procurement/      # Purchase Requests logic
    │   ├── inventory/        # Productopia integration
    │   └── payments/         # Payzee integration
    │
    ├── app.config.ts         # Angular 19 config (providers, routing setup)
    ├── app.routes.ts         # Master routing file
    └── app.component.ts      # Root entry point


so far I've done the base setup
- Landing Page , Auth (Login & Register done )
- Auth Interceptor done
- Auth Guard done
- Base Layout (Public/Private) done

# Project Context: Hoodle Enterprise

## 1. Project Overview
Hoodle is a modern, enterprise-grade B2B Procurement and Workspace Management application. It handles Purchase Requests (PRQ), Purchase Orders (PO), Inventory tracking, and Vendor payments. 
- **Target Audience:** Enterprise teams needing fast, paperless, multi-level approval workflows.
- **Design Language:** Clean, modern enterprise UI with Tailwind CSS. Prioritizes speed, minimal flashes, and intuitive UX (similar to Slack, Notion, or Linear).

## 2. Tech Stack
- **Frontend Framework:** Angular 17+ (Using standalone components and new control flow `@if`, `@for`, `@switch`).
- **Styling:** Tailwind CSS (Custom color palette using `brand-50` to `brand-900`).
- **Backend:** Spring Boot Microservices.
- **API Communication:** RxJS Observables with a centralized, smart `HttpClient` wrapper.

## 3. Architecture & Microservices
The backend is split into microservices, configured in `environment.ts`:
- **Auth Service:** `http://localhost:8080`
- **Orbit (Orders/Procurement) Service:** `http://localhost:8081`

**HTTP Client Pattern:**
A global `HttpServiceService` wraps Angular's `HttpClient`. It dynamically checks endpoints:
- If an endpoint starts with `http`, it uses that exact URL (perfect for targeting specific microservices).
- Otherwise, it falls back to a base URL.

**Folder Structure (Domain-Driven Design):**
- `core/services/`: Global singletons (AuthService, HttpServiceService).
- `shared/ui/`: Dumb, reusable UI components (DataTable, SideDrawer).
- `features/{domain}/`: Smart business logic. Services specific to a domain (e.g., `PrqService`) live inside `features/{domain}/services/`.

## 4. Routing & Authentication
- **Guards:** - `noAuthGuard`: Placed on public routes (Landing, Sign In, Sign Up). Automatically intercepts logged-in users and redirects them to `/app/dashboard` without rendering the page (zero flash).
- **UX Flows:** - On successful registration, the email state is passed via Angular Router to automatically pre-fill the Sign In page.
  - Page transitions use a global CSS utility `.animate-fade-in` for smooth 0.3s entrances.

## 5. Core Shared Components

### Reusable Data Table (`<app-data-table>`)
A highly dynamic table engine that accepts a generic array of `columns` and `data`.
- **Supported Types:** `text`, `currency` (INR), `date` (uses Angular's `mediumDate`), `badge`, `action`.
- **Badges:** Standardized enterprise colors. 
  - Green: `APPROVED`, `DELIVERED`
  - Amber: `SUBMITTED`, `PENDING`, `IN TRANSIT`
  - Gray: `DRAFT`
  - Red: `REJECTED`
- **Pagination:** Optional via `@Input() showPagination`. Fully integrated with Spring Boot's 0-indexed pagination format (`content`, `totalPages`, `totalElements`, etc.).
- **Event Emitters:** Uses `@Output()` to send action clicks (View, Approve) and page changes back to the parent component.

### Side Drawer (`<app-side-drawer>`)
A slide-out overlay used for complex forms (like "Raise Request") to keep the user in the context of the data table without routing them to a new page. Uses `ng-content` for flexible body and footer injection.

## 6. Current Feature Implementations

### Purchase Requests (PRQ)
- **Path:** `/app/requests`
- **Listing:** Uses `DataTableComponent` to display paginated PRQs fetched from the `orbitUrl` microservice (`/api/v1/prq/all`).
- **Creation:** Uses `SideDrawerComponent`. The form allows users to specify `department`, `remarks`, and dynamically add/remove multiple line `items` (itemName, description, quantity, unitPrice). Maps directly to the backend JSON creation object.

## 7. Upcoming / Planned Architecture
- **Role-Based Access Control (RBAC):** The backend provides an `access` object in the auth initialization (e.g., `{"PRQ": ["READ", "CREATE"]}`). UI components (like Data Table actions) will eventually dynamically show/hide buttons based on these permissions.
- **Pending Features:** Purchase Orders (PO) List, Dashboard stats, Vendors management.