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
  platformKey: (platformId: string) =>
    [...apiKeyKeys.all, "platform", platformId] as const,
};

// Hook para obtener API Key de una plataforma
export function useApiKey(platformId: string) {
  return useQuery({
    queryKey: apiKeyKeys.platformKey(platformId),
    queryFn: async () => {
      const response = await ApiKeyService.getApiKeyById(platformId);
      return response.data.apiKey;
    },
    enabled: !!platformId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

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

      // Invalidar la query del API key de la plataforma
      queryClient.invalidateQueries({
        queryKey: apiKeyKeys.platformKey(variables.platformId),
      });

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
