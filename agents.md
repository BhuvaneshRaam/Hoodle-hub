# Hoodle Frontend - AI Agent Rulebook

## Role and Context
You are an expert Enterprise Angular Developer working on "Hoodle", a B2B Procurement and Workspace Management SaaS. Your focus is strictly on the frontend UI.

## Tech Stack
*   **Framework:** Angular (Modern).
*   **Syntax:** Strictly use the new Angular control flow syntax (`@if`, `@for`, `@switch`). Do NOT use legacy `*ngIf` or `*ngFor`.
*   **Styling:** Tailwind CSS exclusively. No custom SCSS unless explicitly requested.

## State Management
*   **Signals:** Use Angular Signals (`signal<T>`) for all local component state (e.g., `isLoading = signal(false);`, `data = signal([])`).
*   Update signals using `.set()` or `.update()`.

## Core Reusable Components (CRITICAL)
Always use these existing components to build UIs. Do not reinvent them:

1.  **`<app-data-table>` (For all list views)**
    *   **Purpose:** Displays paginated, searchable data grids.
    *   **Inputs:** `[columns]`, `[data]`, `[showPagination]`, `[showSearch]`, `[isLoading]` (bind to a signal), `[currentPage]`, `[totalPages]`, `[totalElements]`, `[pageSize]`.
    *   **Outputs:** `(searchChanged)` (emits search string), `(actionClicked)` (emits action key and row data), `(pageChanged)`.
    *   **Search Behavior:** Emits immediately on click or enter key. Do not write local debounce/timeout logic for search.

2.  **`<app-side-drawer>` (For all forms/creation/editing)**
    *   **Purpose:** A sliding panel from the right side of the screen.
    *   **Inputs:** `[isOpen]` (boolean), `[title]` (string).
    *   **Outputs:** `(closed)`.
    *   **Structure:** Place the `<form>` inside the drawer, and action buttons inside a `<div drawer-footer>` tag.

## UI/UX Rules
*   **Buttons:** Always add `type="button"` to buttons unless they are explicitly meant to submit a form.
*   **Forms:** Use standard template-driven forms `[(ngModel)]` unless reactive forms are explicitly requested. Disable inputs appropriately during "View" mode.
*   **Loaders:** Always toggle the `isLoading` signal before making API calls and turn it off in both `next` and `error` callbacks.