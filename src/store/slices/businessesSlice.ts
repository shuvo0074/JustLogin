import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { businessService } from '../../services/businessService';
import { Business, BusinessesResponse, BusinessesState } from '../../types/business';

// Initial state
const initialState: BusinessesState = {
  businesses: [],
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,
  hasMore: true,
};

// Async thunks
export const fetchBusinesses = createAsyncThunk(
  'businesses/fetchBusinesses',
  async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}): Promise<BusinessesResponse> => {
    const response = await businessService.fetchBusinesses(page, limit);
    return response;
  }
);

export const loadMoreBusinesses = createAsyncThunk(
  'businesses/loadMoreBusinesses',
  async (_, { getState }): Promise<BusinessesResponse> => {
    const state = getState() as { businesses: BusinessesState };
    const nextPage = state.businesses.page + 1;
    const response = await businessService.fetchBusinesses(nextPage, state.businesses.limit);
    return response;
  }
);

export const refreshBusinesses = createAsyncThunk(
  'businesses/refreshBusinesses',
  async (): Promise<BusinessesResponse> => {
    const response = await businessService.fetchBusinesses(1, 20);
    return response;
  }
);

export const createBusiness = createAsyncThunk(
  'businesses/createBusiness',
  async (businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<Business> => {
    const response = await businessService.createBusiness(businessData);
    return response;
  }
);

export const updateBusiness = createAsyncThunk(
  'businesses/updateBusiness',
  async ({ businessId, businessData }: { businessId: string; businessData: Partial<Omit<Business, 'id' | 'createdAt' | 'updatedAt'>> }): Promise<Business> => {
    const response = await businessService.updateBusiness(businessId, businessData);
    return response;
  }
);

export const deleteBusiness = createAsyncThunk(
  'businesses/deleteBusiness',
  async (businessId: string): Promise<string> => {
    await businessService.deleteBusiness(businessId);
    return businessId;
  }
);

export const getBusinessById = createAsyncThunk(
  'businesses/getBusinessById',
  async (businessId: string): Promise<Business> => {
    const response = await businessService.getBusinessById(businessId);
    return response;
  }
);

// Fetch businesses with delay to ensure token is set
export const fetchBusinessesWithDelay = createAsyncThunk(
  'businesses/fetchBusinessesWithDelay',
  async ({ page = 1, limit = 20, delay = 1000 }: { page?: number; limit?: number; delay?: number } = {}, { getState }): Promise<BusinessesResponse> => {
    // Check if user is authenticated before proceeding
    const state = getState() as { auth: any };
    if (!state.auth.isAuthenticated || !state.auth.user) {
      throw new Error('User not authenticated');
    }
    
    // Add a small delay to ensure token is properly set
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const response = await businessService.fetchBusinesses(page, limit);
    return response;
  }
);

// Slice
const businessesSlice = createSlice({
  name: 'businesses',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearBusinesses: (state) => {
      state.businesses = [];
      state.total = 0;
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
    setBusinesses: (state, action: PayloadAction<Business[]>) => {
      state.businesses = action.payload;
    },
    addBusiness: (state, action: PayloadAction<Business>) => {
      state.businesses.unshift(action.payload);
      state.total += 1;
    },
    updateBusinessLocal: (state, action: PayloadAction<Business>) => {
      const index = state.businesses.findIndex(business => business.id === action.payload.id);
      if (index !== -1) {
        state.businesses[index] = action.payload;
      }
    },
    removeBusinessLocal: (state, action: PayloadAction<string>) => {
      state.businesses = state.businesses.filter(business => business.id !== action.payload);
      state.total = Math.max(0, state.total - 1);
    },
  },
  extraReducers: (builder) => {
    // Fetch businesses
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload.businesses;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.hasMore = state.businesses.length < state.total;
        state.error = null;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch businesses';
      });

    // Load more businesses
    builder
      .addCase(loadMoreBusinesses.pending, (state) => {
        // Don't set isLoading to true for load more to avoid blocking UI
        state.error = null;
      })
      .addCase(loadMoreBusinesses.fulfilled, (state, action) => {
        // Append new businesses to existing list
        state.businesses = [...state.businesses, ...action.payload.businesses];
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.hasMore = state.businesses.length < state.total;
        state.error = null;
      })
      .addCase(loadMoreBusinesses.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load more businesses';
      });

    // Refresh businesses
    builder
      .addCase(refreshBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload.businesses;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.hasMore = state.businesses.length < state.total;
        state.error = null;
      })
      .addCase(refreshBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to refresh businesses';
      });

    // Create business
    builder
      .addCase(createBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses.unshift(action.payload);
        state.total += 1;
        state.error = null;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create business';
      });

    // Update business
    builder
      .addCase(updateBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.businesses.findIndex(business => business.id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update business';
      });

    // Delete business
    builder
      .addCase(deleteBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = state.businesses.filter(business => business.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.error = null;
      })
      .addCase(deleteBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to delete business';
      });

    // Get business by ID
    builder
      .addCase(getBusinessById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBusinessById.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.businesses.findIndex(business => business.id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        } else {
          state.businesses.push(action.payload);
        }
        state.error = null;
      })
      .addCase(getBusinessById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get business';
      });

    // Fetch businesses with delay
    builder
      .addCase(fetchBusinessesWithDelay.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessesWithDelay.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload.businesses;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.hasMore = state.businesses.length < state.total;
        state.error = null;
      })
      .addCase(fetchBusinessesWithDelay.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch businesses';
      });
  },
});

// Export actions
export const {
  clearError,
  setError,
    clearBusinesses,
    setBusinesses,
    addBusiness,
    updateBusinessLocal,
    removeBusinessLocal,
} = businessesSlice.actions;

// Export selectors
export const selectBusinesses = (state: { businesses: BusinessesState }) => state.businesses.businesses;
export const selectBusinessesLoading = (state: { businesses: BusinessesState }) => state.businesses.isLoading;
export const selectBusinessesError = (state: { businesses: BusinessesState }) => state.businesses.error;
export const selectBusinessesTotal = (state: { businesses: BusinessesState }) => state.businesses.total;
export const selectBusinessesPage = (state: { businesses: BusinessesState }) => state.businesses.page;
export const selectBusinessesLimit = (state: { businesses: BusinessesState }) => state.businesses.limit;
export const selectBusinessesHasMore = (state: { businesses: BusinessesState }) => state.businesses.hasMore;
export const selectBusinessById = (id: string) => (state: { businesses: BusinessesState }) => 
  state.businesses.businesses.find(business => business.id === id);

export default businessesSlice.reducer;
