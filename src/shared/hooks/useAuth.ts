import { useAuthStore } from "@/shared/stores/authStore";

export const useAuth = () => {
  const { user, isAuthenticated, login, logout, updateUser } = useAuthStore();
  return { user, isAuthenticated, login, logout, updateUser };
};
