import { Client, networks } from "credit_score";
import SorobanRpc from "@stellar/stellar-sdk/rpc";
import { Address } from "@stellar/stellar-sdk";

const API_BASE_URL = "https://api-kredible-production.up.railway.app";

export interface CreditScoreData {
  user: string;
  score: number;
  timestamp: string;
  source?: "contract" | "api";
}

export interface SetScoreRequest {
  user: string;
  score: number;
}

export interface GetScoreRequest {
  user: string;
}

export interface CreditScoreResponse {
  success: boolean;
  data: CreditScoreData;
  message: string;
  timestamp: string;
}

export class CreditScoreService {
  private static client: Client | null = null;
  private static rpc: typeof SorobanRpc | null = null;

  /**
   * Inicializa el cliente del contrato
   */
  private static async initializeClient(): Promise<Client> {
    if (!this.client) {
      // Configurar RPC para testnet
      this.rpc = new SorobanRpc("https://soroban-testnet.stellar.org");

      this.client = new Client({
        contractId: networks.testnet.contractId,
        networkPassphrase: networks.testnet.networkPassphrase,
        rpcUrl: "https://soroban-testnet.stellar.org",
      });
    }
    return this.client;
  }

  /**
   * Establece el credit score de un usuario en el contrato
   */
  static async setScore(data: SetScoreRequest): Promise<CreditScoreResponse> {
    try {
      console.log("CreditScoreService - Setting score:", data);

      const client = await this.initializeClient();

      // Convertir la dirección del usuario a formato Stellar
      const userAddress = new Address(data.user);

      // Crear la transacción para establecer el score
      const transaction = await client.set_score(
        {
          user: userAddress.toString(),
          score: data.score as any, // u32 type
        },
        {
          fee: 100000, // 0.1 XLM
          timeoutInSeconds: 30,
          simulate: true,
        }
      );

      console.log("CreditScoreService - Transaction created:", transaction);

      // Simular la transacción primero
      const simulation = await transaction.simulate();
      console.log("CreditScoreService - Simulation result:", simulation);

      // Si la simulación es exitosa, enviar la transacción
      if (simulation.result) {
        const result = await transaction.signAndSend();
        console.log("CreditScoreService - Transaction sent:", result);

        const response: CreditScoreResponse = {
          success: true,
          data: {
            user: data.user,
            score: data.score,
            timestamp: new Date().toISOString(),
            source: "contract",
          },
          message: "Credit score set successfully",
          timestamp: new Date().toISOString(),
        };

        return response;
      } else {
        throw new Error("Transaction simulation failed");
      }
    } catch (error) {
      console.error("Error setting credit score:", error);
      throw error;
    }
  }

  /**
   * Obtiene el credit score de un usuario desde el contrato
   */
  static async getScore(data: GetScoreRequest): Promise<CreditScoreResponse> {
    try {
      console.log("CreditScoreService - Getting score for user:", data.user);

      const client = await this.initializeClient();

      // Convertir la dirección del usuario a formato Stellar
      const userAddress = new Address(data.user);

      // Crear la transacción para obtener el score
      const transaction = await client.get_score(
        {
          user: userAddress.toString(),
        },
        {
          fee: 100000, // 0.1 XLM
          timeoutInSeconds: 30,
          simulate: true,
        }
      );

      console.log("CreditScoreService - Get transaction created:", transaction);

      // Simular la transacción
      const simulation = await transaction.simulate();
      console.log("CreditScoreService - Get simulation result:", simulation);

      if (simulation.result) {
        const score = simulation.result as number;

        const response: CreditScoreResponse = {
          success: true,
          data: {
            user: data.user,
            score: score,
            timestamp: new Date().toISOString(),
            source: "contract",
          },
          message: "Credit score retrieved successfully",
          timestamp: new Date().toISOString(),
        };

        return response;
      } else {
        throw new Error("Failed to get credit score");
      }
    } catch (error) {
      console.error("Error getting credit score:", error);
      throw error;
    }
  }

  /**
   * Obtiene el credit score desde la API externa como fallback
   */
  static async getScoreFromAPI(
    userAddress: string
  ): Promise<CreditScoreResponse> {
    try {
      console.log(
        "CreditScoreService - Getting score from API for:",
        userAddress
      );

      const response = await fetch(
        `${API_BASE_URL}/credit-score/${userAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("CreditScoreService - API response:", data);

      return {
        success: true,
        data: {
          user: userAddress,
          score: data.score || 500, // Default score
          timestamp: new Date().toISOString(),
          source: "api",
        },
        message: "Credit score retrieved from API",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error getting credit score from API:", error);
      throw error;
    }
  }

  /**
   * Establece el credit score en la API externa como fallback
   */
  static async setScoreInAPI(
    data: SetScoreRequest
  ): Promise<CreditScoreResponse> {
    try {
      console.log("CreditScoreService - Setting score in API:", data);

      const response = await fetch(`${API_BASE_URL}/credit-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("CreditScoreService - API set response:", result);

      return {
        success: true,
        data: {
          user: data.user,
          score: data.score,
          timestamp: new Date().toISOString(),
          source: "api",
        },
        message: "Credit score set in API successfully",
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error setting credit score in API:", error);
      throw error;
    }
  }
}
