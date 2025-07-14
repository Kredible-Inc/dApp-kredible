import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ApiKeyService,
  CreateApiKeyRequest,
} from "@/shared/services/apiKeyService";

// Query key factory
export const apiKeyKeys = {
  all: ["apiKeys"] as const,
  details: () => [...apiKeyKeys.all, "detail"] as const,
  detail: (platformId: string) =>
    [...apiKeyKeys.details(), platformId] as const,
};

// Hook para obtener API Key de una plataforma
export function useApiKey(platformId: string | null) {
  return useQuery({
    queryKey: apiKeyKeys.detail(platformId || ""),
    queryFn: () => ApiKeyService.getApiKey(platformId!),
    enabled: !!platformId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // No reintentar si es 404 (API key no existe)
      if (error?.message?.includes("404")) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Hook para crear una nueva API Key
export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) => ApiKeyService.createApiKey(data),
    onSuccess: (newApiKey, variables) => {
      console.log("API Key creada exitosamente:", newApiKey);

      // Invalidar y refetch las consultas de API Keys
      queryClient.invalidateQueries({
        queryKey: apiKeyKeys.details(),
      });

      // Actualizar el cache directamente
      queryClient.setQueryData(
        apiKeyKeys.detail(variables.platformId),
        newApiKey
      );
    },
    onError: (error) => {
      console.error("Error al crear API Key:", error);
    },
  });
}
