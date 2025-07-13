"use client";

import { useAuth } from "@/shared/hooks/useAuth";
import { useWallet } from "@/shared/hooks/useWallet";
import { usePlatformStore } from "@/shared/stores/platformStore";
import PlatformSelector from "@/shared/components/PlatformSelector";
import CreditScore from "@/shared/components/CreditScore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CreditCard,
  Users,
  Building2,
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { platforms } = useWallet();
  const { activePlatform } = usePlatformStore();

  const stats = [
    {
      title: "Score de Crédito",
      value: user?.creditScore || 500,
      change: "+25",
      changeType: "positive" as const,
      icon: CreditCard,
    },
    {
      title: "Préstamos Activos",
      value: 3,
      change: "+1",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Pagos Pendientes",
      value: 2,
      change: "-1",
      changeType: "negative" as const,
      icon: TrendingDown,
    },
    {
      title: "Plataformas",
      value: platforms.length,
      change: "",
      changeType: "neutral" as const,
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            Bienvenido, {user?.name || "Usuario"}
          </h2>
          <p className="text-muted-foreground">
            Gestiona tus finanzas descentralizadas
          </p>
        </div>
        <PlatformSelector />
      </div>

      {/* Credit Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tu Score de Crédito</CardTitle>
            <CardDescription>
              Tu puntuación actual en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreditScore score={user?.creditScore || 500} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>
              Últimas transacciones y movimientos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <Activity className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium">Pago Completado</p>
                    <p className="text-sm text-muted-foreground">Hace 2 días</p>
                  </div>
                </div>
                <Badge variant="secondary">+$500</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Nuevo Préstamo</p>
                    <p className="text-sm text-muted-foreground">
                      Hace 1 semana
                    </p>
                  </div>
                </div>
                <Badge variant="outline">-$1,200</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p
                  className={`text-xs ${
                    stat.changeType === "positive"
                      ? "text-green-600 dark:text-green-400"
                      : stat.changeType === "negative"
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change} desde el mes pasado
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Accede rápidamente a las funciones más utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-4 flex flex-col items-start gap-2">
              <CreditCard className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Solicitar Préstamo</div>
                <div className="text-xs text-muted-foreground">
                  Nueva solicitud de crédito
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
            >
              <Activity className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Ver Historial</div>
                <div className="text-xs text-muted-foreground">
                  Transacciones anteriores
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
            >
              <Users className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Mi Perfil</div>
                <div className="text-xs text-muted-foreground">
                  Gestionar información personal
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
