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

