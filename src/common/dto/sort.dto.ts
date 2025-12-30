import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { SORTABLE_FIELDS, SORT_DIRECTIONS } from '../constants/sort-fields';

export function IsValidSort(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidSort',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments): boolean {
          if (typeof value !== 'string') {
            return false;
          }

          const [field, direction] = value.split(':');
          return !!(
            field &&
            direction &&
            SORTABLE_FIELDS.includes(field as any) &&
            SORT_DIRECTIONS.includes(direction as any)
          );
        },
        defaultMessage(_args: ValidationArguments) {
          return `Sort must be in format "field:direction" where field is one of ${SORTABLE_FIELDS.join(', ')} and direction is ${SORT_DIRECTIONS.join(' or ')}`;
        },
      },
    });
  };
}
