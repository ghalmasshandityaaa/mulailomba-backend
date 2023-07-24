export interface IActivationCodeService {
  create(email: string, activationCode: string): Promise<void>;
  verify(emailAddress: string, activationCode: string): Promise<void>;
}
