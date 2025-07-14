import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCreditScore,
  setCreditScore,
} from "@/shared/services/creditScoreService";

// Query key factory
export const creditScoreKeys = {
  all: ["creditScore"] as const,
  score: (userAddress: string) =>
    [...creditScoreKeys.all, "score", userAddress] as const,
};

// Hook para obtener el credit score de un usuario
export function useCreditScore(userAddress: string | null) {
  return useQuery({
    queryKey: creditScoreKeys.score(userAddress || ""),
    queryFn: async () => {
      if (!userAddress) throw new Error("User address is required");

      try {
        // Obtener desde el contrato
        const score = await getCreditScore(userAddress);
        return {
          user: userAddress,
          score: score,
          timestamp: new Date().toISOString(),
          source: "contract",
        };
      } catch (error) {
        console.log("Contract failed:", error);
        throw error;
      }
    },
    enabled: !!userAddress,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Reintentar solo si es un error de red, no de validación
      return (
        failureCount < 3 &&
        error instanceof Error &&
        !error.message.includes("User address is required")
      );
    },
  });
}

// Hook para establecer el credit score de un usuario
export function useSetCreditScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, score }: { user: string; score: number }) => {
      try {
        // Establecer en el contrato
        const result = await setCreditScore(user, score);
        return {
          user,
          score,
          timestamp: new Date().toISOString(),
          source: "contract",
        };
      } catch (error) {
        console.log("Contract failed:", error);
        throw error;
      }
    },
    onSuccess: (data, variables) => {
      console.log("Credit score set successfully:", data);

      // Invalidar la query del credit score del usuario
      queryClient.invalidateQueries({
        queryKey: creditScoreKeys.score(variables.user),
      });

      // Opcional: Actualizar el cache directamente
      queryClient.setQueryData(creditScoreKeys.score(variables.user), data);
    },
    onError: (error) => {
      console.error("Error setting credit score:", error);
    },
  });
}

// Hook para obtener el credit score desde el contrato (sin fallback)
export function useCreditScoreFromContract(userAddress: string | null) {
  return useQuery({
    queryKey: [...creditScoreKeys.score(userAddress || ""), "contract"],
    queryFn: async () => {
      if (!userAddress) throw new Error("User address is required");

      const score = await getCreditScore(userAddress);
      return {
        user: userAddress,
        score: score,
        timestamp: new Date().toISOString(),
        source: "contract",
      };
    },
    enabled: !!userAddress,
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: false, // No reintentar si falla el contrato
  });
}
