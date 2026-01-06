# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a production-ready Real Estate CRM built with Next.js 15 (App Router), TypeScript, and shadcn/ui. The application provides comprehensive management of leads, clients, properties, enrollments, payments, and analytics with a robust Role-Based Access Control (RBAC) system and professional document generation.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint the codebase
npm run lint

# Type check without emitting files
npx tsc --noEmit
```

## Authentication & Testing

The application uses mock authentication with predefined users. All users have the password: `password123`

Common test accounts:
- Admin: `admin@1159realty.com`
- Manager: `manager@1159realty.com`
- Agent: `agent@1159realty.com`
- CST: `cst@1159realty.com`

See [lib/data/mock-users.ts](lib/data/mock-users.ts) for the complete list of test users.

## Architecture Overview

### Routing Structure

The app uses Next.js 15 App Router with route groups:

- `app/(auth)/` - Unauthenticated routes (login, forgot password, reset password)
- `app/(dashboard)/` - Protected routes requiring authentication
- `app/page.tsx` - Root redirect to login or dashboard based on auth state

The `(dashboard)` layout is a pass-through component; actual layout logic is in `app/layout.tsx` which conditionally renders the authenticated layout with sidebar navigation.

### Permission System (RBAC)

The application implements a granular permission system with 200+ permissions across 12 roles.

**Key Files:**
- [lib/permissions/types.ts](lib/permissions/types.ts) - Permission type definitions using `action:resource` pattern
- [lib/permissions/role-permissions.ts](lib/permissions/role-permissions.ts) - Role-to-permission mappings
- [lib/permissions/permission-manager.ts](lib/permissions/permission-manager.ts) - Central permission checking logic
- [lib/hooks/use-permissions.ts](lib/hooks/use-permissions.ts) - React hook for permission checks

**Permission Pattern:**
Permissions follow the format `action:resource` (e.g., `view:property`, `create:lead`, `approve:payment`).

**Usage in Components:**
```typescript
import { usePermissions } from "@/lib/hooks/use-permissions"

const { canCreate, canUpdate, hasPermission } = usePermissions()

if (canCreate('property')) {
  // Show create button
}

if (hasPermission('approve:payment')) {
  // Show approve button
}
```

**Navigation Items:**
Navigation items in [lib/navigation.ts](lib/navigation.ts) are automatically filtered based on user permissions. Each nav item can specify:
- `permission` - Single permission required
- `permissions` - Array of permissions
- `roles` - Specific roles allowed
- `requireAll` - Whether user needs ALL permissions (default: false = ANY)

### State Management

**Authentication State:**
- Uses Zustand with persistence for auth state
- Location: [lib/store/auth-store.ts](lib/store/auth-store.ts)
- Syncs with both localStorage and cookies (client-side and server-side)
- Cookie utilities in [lib/cookies/](lib/cookies/)

**Form State:**
- React Hook Form with Zod validation for all forms
- Form components in [components/forms/entities/](components/forms/entities/)

### Data Layer Architecture

**Mock Data Pattern:**
All data is currently mocked (no backend). Data files are located in:
- `lib/data/` - Mock data generators and utilities
- `lib/api/` - API simulation functions that return mock data

**Key Data Files:**
- [lib/data/mock-users.ts](lib/data/mock-users.ts) - User authentication and role data
- `lib/api/*.ts` - Mock API functions for each entity (leads, properties, clients, etc.)

**Common Pattern:**
```typescript
// API functions typically accept filters and return typed data
export function getLeads(filters?: { status?: string }) {
  // Returns mock Lead[] data
}
```

### Forms Architecture

**Form Pattern:**
All entity forms follow a consistent pattern:

1. Located in [components/forms/entities/](components/forms/entities/)
2. Use React Hook Form + Zod for validation
3. Accept `initialData` prop for edit mode
4. Call `onSuccess` callback after submission
5. Use shadcn/ui form components

**Example Form Structure:**
```typescript
interface EntityFormProps {
  initialData?: Entity
  onSuccess?: () => void
}

// Form uses useForm from react-hook-form
// Schema defined with Zod
// Validation happens on blur and submit
```

### TypeScript Types

All types are centralized in the `types/` directory:
- [types/index.ts](types/index.ts) - Central export for all types
- Each entity has its own type file (e.g., `types/lead.ts`, `types/property.ts`)
- Common types and enums in [types/common.ts](types/common.ts)

**Important Type Patterns:**
- All entities have an `id` field (string)
- Status fields use literal unions (e.g., `status: "Active" | "Inactive"`)
- Dates are typed as `Date` objects
- User roles: 12 predefined roles as literal union type

### PDF Generation

PDFs are generated using pdfmake with dynamic imports for client-side rendering.

**Location:** [lib/pdf/enrollment-pdfs.ts](lib/pdf/enrollment-pdfs.ts)

**Available PDFs:**
- Offer Letter - Property offer with payment terms
- Payment Receipt - Official payment acknowledgment
- Allocation Letter - Plot allocation confirmation

**Usage Pattern:**
```typescript
import { generateOfferLetter } from "@/lib/pdf/enrollment-pdfs"

// Call on client-side (uses dynamic imports)
await generateOfferLetter(enrollmentData)
```

**Company Branding:**
PDFs include company branding constants defined in the PDF file. Update these for different branding.

### Analytics & Charts

**Chart Components:** [components/charts/](components/charts/)

Seven interactive analytics charts using Recharts:
1. Revenue Forecast - Predictive revenue with trend projections
2. Sales Analytics - Outright vs installment breakdown
3. Agent Performance - Top performers with targets
4. Conversion Funnel - Lead-to-client pipeline
5. Property Performance - Sales distribution
6. Commission Trends - Agent vs partner tracking
7. Payment Collection - On-time/pending/overdue monitoring

All charts use consistent gold (#FFD700) branding colors and responsive design.

### UI Components & Design System

**Component Library:**
- Built on shadcn/ui (Radix UI primitives)
- Components in `components/ui/` (auto-generated by shadcn CLI)
- Custom reusable components in `components/` root

**Design Principles:**
- **Shadow-based elevation** - NO BORDERS (this is a strict design rule)
- **Gold accent color** - #FFD700 for premium theme
- Fully responsive design (mobile-first)
- Dark mode support via next-themes

**Adding shadcn Components:**
```bash
npx shadcn@latest add [component-name]
```

### Data Tables

All list pages use TanStack Table v8 with a consistent pattern:

**Pattern:**
1. Page component in `app/(dashboard)/[entity]/page.tsx`
2. Column definitions in `app/(dashboard)/[entity]/columns.tsx`
3. Reusable DataTable component for rendering
4. Built-in filtering, sorting, and pagination

### Important Conventions

**File Naming:**
- React components: PascalCase (e.g., `LeadForm.tsx`)
- Utilities/helpers: kebab-case (e.g., `mock-users.ts`)
- Types: kebab-case matching entity name (e.g., `lead.ts`)

**Import Aliases:**
- `@/` - Root directory alias (configured in tsconfig.json)
- Always use absolute imports with `@/` prefix

**Code Style:**
- Strict TypeScript mode enabled
- No `any` types (use proper typing)
- Functional components with hooks (no class components)
- Server components by default; use `"use client"` only when needed

**Permission Checks:**
- Always check permissions before rendering action buttons
- Use `usePermissions()` hook in client components
- Server-side checks available in [lib/permissions/server-auth.ts](lib/permissions/server-auth.ts)

## Key Integration Points

### Adding a New Entity

When adding a new entity, you typically need to:

1. **Type Definition** - Create `types/[entity].ts` with interface
2. **Mock Data** - Add mock data generator in `lib/data/[entity].ts`
3. **API Functions** - Create `lib/api/[entity].ts` with CRUD functions
4. **Permissions** - Add resource to [lib/permissions/types.ts](lib/permissions/types.ts) and update role permissions
5. **Form Component** - Create form in `components/forms/entities/[entity]-form.tsx`
6. **List Page** - Create page in `app/(dashboard)/[entity]/page.tsx`
7. **Columns** - Define columns in `app/(dashboard)/[entity]/columns.tsx`
8. **Detail Page** - Create detail page in `app/(dashboard)/[entity]/[id]/page.tsx`
9. **Navigation** - Add to [lib/navigation.ts](lib/navigation.ts) with appropriate permissions

### Working with Permissions

When implementing permission-gated features:

1. Define the permission in [lib/permissions/types.ts](lib/permissions/types.ts) `RESOURCES` and `ACTIONS`
2. Add permission to relevant roles in [lib/permissions/role-permissions.ts](lib/permissions/role-permissions.ts)
3. Use `usePermissions()` hook or `PermissionManager` class to check permissions
4. Add permission checks to navigation items if needed

### Modifying PDF Templates

PDF templates use pdfmake document definition objects. Key points:

- Company branding constants at top of file
- Use table layouts for structured data
- Gold color (#FFD700) for headers and accents
- Include proper margins and spacing
- Always test PDFs in browser (client-side rendering)

## Documentation References

For deeper understanding, see the comprehensive documentation in the root:
- `FINAL_STATUS_REPORT.md` - Complete project status
- `TESTING_GUIDE.md` - Testing procedures
- `DEPLOYMENT_GUIDE.md` - Production deployment
- `PROJECT_SUMMARY.md` - Detailed project overview
- `RBAC_IMPLEMENTATION_GUIDE.md` - Permissions system guide
- `AUTH_COMPLETE.md` - Authentication details

## Important Notes

**Current State:**
- Frontend-only implementation with mock data
- No actual backend API integration
- No real database
- No file uploads to cloud storage
- Authentication is simulated (localStorage + cookies)

**Future Backend Integration:**
When integrating a real backend:
1. Replace mock API functions in `lib/api/` with real API calls
2. Update auth store to use real JWT tokens
3. Implement server-side session management
4. Add proper error handling and loading states
5. Integrate file upload service (e.g., AWS S3)
6. Add real-time notifications (e.g., WebSocket or SSE)

**Property vs Plot:**
The system handles both high-level "Properties" (e.g., a housing estate) and individual "Plots" within properties. The CSV import feature specifically handles plot imports with property associations.
