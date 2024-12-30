import { SetMetadata } from '@nestjs/common';
import { SKIP_AUTH_KEY } from '../../src/constants';

export const SkipAuth = () => SetMetadata<string, boolean>(SKIP_AUTH_KEY, true);
