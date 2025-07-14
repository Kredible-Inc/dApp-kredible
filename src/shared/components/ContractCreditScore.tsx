"use client";

import { useWallet } from "@/shared/hooks/useWallet";
import {
  useCreditScore,
  useSetCreditScore,
} from "@/shared/hooks/useCreditScore";
import CreditScore from "./CreditScore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ContractCreditScoreProps {
  className?: string;
}

export default function ContractCreditScore({
  className = "",
}: ContractCreditScoreProps) {
  const { address } = useWallet();
  const [isUpdating, setIsUpdating] = useState(false);

  // Obtener el credit score del contrato/API
  const {
    data: creditScoreData,
    isLoading,
    error,
    refetch,
  } = useCreditScore(address);

  // Mutation para actualizar el credit score
  const setCreditScoreMutation = useSetCreditScore();

  const handleUpdateScore = async (newScore: number) => {
    if (!address) return;

    setIsUpdating(true);
    try {
      await setCreditScoreMutation.mutateAsync({
        user: address,
        score: newScore,
      });
    } catch (error) {
      console.error("Error updating credit score:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Credit Score
          </CardTitle>
          <CardDescription>
            Cargando desde el contrato de Stellar...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Error al cargar Credit Score
          </CardTitle>
          <CardDescription>
            No se pudo obtener el credit score desde el contrato
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const score = creditScoreData?.score || 500;
  const isFromContract = creditScoreData?.source === "contract";

  return (
    <div className={className}>
      {/* Credit Score Component */}
      <CreditScore score={score} className="mb-4" />

      {/* Contract Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Estado del Contrato</CardTitle>
          <CardDescription>
            Información sobre el credit score en la blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Source Badge */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fuente de datos:</span>
            <Badge variant={isFromContract ? "default" : "secondary"}>
              {isFromContract ? "Contrato Stellar" : "API Externa"}
            </Badge>
          </div>

          {/* Wallet Address */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Dirección:</span>
            <span className="text-sm font-mono text-muted-foreground">
              {address
                ? `${address.slice(0, 6)}...${address.slice(-4)}`
                : "No conectada"}
            </span>
          </div>

          {/* Last Updated */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Última actualización:</span>
            <span className="text-sm text-muted-foreground">
              {creditScoreData?.timestamp
                ? new Date(creditScoreData.timestamp).toLocaleString()
                : "N/A"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={isUpdating}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>

            <Button
              onClick={() => handleUpdateScore(score + 10)}
              variant="outline"
              size="sm"
              disabled={isUpdating || setCreditScoreMutation.isPending}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              +10
            </Button>

            <Button
              onClick={() => handleUpdateScore(score - 10)}
              variant="outline"
              size="sm"
              disabled={isUpdating || setCreditScoreMutation.isPending}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              -10
            </Button>
          </div>

          {/* Loading State */}
          {(isUpdating || setCreditScoreMutation.isPending) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              {setCreditScoreMutation.isPending
                ? "Actualizando en el contrato..."
                : "Actualizando..."}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
