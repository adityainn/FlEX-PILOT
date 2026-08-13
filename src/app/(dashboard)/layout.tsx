import { AppLayout } from "@/components/layout/app-layout";
import { auth } from "@/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return <AppLayout session={session}>{children}</AppLayout>;
}
