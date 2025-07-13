"use client";

import { useAuth } from "@/shared/hooks/useAuth";
import { useWallet } from "@/shared/hooks/useWallet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Shield } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useWallet();

  // Si no está conectado o no está autenticado, mostrar mensaje
  if (!isConnected || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full w-fit">
              <Shield className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardTitle className="text-xl">Acceso Restringido</CardTitle>
            <CardDescription>
              Necesitas conectar tu wallet para acceder al dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                {!isConnected
                  ? "Conecta tu wallet de Stellar para continuar"
                  : "Completa tu registro para acceder al dashboard"}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span>dApp Kredible - Plataforma Segura</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
}
