const API_BASE_URL = "http://localhost:3000";

export interface CreatePlatformRequest {
  name: string;
  description: string;
  contactEmail: string;
  ownerAddress: string;
  planType: "basic" | "premium" | "enterprise";
}

export interface PlatformResponse {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  ownerAddress: string;
  planType: string;
  createdAt: string;
  updatedAt: string;
}

export class PlatformService {
  static async createPlatform(
    data: CreatePlatformRequest
  ): Promise<PlatformResponse> {
    try {
      console.log("PlatformService - Enviando request:", {
        url: `${API_BASE_URL}/platforms`,
        data: data,
      });

      const response = await fetch(`${API_BASE_URL}/platforms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("PlatformService - Response status:", response.status);
      console.log("PlatformService - Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("PlatformService - Error response:", errorText);
        throw new Error(
          `Error creating platform: ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("PlatformService - Success response:", result);
      return result;
    } catch (error) {
      console.error("Error creating platform:", error);
      throw error;
    }
  }

  static async getPlatforms(): Promise<PlatformResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/platforms`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching platforms: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching platforms:", error);
      throw error;
    }
  }

  static async getPlatformsByOwner(
    ownerAddress: string
  ): Promise<PlatformResponse[]> {
    try {
      console.log(
        "PlatformService - Fetching platforms for owner:",
        ownerAddress
      );

      const response = await fetch(
        `${API_BASE_URL}/platforms/by-owner?ownerAddress=${ownerAddress}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("PlatformService - Response status:", response.status);
      console.log("PlatformService - Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("PlatformService - Error response:", errorText);
        throw new Error(
          `Error fetching platforms by owner: ${response.statusText} - ${errorText}`
        );
      }

      const result = await response.json();
      console.log("PlatformService - Success response:", result);
      console.log("PlatformService - Response type:", typeof result);
      console.log("PlatformService - Is array:", Array.isArray(result));

      return result;
    } catch (error) {
      console.error("Error fetching platforms by owner:", error);
      throw error;
    }
  }
}
