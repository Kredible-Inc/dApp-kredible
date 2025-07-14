import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ApiKeyService,
  CreateApiKeyRequest,
} from "@/shared/services/apiKeyService";

// Query key factory
export const apiKeyKeys = {
  all: ["apiKeys"] as const,
  usage: () => [...apiKeyKeys.all, "usage"] as const,
  usageDetail: (apiKey: string) => [...apiKeyKeys.usage(), apiKey] as const,
};

// Hook para obtener uso de API con API Key
export function useApiUsage(apiKey: string | null) {
  return useQuery({
    queryKey: apiKeyKeys.usageDetail(apiKey || ""),
    queryFn: () => ApiKeyService.getUsage(apiKey!),
    enabled: !!apiKey,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook para crear una nueva API Key
export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApiKeyRequest) => ApiKeyService.createApiKey(data),
    onSuccess: (newApiKey, variables) => {
      console.log("API Key creada exitosamente:", newApiKey);

      // Invalidar consultas de uso para refrescar datos
      queryClient.invalidateQueries({
        queryKey: apiKeyKeys.usage(),
      });
    },
    onError: (error) => {
      console.error("Error al crear API Key:", error);
    },
  });
}
