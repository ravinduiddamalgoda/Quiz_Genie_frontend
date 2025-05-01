// types/api.ts
export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }
  