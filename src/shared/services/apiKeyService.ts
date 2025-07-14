const API_BASE_URL = "https://api-kredible-production.up.railway.app";

export interface ApiKeyResponse {
  apiKey: string;
  platformId: string;
  platformName: string;
}

export interface CreateApiKeyRequest {
  platformId: string;
  contactEmail: string;
}

export interface ApiKeyData {
  success: boolean;
  message: string;
  data: ApiKeyResponse;
  timestamp: string;
}

export class ApiKeyService {
  static async getApiKey(platformId: string): Promise<ApiKeyData> {
    try {
      console.log("ApiKeyService - Fetching API key for platform:", platformId);

      const response = await fetch(
        `${API_BASE_URL}/platforms/${platformId}/api-key`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("ApiKeyService - Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ApiKeyService - Error response:", errorText);
        throw new Error(
          `Error fetching API key: ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("ApiKeyService - Success response:", result);
      return result;
    } catch (error) {
      console.error("Error fetching API key:", error);
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
}
