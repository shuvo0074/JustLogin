export interface Business {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  category?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface BusinessesResponse {
  businesses: Business[];
  total: number;
  page: number;
  limit: number;
}

export interface BusinessesState {
  businesses: Business[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  selectedBusiness: Business | null;
}
