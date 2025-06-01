// services/AuthService.js
import { ENDPOINTS } from "@/api.config.js";

class AuthService {
    constructor() {
        this.baseURL = ENDPOINTS.auth || '';
    }

    getAuthHeaders() {
        const token = localStorage.getItem("accessToken");
        return token ? {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        } : {
            'Content-Type': 'application/json'
        };
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
            throw new Error("No refresh token available");
        }

        try {
            const response = await fetch(`${this.baseURL}/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                throw new Error("Token refresh failed");
            }

            const { accessToken, refreshToken: newRefreshToken } = await response.json();
            
            localStorage.setItem("accessToken", accessToken);
            if (newRefreshToken) {
                localStorage.setItem("refreshToken", newRefreshToken);
            }

            return accessToken;
        } catch (error) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            throw error;
        }
    }

    async authenticatedFetch(url, options = {}) {
        const headers = this.getAuthHeaders();
        
        let response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        });

        if (response.status === 401) {
            try {
                await this.refreshToken();
                const newHeaders = this.getAuthHeaders();
                
                response = await fetch(url, {
                    ...options,
                    headers: {
                        ...newHeaders,
                        ...options.headers
                    }
                });
            } catch (refreshError) {
                window.location.href = '/log-in';
                throw new Error("Authentication failed");
            }
        }

        return response;
    }

    isAuthenticated() {
        return !!localStorage.getItem("accessToken");
    }

    logout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}

export const authService = new AuthService();
