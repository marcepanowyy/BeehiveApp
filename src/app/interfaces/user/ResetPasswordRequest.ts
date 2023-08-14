export interface ResetPasswordRequest{
  recipient: string;
  code: string;
  newPassword: string
}
