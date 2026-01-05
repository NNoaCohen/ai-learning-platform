import { apiService } from './apiService';
import { User } from '../types/user';
import Cookies from 'js-cookie';

interface LoginData {
    phone: string;
    password: string;
}

interface RegisterData {
    name: string;
    phone: string;
    password: string;
}

class AuthService {
    async login(data: LoginData): Promise<User> {
        try {
            const response = await apiService.post<{ user: User; token: string }>('/users/login', data);
            Cookies.set('token', response.token, { expires: 1 });
            localStorage.setItem('user', JSON.stringify(response.user));
            return response.user;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(data: RegisterData): Promise<User> {
        try {
            const response = await apiService.post<{ user: User; token: string }>('/users/register', data);
            Cookies.set('token', response.token, { expires: 1 });
            localStorage.setItem('user', JSON.stringify(response.user));
            return response.user;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    logout(): void {
        Cookies.remove('token');
        localStorage.removeItem('user');
    }

    getCurrentUser(): User | null {
        const user = localStorage.getItem('user');
        if (user && user !== 'undefined' && user !== 'null') {
            try {
                const parsedUser = JSON.parse(user);
                return parsedUser;
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                localStorage.removeItem('user');
                return null;
            }
        }
        return null;
    }

    isAuthenticated(): boolean {
        const user = this.getCurrentUser();
        const token = Cookies.get('token');
        return !!(user && token);
    }
}

export const authService = new AuthService();