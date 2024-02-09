import type { ClassTransformOptions as ClassTransformerOptions } from 'class-transformer/types/interfaces';
import type { ValidatorOptions as ClassValidatorOptions } from 'class-validator/types/validation/ValidatorOptions';
import type { TransformOptions } from 'class-transformer/types/interfaces';

export const CLASS_TRANSFORMER_OPTIONS: Readonly<ClassTransformerOptions> = {
  excludeExtraneousValues: true
};
export const CLASS_VALIDATOR_OPTIONS: Readonly<ClassValidatorOptions> = {
  validationError: { target: false }
};
export const TO_CLASS_ONLY: Readonly<TransformOptions> = { toClassOnly: true };
