import { DashboardShell } from "@/components/layout/DashboardShell";

export default function ExpensesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
