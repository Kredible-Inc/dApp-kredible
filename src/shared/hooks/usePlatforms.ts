import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PlatformService,
  CreatePlatformRequest,
} from "@/shared/services/platformService";
import { useWallet } from "./useWallet";

// Query key factory
export const platformKeys = {
  all: ["platforms"] as const,
  lists: () => [...platformKeys.all, "list"] as const,
  list: (ownerAddress: string) =>
    [...platformKeys.lists(), ownerAddress] as const,
  details: () => [...platformKeys.all, "detail"] as const,
  detail: (id: string) => [...platformKeys.details(), id] as const,
};

// Hook para obtener plataformas por owner
export function usePlatformsByOwner(ownerAddress: string | null) {
  return useQuery({
    queryKey: platformKeys.list(ownerAddress || ""),
    queryFn: () => PlatformService.getPlatformsByOwner(ownerAddress!),
    enabled: !!ownerAddress,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// Hook para crear una nueva plataforma
export function useCreatePlatform() {
  const queryClient = useQueryClient();
  const { address } = useWallet();

  return useMutation({
    mutationFn: (data: CreatePlatformRequest) => {
      // Asegurar que siempre se incluya el ownerAddress
      const platformData = {
        ...data,
        ownerAddress: address!,
      };
      return PlatformService.createPlatform(platformData);
    },
    onSuccess: (newPlatform) => {
      console.log("Plataforma creada exitosamente:", newPlatform);

      // Invalidar y refetch las consultas de plataformas
      queryClient.invalidateQueries({
        queryKey: platformKeys.lists(),
      });

      // Opcional: Actualizar el cache directamente
      queryClient.setQueryData(platformKeys.list(address!), (oldData: any) => {
        if (
          !oldData ||
          (typeof oldData === "object" && Object.keys(oldData).length === 0)
        ) {
          return [newPlatform];
        }
        return Array.isArray(oldData)
          ? [...oldData, newPlatform]
          : [newPlatform];
      });
    },
    onError: (error) => {
      console.error("Error al crear plataforma:", error);
    },
  });
}

// Hook para obtener todas las plataformas
export function usePlatforms() {
  return useQuery({
    queryKey: platformKeys.lists(),
    queryFn: () => PlatformService.getPlatforms(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}
