const API_BASE_URL = process.env.NEXT_PUBLIC_ASTRALIS_API_URL;

export const ENDPOINTS = {
    auth:   `${API_BASE_URL}/auth`,
    users:  `${API_BASE_URL}/api/v1/users`,
    astralis: `${API_BASE_URL}/api/v1/astralis`,
    session: `${API_BASE_URL}/api/v1/sessions`,
};
