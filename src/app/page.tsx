import Dashboard from "@/shared/components/modules/Dashboard";
import AuthGuard from "@/shared/components/modules/AuthGuard";

export default function Home() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
