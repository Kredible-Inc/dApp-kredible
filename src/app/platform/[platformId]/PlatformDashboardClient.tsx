"use client";

import { useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { useWallet } from "@/shared/hooks/useWallet";
import { usePlatformStore } from "@/shared/stores/platformStore";
import { usePlatformsByOwner } from "@/shared/hooks/usePlatforms";
import { useApiUsage, useApiKey } from "@/shared/hooks/useApiKeys";
import CreateApiKeyModal from "@/shared/components/modules/CreateApiKeyModal";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Key,
  Activity,
  TrendingUp,
  Users,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

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

  // Obtener API Key real de la plataforma
  const { data: apiKey, isLoading: apiKeyLoading } = useApiKey(platformId);
  const hasApiKey = !!apiKey;

  // Obtener datos de uso si hay API Key
  const { data: usageData, isLoading: usageLoading } = useApiUsage(
    apiKey || null
  );
  const usage = usageData?.data;

  // Extraer el array real de plataformas
  const safePlatforms = Array.isArray(platforms?.data) ? platforms.data : [];

  // Verificar si el usuario tiene acceso a esta plataforma
  const hasAccess = safePlatforms.some(
    (platform: any) => platform.id === platformId
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
    (platform: any) => platform.id === platformId
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("API Key copiada al portapapeles");
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {currentPlatform?.name || `Plataforma ${platformId}`}
            </h1>
            <p className="text-muted-foreground">
              Análisis de uso de API y gestión de plataforma
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

      {/* API Key Section */}
      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key
            </CardTitle>
            <CardDescription>
              Tu clave de API para integrar con Kredible
            </CardDescription>
          </CardHeader>
          <CardContent>
            {apiKeyLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm text-muted-foreground">
                  Cargando API Key...
                </span>
              </div>
            ) : hasApiKey ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    API Key Configurada
                  </span>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <code className="text-sm font-mono">{apiKey}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(apiKey)}
                      className="ml-2"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Usa esta clave en el header <code>X-API-Key</code> de tus
                  requests
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-orange-600">
                    API Key No Configurada
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Crea una API Key para comenzar a usar la API de Kredible
                </p>
                <CreateApiKeyModal
                  platformId={platformId}
                  platformName={currentPlatform?.name || platformId}
                  contactEmail={currentPlatform?.contactEmail || ""}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Análisis de Uso de API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Requests Usados
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageLoading ? "..." : usage?.usedQueries || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              de {usage?.maxQueries || 0} disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Requests Restantes
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageLoading ? "..." : usage?.remainingQueries || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              requests disponibles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uso del Plan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageLoading ? "..." : usage?.usagePercentage || 0}%
            </div>
            <p className="text-xs text-muted-foreground">del plan utilizado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plan Actual</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {usageLoading
                ? "..."
                : usage?.planType || currentPlatform?.planType || "Básico"}
            </div>
            <p className="text-xs text-muted-foreground">
              {usage?.maxQueries
                ? `${usage.maxQueries} requests/mes`
                : "Plan básico"}
            </p>
          </CardContent>
        </Card>
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
            <Badge variant="secondary" className="mt-1">
              {hasApiKey ? "Activa" : "Pendiente"}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Usuario
            </label>
            <p className="text-foreground">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email de Contacto
            </label>
            <p className="text-foreground">{currentPlatform?.contactEmail}</p>
          </div>
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
              Ver Documentación
            </h3>
            <p className="text-sm text-muted-foreground">
              Guías de integración y ejemplos
            </p>
          </button>
          <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold text-foreground mb-2">
              Historial de Requests
            </h3>
            <p className="text-sm text-muted-foreground">
              Revisar logs de API calls
            </p>
          </button>
          <button className="p-4 border border-border rounded-lg hover:bg-accent transition-colors text-left">
            <h3 className="font-semibold text-foreground mb-2">
              Actualizar Plan
            </h3>
            <p className="text-sm text-muted-foreground">
              Cambiar tipo de plan
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
