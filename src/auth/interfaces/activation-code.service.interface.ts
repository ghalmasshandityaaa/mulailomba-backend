export interface IActivationCodeService {
  create(email: string, activationCode: string): Promise<void>;
  verifyActivationCode(emailAddress: string, activationCode: string): Promise<void>;
}
