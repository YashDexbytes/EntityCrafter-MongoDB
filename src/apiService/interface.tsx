export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  accessTokenExpiry: string;
  refreshToken: string;
  refreshTokenExpiry: string;
}
