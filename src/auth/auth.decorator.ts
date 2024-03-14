import { SetMetadata } from '@nestjs/common';

export const Label = (...args: string[]) => SetMetadata('label', args);