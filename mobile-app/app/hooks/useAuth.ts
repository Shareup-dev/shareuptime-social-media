import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { 
  useLoginMutation, 
  useRegisterMutation,
  useGetProfileQuery 
} from '../redux/api';
import { setUser, logOut, setLoading } from '../redux/loggedInUser';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthError {
  message: string;
  field?: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.loggedInUser
  );

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const [error, setError] = useState<AuthError | null>(null);

  // Get user profile if authenticated
  const {
    data: profileData,
    error: profileError,
    refetch: refetchProfile,
  } = useGetProfileQuery(user?.id || '', {
    skip: !user?.id,
  });

  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      dispatch(setLoading(true));

      const result = await loginMutation(credentials).unwrap();
      
      if (result.user && result.token) {
        // Store token in secure storage (implement this based on your needs)
        // await SecureStore.setItemAsync('authToken', result.token);
        
        dispatch(setUser(result.user));
        return { success: true };
      }
      
      throw new Error('Invalid login response');
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Login failed';
      setError({ message: errorMessage, field: err?.data?.field });
      dispatch(setLoading(false));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setError(null);
      dispatch(setLoading(true));

      const result = await registerMutation(userData).unwrap();
      
      if (result.user && result.token) {
        // Store token in secure storage
        // await SecureStore.setItemAsync('authToken', result.token);
        
        dispatch(setUser(result.user));
        return { success: true };
      }
      
      throw new Error('Invalid registration response');
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || 'Registration failed';
      setError({ message: errorMessage, field: err?.data?.field });
      dispatch(setLoading(false));
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Remove token from secure storage
      // await SecureStore.deleteItemAsync('authToken');
      
      dispatch(logOut());
      return { success: true };
    } catch (err: any) {
      console.error('Logout error:', err);
      // Force logout even if there's an error
      dispatch(logOut());
      return { success: true };
    }
  };

  const refreshProfile = () => {
    if (user?.id) {
      refetchProfile();
    }
  };

  // Auto-login on app start (implement this with stored token)
  const initializeAuth = async () => {
    try {
      // const token = await SecureStore.getItemAsync('authToken');
      // if (token) {
      //   // Validate token and get user profile
      //   refreshProfile();
      // }
    } catch (err) {
      console.error('Auth initialization error:', err);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    isLoading: isLoading || isLoginLoading || isRegisterLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    refreshProfile,
    clearError: () => setError(null),
    
    // Profile data
    profileData,
    profileError,
  };
};