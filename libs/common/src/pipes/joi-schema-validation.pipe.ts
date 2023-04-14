import { ArgumentMetadata, HttpException, HttpStatus, PipeTransform } from '@nestjs/common';
import { ValidationError, ValidationErrorItem } from 'joi';
import { getClassSchema } from 'joi-class-decorators';
import { HttpErrorResponse } from '../interfaces';

export class JoiSchemaValidationPipe implements PipeTransform {
  /**
   *
   * @param value
   * @param metadata
   * @returns
   */
  transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (metatype) {
      let schema;

      try {
        schema = getClassSchema(metatype);
      } catch (err) {
        return value;
      }

      if (schema) {
        const result = schema.validate(value, {
          abortEarly: false,
          allowUnknown: true,
        });
        if (result.error) {
          throw new JoiValidationError(result.error);
        }
        return result.value;
      }
    }
  }
}

export class JoiValidationError extends HttpException {
  private error: ValidationError;

  constructor(error: ValidationError) {
    super({}, HttpStatus.BAD_REQUEST);
    this.error = error;
  }

  /**
   *
   * @returns
   */
  getStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }

  /**
   *
   * @returns
   */
  getResponse(): HttpErrorResponse {
    return {
      ok: false,
      error: {
        code: 'request/invalid-arguments',
        details: this.getValidationMessage(this.error.details),
      },
    };
  }

  private getValidationMessage(errors: ValidationErrorItem[]) {
    const details: string[] = [];
    errors.map((error) => {
      details.push(error.message);
    });
    return details;
  }
}
