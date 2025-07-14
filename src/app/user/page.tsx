"use client";

import { useAuth } from "@/shared/hooks/useAuth";
import { useWallet } from "@/shared/hooks/useWallet";
import { usePlatformsByOwner } from "@/shared/hooks/usePlatforms";
import Link from "next/link";
import CreditScore from "@/shared/components/CreditScore";
import ContractCreditScore from "@/shared/components/ContractCreditScore";
import StatsCard from "@/shared/components/StatsCard";
import ActivityChart from "@/shared/components/ActivityChart";
import QuickActions from "@/shared/components/QuickActions";
import CreatePlatformModal from "@/shared/components/modules/CreatePlatformModal";

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { address } = useWallet();
  const { data: platformsData = [] } = usePlatformsByOwner(address);

  // Extraer el array real de plataformas
  const platforms = Array.isArray(platformsData) ? platformsData : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bienvenido, {user?.name}
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu perfil y accede a tus plataformas
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
              {user?.walletAddress}
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

      {/* Credit Score - Versión del Contrato */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Credit Score desde Contrato Stellar
        </h2>
        <ContractCreditScore />
      </div>

      {/* Credit Score - Versión Estática */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Credit Score Estático
        </h2>
        <CreditScore score={user?.creditScore || 500} />
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Prestado"
          value={`$${user?.totalLent?.toLocaleString() || "0"}`}
          subtitle="Historial total"
          icon="💰"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Prestado"
          value={`$${user?.totalBorrowed?.toLocaleString() || "0"}`}
          subtitle="Préstamos recibidos"
          icon="📊"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Reputación"
          value={user?.reputation || "0"}
          subtitle="Puntuación global"
          icon="⭐"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Plataformas"
          value={platforms.length}
          subtitle="Acceso activo"
          icon="🔗"
        />
      </div>

      {/* Plataformas */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Tus Plataformas ({platforms.length})
          </h2>
          <div className="flex items-center gap-2">
            <CreatePlatformModal />
          </div>
        </div>
        {platforms.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No tienes acceso a ninguna plataforma aún
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Contacta con un administrador para obtener acceso o crea una nueva
              plataforma
            </p>
            <div className="flex justify-center">
              <CreatePlatformModal />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platformId) => (
              <Link
                key={platformId}
                href={`/platform/${platformId}`}
                className="block p-4 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                <h3 className="font-semibold text-foreground mb-2">
                  Plataforma {platformId}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Haz clic para acceder
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Gráficos de Actividad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ActivityChart title="Actividad de Préstamos" data={[]} />
        <ActivityChart title="Actividad de Reputación" data={[]} />
      </div>

      {/* Acciones Rápidas */}
      <QuickActions
        actions={[
          {
            title: "Solicitar Préstamo",
            description: "Crear una nueva solicitud de préstamo",
            icon: "📝",
            href: "/platform/1",
            color: "hover:border-green-500/50",
          },
          {
            title: "Ofrecer Préstamo",
            description: "Ofrecer fondos para préstamos",
            icon: "💰",
            href: "/platform/1",
            color: "hover:border-blue-500/50",
          },
          {
            title: "Ver Historial",
            description: "Revisar transacciones anteriores",
            icon: "📊",
            href: "/platform/1",
            color: "hover:border-purple-500/50",
          },
          {
            title: "Mejorar Score",
            description: "Consejos para mejorar tu credit score",
            icon: "📈",
            href: "/user",
            color: "hover:border-yellow-500/50",
          },
          {
            title: "Configuración",
            description: "Ajustar preferencias de cuenta",
            icon: "⚙️",
            href: "/user",
            color: "hover:border-gray-500/50",
          },
          {
            title: "Soporte",
            description: "Obtener ayuda y soporte",
            icon: "🆘",
            href: "/user",
            color: "hover:border-red-500/50",
          },
        ]}
      />
    </div>
  );
}
