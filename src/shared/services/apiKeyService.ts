const API_BASE_URL = "https://api-kredible-production.up.railway.app";

export interface UsageResponse {
  planType: string;
  maxQueries: number;
  remainingQueries: number;
  usedQueries: number;
  usagePercentage: number;
}

export interface CreateApiKeyRequest {
  platformId: string;
  contactEmail: string;
}

export interface ApiKeyData {
  success: boolean;
  message: string;
  data: {
    apiKey: string;
    platformId: string;
    platformName: string;
  };
  timestamp: string;
}

export interface UsageData {
  success: boolean;
  message: string;
  data: UsageResponse;
  timestamp: string;
}

export class ApiKeyService {
  static async getUsage(apiKey: string): Promise<UsageData> {
    try {
      console.log("ApiKeyService - Fetching usage with API key");

      const response = await fetch(`${API_BASE_URL}/platforms/usage`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      });

      console.log("ApiKeyService - Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ApiKeyService - Error response:", errorText);
        throw new Error(
          `Error fetching usage: ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("ApiKeyService - Success response:", result);
      return result;
    } catch (error) {
      console.error("Error fetching usage:", error);
      throw error;
    }
  }

  static async createApiKey(data: CreateApiKeyRequest): Promise<ApiKeyData> {
    try {
      console.log("ApiKeyService - Creating API key:", data);

      const response = await fetch(`${API_BASE_URL}/platforms/api-key`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("ApiKeyService - Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ApiKeyService - Error response:", errorText);
        throw new Error(
          `Error creating API key: ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("ApiKeyService - Success response:", result);
      return result;
    } catch (error) {
      console.error("Error creating API key:", error);
      throw error;
    }
  }

  static async getApiKey(platformId: string): Promise<string | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api-keys/${platformId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No API key found
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.apiKey || null;
    } catch (error) {
      console.error("Error getting API key:", error);
      return null;
    }
  }
}
