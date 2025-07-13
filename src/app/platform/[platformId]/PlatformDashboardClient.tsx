"use client";

import { useAuth } from "@/shared/hooks/useAuth";
import { useWallet } from "@/shared/hooks/useWallet";
import { usePlatformStore } from "@/shared/stores/platformStore";
import { usePlatformsByOwner } from "@/shared/hooks/usePlatforms";
import Link from "next/link";

interface PlatformDashboardClientProps {
  platformId: string;
}

export default function PlatformDashboardClient({
  platformId,
}: PlatformDashboardClientProps) {
  const { user } = useAuth();
  const { address } = useWallet();
  const { activePlatform } = usePlatformStore();
  const { data: platforms = [] } = usePlatformsByOwner(address);

  // Extraer el array real de plataformas
  const safePlatforms = Array.isArray(platforms?.data) ? platforms.data : [];

  // Verificar si el usuario tiene acceso a esta plataforma
  const hasAccess = safePlatforms.some(
    (platform) => platform.id === platformId
  );

  if (!hasAccess) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Acceso Denegado
          </h1>
          <p className="text-muted-foreground mb-6">
            No tienes acceso a la plataforma {platformId}
          </p>
          <Link
            href="/user"
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Encontrar la plataforma actual
  const currentPlatform = safePlatforms.find(
    (platform) => platform.id === platformId
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {currentPlatform?.name || `Plataforma ${platformId}`}
            </h1>
            <p className="text-muted-foreground">
              Gestiona tus préstamos y transacciones
            </p>
          </div>
          <Link
            href="/user"
            className="px-4 py-2 border border-border text-foreground font-medium rounded-lg hover:bg-accent transition-colors"
          >
            Cambiar Plataforma
          </Link>
        </div>
      </div>

      {/* Información de la plataforma */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Información de la Plataforma
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              ID de Plataforma
            </label>
            <p className="text-foreground font-mono">{platformId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Estado
            </label>
            <p className="text-foreground">Activa</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Usuario
            </label>
            <p className="text-foreground">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Plataforma Activa
            </label>
            <p className="text-foreground">
              {activePlatform === platformId ? "Sí" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Estadísticas de la plataforma */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Préstamos Activos
          </h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Préstamos Completados
          </h3>
          <p className="text-2xl font-bold text-primary">0</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Reputación en Plataforma
          </h3>
          <p className="text-2xl font-bold text-primary">
            {user?.reputation || "0"}
          </p>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold text-foreground mb-2">
              Solicitar Préstamo
            </h3>
            <p className="text-sm text-muted-foreground">
              Crear una nueva solicitud de préstamo
            </p>
          </button>
          <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold text-foreground mb-2">
              Ofrecer Préstamo
            </h3>
            <p className="text-sm text-muted-foreground">
              Ofrecer fondos para préstamos
            </p>
          </button>
          <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold text-foreground mb-2">
              Ver Historial
            </h3>
            <p className="text-sm text-muted-foreground">
              Revisar transacciones anteriores
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
