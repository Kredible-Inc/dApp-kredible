"use client";

import { useParams, useRouter } from "next/navigation";
import { useWallet } from "@/shared/hooks/useWallet";
import { useAuth } from "@/shared/hooks/useAuth";
import { usePlatformStore } from "@/shared/stores/platformStore";

export default function PlatformDashboard() {
  const params = useParams();
  const router = useRouter();
  const { platforms } = useWallet();
  const { user } = useAuth();
  const { activePlatform, setActivePlatform } = usePlatformStore();

  const platformId = params.platformId as string;

  // Sincronizar la plataforma activa con la URL
  if (platformId !== activePlatform) {
    setActivePlatform(platformId);
  }

  const handleSwitchPlatform = (newPlatformId: string) => {
    setActivePlatform(newPlatformId);
    router.push(`/dashboard/platform/${newPlatformId}`);
  };

  const handleBackToUser = () => {
    router.push("/dashboard/user");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header de la plataforma */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Plataforma: {platformId}
            </h1>
            <p className="text-muted-foreground">
              Dashboard específico para {platformId}
            </p>
          </div>
          <button
            onClick={handleBackToUser}
            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
          >
            ← Volver al Dashboard
          </button>
        </div>
      </div>

      {/* Selector de plataformas (si tiene múltiples) */}
      {platforms.length > 1 && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">
            Cambiar Plataforma
          </h2>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => handleSwitchPlatform(platform)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  platform === platformId
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-accent-foreground hover:bg-accent/80"
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contenido específico de la plataforma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información de la plataforma */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Información de {platformId}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Estado
              </label>
              <p className="text-foreground">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activa
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Usuario
              </label>
              <p className="text-foreground">{user?.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Rol en {platformId}
              </label>
              <p className="text-foreground capitalize">{user?.userRole}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Plataforma Activa
              </label>
              <p className="text-foreground font-medium capitalize">
                {activePlatform}
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas de la plataforma */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Estadísticas de {platformId}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Actividad
              </h3>
              <p className="text-2xl font-bold text-foreground">12</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Puntuación
              </h3>
              <p className="text-2xl font-bold text-foreground">4.8</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Transacciones
              </h3>
              <p className="text-2xl font-bold text-foreground">24</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Días Activo
              </h3>
              <p className="text-2xl font-bold text-foreground">45</p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold text-foreground mb-1">
              Nueva Transacción
            </h3>
            <p className="text-sm text-muted-foreground">
              Crear una nueva transacción en {platformId}
            </p>
          </button>
          <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold text-foreground mb-1">
              Ver Historial
            </h3>
            <p className="text-sm text-muted-foreground">
              Revisar transacciones anteriores
            </p>
          </button>
          <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold text-foreground mb-1">
              Configuración
            </h3>
            <p className="text-sm text-muted-foreground">
              Ajustar preferencias de {platformId}
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
