export interface User {
  id: string;
  walletAddress: string;
  name: string;
  email: string;
  createdAt: string;
  userRole: "borrower" | "lender" | "admin";
  lendingHistory: any[];
  borrowingHistory: any[];
  totalLent: number;
  totalBorrowed: number;
  reputation: number;
  creditScore: number;
  platforms?: string[];
}
