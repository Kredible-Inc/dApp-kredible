"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/shared/hooks/useWallet";

export default function DashboardPage() {
  const router = useRouter();
  const { platforms } = useWallet();

  useEffect(() => {
    if (platforms.length === 0) {
      // No tiene plataformas, ir a user dashboard
      router.push("/dashboard/user");
    } else if (platforms.length === 1) {
      // Tiene una sola plataforma, redirigir automáticamente
      router.push(`/dashboard/platform/${platforms[0]}`);
    } else {
      // Tiene múltiples plataformas, ir a user dashboard para seleccionar
      router.push("/dashboard/user");
    }
  }, [platforms, router]);

  // Mostrar loading mientras redirige
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-foreground">Redirigiendo al dashboard...</p>
      </div>
    </div>
  );
}
