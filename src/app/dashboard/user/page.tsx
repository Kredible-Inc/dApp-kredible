"use client";

import { useWallet } from "@/shared/hooks/useWallet";
import { useAuth } from "@/shared/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function UserDashboard() {
  const { platforms, address, formatAddress } = useWallet();
  const { user } = useAuth();
  const router = useRouter();

  const handlePlatformSelect = (platformId: string) => {
    router.push(`/dashboard/platform/${platformId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Gestiona tus plataformas y actividades
        </p>
      </div>

      {/* Información del usuario */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Información del Usuario
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Nombre
            </label>
            <p className="text-foreground">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-foreground">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Wallet Address
            </label>
            <p className="text-foreground font-mono text-sm">
              {formatAddress(address || "")}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Rol
            </label>
            <p className="text-foreground capitalize">{user?.userRole}</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Total Prestado
          </h3>
          <p className="text-2xl font-bold text-foreground">
            ${user?.totalLent?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Total Solicitado
          </h3>
          <p className="text-2xl font-bold text-foreground">
            ${user?.totalBorrowed?.toLocaleString() || "0"}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">
            Reputación
          </h3>
          <p className="text-2xl font-bold text-foreground">
            {user?.reputation || "0"}
          </p>
        </div>
      </div>

      {/* Selector de plataformas */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Tus Plataformas
        </h2>

        {platforms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No tienes plataformas asignadas aún.
            </p>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Solicitar Acceso
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platformId) => (
              <div
                key={platformId}
                className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => handlePlatformSelect(platformId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground capitalize">
                    {platformId}
                  </h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    Activa
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Accede a las funcionalidades de {platformId}
                </p>
                <button className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition-colors">
                  Ir a {platformId}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
