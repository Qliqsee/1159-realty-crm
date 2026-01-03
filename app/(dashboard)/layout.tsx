// Layout is now handled by AuthenticatedLayout in app/layout.tsx
// This file is kept for route grouping but renders children directly
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
