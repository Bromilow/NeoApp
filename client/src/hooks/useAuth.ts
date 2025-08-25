import { useQuery } from "@tanstack/react-query";
import type { UserWithProfile } from "@shared/schema";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<UserWithProfile>({
    queryKey: ["/api/auth/user"],
    retry: false,
    // Don't refetch on window focus to avoid unnecessary requests
    refetchOnWindowFocus: false,
    // In development, don't make the API call
    enabled: !import.meta.env.DEV,
    // Handle 401 errors gracefully
    onError: (error: any) => {
      if (error?.status === 401) {
        // User is not authenticated, this is expected for unauthenticated users
        console.log('User not authenticated');
      }
    }
  });

  return {
    user,
    isLoading: import.meta.env.DEV ? false : isLoading,
    isAuthenticated: import.meta.env.DEV ? false : (!!user && !error),
    error
  };
}
