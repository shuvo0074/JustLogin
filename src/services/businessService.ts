import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/env';
import { Business, BusinessesResponse } from '../types/business';

// Business service for business-related API calls
class BusinessService {
  private baseUrl = API_BASE_URL;
  private tokenKey = 'auth_token';

  // Get token from storage
  private async getStoredToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(this.tokenKey);
      console.log('Retrieved token from storage:', token ? 'Token exists' : 'No token found');
      return token;
    } catch (error) {
      console.error('Error getting stored token:', error);
      return null;
    }
  }

  // Validate token before making API calls
  private async validateToken(): Promise<string> {
    const token = await this.getStoredToken();
    if (!token) {
      throw new Error('No authentication token available. Please login again.');
    }

    // Check if token is not empty and has reasonable length
    if (token.trim().length < 10) {
      throw new Error('Invalid authentication token. Please login again.');
    }

    return token;
  }

  // Clear stored data (for unauthorized responses)
  private async clearStoredData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.tokenKey]);
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  }

  // Fetch user businesses from API
  async fetchBusinesses(page: number = 1, limit: number = 20): Promise<BusinessesResponse> {
    try {
      console.log('Fetching businesses with page:', page, 'limit:', limit);

      // Validate token before making API call
      const token = await this.validateToken();
      console.log('Token validated successfully', token);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const url = `${this.baseUrl}/businesses?page=${page}&limit=${limit}`;
      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);

        if (response.status === 401) {
          // Token is invalid, clear stored data
          console.log('Authentication failed, clearing stored data');
          await this.clearStoredData();
          throw new Error('Authentication failed. Please login again.');
        }
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Businesses API Response:', data);

      // Extract businesses data from API response
      const businesses: Business[] = data || data?.businesses || [];
      const total = data.data?.total || data.total || businesses.length;
      const currentPage = data.data?.page || data.page || page;
      const currentLimit = data.data?.limit || data.limit || limit;

      const businessesResponse: BusinessesResponse = {
        businesses,
        total,
        page: currentPage,
        limit: currentLimit,
      };

      console.log('Successfully fetched businesses:', businessesResponse);
      return businessesResponse;
    } catch (error) {
      console.error('Fetch businesses error:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your network connection.');
        }
        // Re-throw validation errors
        if (error.message.includes('authentication token')) {
          throw error;
        }
      }

      throw error;
    }
  }

  // Create a new business
  async createBusiness(businessData: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>): Promise<Business> {
    try {
      const token = await this.validateToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.baseUrl}/businesses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(businessData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await this.clearStoredData();
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract business data from API response
      const business: Business = {
        id: data.data?.id || data.id || Date.now().toString(),
        name: data.data?.name || data.name || businessData.name,
        description: data.data?.description || data.description || businessData.description,
        address: data.data?.address || data.address || businessData.address,
        phone: data.data?.phone || data.phone || businessData.phone,
        email: data.data?.email || data.email || businessData.email,
        website: data.data?.website || data.website || businessData.website,
        category: data.data?.category || data.category || businessData.category,
        logo: data.data?.logo || data.logo || businessData.logo,
        userId: data.data?.userId || data.userId || businessData.userId,
        createdAt: data.data?.createdAt || data.createdAt || new Date().toISOString(),
        updatedAt: data.data?.updatedAt || data.updatedAt || new Date().toISOString(),
      };

      return business;
    } catch (error) {
      console.error('Create business error:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your network connection.');
        }
      }

      throw error;
    }
  }

  // Update an existing business
  async updateBusiness(businessId: string, businessData: Partial<Omit<Business, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Business> {
    try {
      const token = await this.validateToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.baseUrl}/businesses/${businessId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(businessData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await this.clearStoredData();
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract updated business data from API response
      const business: Business = {
        id: businessId,
        name: data.data?.name || data.name || businessData.name || '',
        description: data.data?.description || data.description || businessData.description,
        address: data.data?.address || data.address || businessData.address,
        phone: data.data?.phone || data.phone || businessData.phone,
        email: data.data?.email || data.email || businessData.email,
        website: data.data?.website || data.website || businessData.website,
        category: data.data?.category || data.category || businessData.category,
        logo: data.data?.logo || data.logo || businessData.logo,
        userId: data.data?.userId || data.userId || businessData.userId || '',
        createdAt: data.data?.createdAt || data.createdAt || new Date().toISOString(),
        updatedAt: data.data?.updatedAt || data.updatedAt || new Date().toISOString(),
      };

      return business;
    } catch (error) {
      console.error('Update business error:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your network connection.');
        }
      }

      throw error;
    }
  }

  // Delete a business
  async deleteBusiness(businessId: string): Promise<void> {
    try {
      const token = await this.validateToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.baseUrl}/businesses/${businessId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await this.clearStoredData();
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Delete business error:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your network connection.');
        }
      }

      throw error;
    }
  }

  // Get a single business by ID
  async getBusinessById(businessId: string): Promise<Business> {
    try {
      const token = await this.validateToken();

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${this.baseUrl}/businesses/${businessId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          await this.clearStoredData();
          throw new Error('Authentication failed');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Extract business data from API response
      const business: Business = {
        id: data.data?.id || data.id || businessId,
        name: data.data?.name || data.name || '',
        description: data.data?.description || data.description,
        address: data.data?.address || data.address,
        phone: data.data?.phone || data.phone,
        email: data.data?.email || data.email,
        website: data.data?.website || data.website,
        category: data.data?.category || data.category,
        logo: data.data?.logo || data.logo,
        userId: data.data?.userId || data.userId || '',
        createdAt: data.data?.createdAt || data.createdAt || new Date().toISOString(),
        updatedAt: data.data?.updatedAt || data.updatedAt || new Date().toISOString(),
      };

      return business;
    } catch (error) {
      console.error('Get business by ID error:', error);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your internet connection.');
        }
        if (error.message.includes('fetch')) {
          throw new Error('Unable to connect to server. Please check your network connection.');
        }
      }

      throw error;
    }
  }
}

export const businessService = new BusinessService();
