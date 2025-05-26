export interface AlertMessage {
  message: string;
  type: 'success' | 'error';
}

export interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
} 