import { SetMetadata } from '@nestjs/common';

export const RolePathLabel = (...args: string[]) => SetMetadata('rolePathLabel', args);