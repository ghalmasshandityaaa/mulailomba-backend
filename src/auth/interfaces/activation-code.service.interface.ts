export interface IActivationCodeService {
  create(email: string, activationCode: string): Promise<void>;
}
