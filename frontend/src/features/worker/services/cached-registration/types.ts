import { KeepAliveService } from '../keep-alive';
import { RegistrationService } from '../registration';

export interface CachedRegistrationServiceDependencies {
  keepAliveService: KeepAliveService;
  registrationService: RegistrationService;
  storageProvider: () => Storage;
}
