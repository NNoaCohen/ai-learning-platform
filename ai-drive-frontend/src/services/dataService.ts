import { apiService } from './apiService';
import { User } from '../types/user';

export interface Category {
  _id: string;
  name: string;
}

export interface Subcategory {
  _id: string;
  name: string;
  categoryId: string;
}

export interface PromptRequest {
  userId: string;
  categoryId: string;
  subcategoryId: string;
  promptText: string;
}

export interface PromptResponse {
  success: boolean;
  data: {
    _id: string;
    userId: string;
    categoryId: string;
    subcategoryId: string;
    prompt: string;
    aiResponse: string;
    createdAt: string;
  };
  message: string;
}

export interface AddCategoryRequest {
  name: string;
}

export interface AddSubcategoryRequest {
  name: string;
  categoryId: string;
}

export interface HistoryItem {
  _id: string;
  userId: string;
  categoryId: string;
  subcategoryId: string;
  prompt: string;
  aiResponse: string;
  createdAt: string;
}

class DataService {
  async getCategories(): Promise<Category[]> {
    return apiService.get<Category[]>('/categories');
  }

  async getSubcategoriesByCategory(categoryId: string): Promise<Subcategory[]> {
    return apiService.get<Subcategory[]>(`/categories/${categoryId}`);
  }

  async getAllSubcategories(): Promise<Subcategory[]> {
    return apiService.get<Subcategory[]>('/subcategories');
  }

  async sendPrompt(promptData: PromptRequest): Promise<PromptResponse> {
    return apiService.post<PromptResponse>('/prompts/add', promptData);
  }

  async getUserHistory(userId: string): Promise<HistoryItem[]> {
    return apiService.get<HistoryItem[]>(`/users/${userId}/history`);
  }

  async addCategory(categoryData: AddCategoryRequest): Promise<Category> {
    return apiService.put<Category>('/categories/add', categoryData);
  }

  async addSubcategory(subcategoryData: AddSubcategoryRequest): Promise<Subcategory> {
    return apiService.put<Subcategory>('/subcategories/add', subcategoryData);
  }

  async getAllUsers(): Promise<User[]> {
    return apiService.get<User[]>('/users');
  }

  async deletePrompt(promptId: string): Promise<any> {
    return apiService.delete(`/prompts/${promptId}`);
  }
}

export const dataService = new DataService();