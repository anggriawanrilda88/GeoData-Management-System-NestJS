import { BadRequestException, ValidationError } from "@nestjs/common";

// shared/exceptions/validation.exception.ts
export const validationExceptionFactory = (errors: ValidationError[]) => {
    const errMsg = { errors: {} };
    errors.forEach((error: ValidationError) => {
        errMsg['errors'][error.property] = [...Object.values(error.constraints)];
    });
    return new ValidationException(errMsg);
};

// shared/exceptions/validation.exception.ts
export class ValidationException extends BadRequestException {
    constructor(public validationErrors: Record<string, unknown>) {
        super(validationErrors);
    }
}