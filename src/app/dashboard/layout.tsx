"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useWallet } from "@/shared/hooks/useWallet";
import { useAuth } from "@/shared/hooks/useAuth";
import { usePlatformStore } from "@/shared/stores/platformStore";
import PlatformSelector from "@/shared/components/PlatformSelector";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected, platforms } = useWallet();
  const { isAuthenticated, user } = useAuth();
  const { activePlatform, setActivePlatform } = usePlatformStore();

  useEffect(() => {
    // Si no está conectado, redirigir al home
    if (!isConnected || !isAuthenticated) {
      router.push("/");
      return;
    }

    // Si está en /dashboard/platform/[platformId]
    if (pathname.startsWith("/dashboard/platform/")) {
      const platformId = pathname.split("/").pop();

      // Verificar si el platformId está en las plataformas del usuario
      if (!platformId || !platforms.includes(platformId)) {
        // Si no tiene acceso a esta plataforma, redirigir a /dashboard/user
        router.push("/dashboard/user");
        return;
      }

      // Sincronizar la plataforma activa con la URL
      if (platformId !== activePlatform) {
        setActivePlatform(platformId);
      }
    }

    // Si está en /dashboard/user, permitir acceso (solo requiere estar conectado)
    if (pathname === "/dashboard/user") {
      return;
    }

    // Si está en /dashboard sin especificar, redirigir según el caso
    if (pathname === "/dashboard") {
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
    }
  }, [
    isConnected,
    isAuthenticated,
    platforms,
    pathname,
    router,
    activePlatform,
    setActivePlatform,
  ]);

  // Mostrar loading mientras verifica
  if (!isConnected || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
          <div className="flex items-center gap-4">
            <PlatformSelector />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {platforms.length} plataforma{platforms.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
