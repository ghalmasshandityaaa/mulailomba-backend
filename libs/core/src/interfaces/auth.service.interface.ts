export interface IAuthService {
  sendActivationCode(emailAddress: string): Promise<void>;
}
