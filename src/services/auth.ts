// services/auth.ts
import api from '@/lib/axios';
import { LoginRequest, LoginResponse } from '@/types/api';

export const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/user/login', payload);
  return response.data;
};
