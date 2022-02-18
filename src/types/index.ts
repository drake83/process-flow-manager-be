import { ValidatorOptions } from '@nestjs/common/interfaces/external/validator-options.interface';
import { ValidationError } from 'class-validator';

export interface ValidationPipeOptions extends ValidatorOptions {
  transform?: boolean;
  disableErrorMessages?: boolean;
  exceptionFactory?: (errors: ValidationError[]) => any;
}

// admin = all su ogni cosa
// manager = crud sulle "cose" assegnategli + user
// creator = creare/modifica gli oggetti
export type Role = 'admin' | 'manager' | 'creator' | 'reader';

export type Entity = 'connections' | 'profiles' | 'data-models' | 'projects';
