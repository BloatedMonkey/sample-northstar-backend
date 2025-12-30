import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
                validate(value: any, _args: ValidationArguments) {
          if (typeof value !== 'string') {
            return false;
          }

          const minLength = 8;
          const hasUpperCase = /[A-Z]/.test(value);
          const hasLowerCase = /[a-z]/.test(value);
          const hasNumbers = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>\[\]\\\/_\-+=~`]/.test(value);

          return (
            value.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            (hasNumbers || hasSpecialChar)
          );
        },
                defaultMessage(_args: ValidationArguments) {
          return 'Password must be at least 8 characters long and contain uppercase, lowercase, and either numbers or special characters';
        },
      },
    });
  };
}
