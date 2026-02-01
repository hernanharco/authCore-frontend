// src/app/dashboard/layout.tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout title="Dashboard">
      {children}
    </DashboardLayout>
  );
}
