import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { fetchBusinessesWithDelay } from '../store/slices/businessesSlice';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';
import { selectBusinesses, selectBusinessesLoading, selectBusinessesError } from '../store/slices/businessesSlice';

// Custom hook to manage businesses fetching
export const useBusinesses = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const businesses = useSelector(selectBusinesses);
  const isLoading = useSelector(selectBusinessesLoading);
  const error = useSelector(selectBusinessesError);

  // Fetch businesses when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && user && businesses.length === 0 && !isLoading) {
      console.log('User authenticated, fetching businesses with delay...');
      dispatch(fetchBusinessesWithDelay({ page: 1, limit: 20, delay: 1500 }));
    }
  }, [isAuthenticated, user, businesses.length, isLoading, dispatch]);

  // Manual fetch function for components
  const fetchBusinesses = (page: number = 1, limit: number = 20) => {
    if (isAuthenticated && user) {
      dispatch(fetchBusinessesWithDelay({ page, limit, delay: 500 }));
    } else {
      console.warn('Cannot fetch businesses: User not authenticated');
    }
  };

  return {
    businesses,
    isLoading,
    error,
    isAuthenticated,
    user,
    fetchBusinesses,
  };
};
