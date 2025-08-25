export class ErrorResponseDto {
  statusCode: number;

  message: string;

  error: string;

  timestamp: string;

  path: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  errors: Array<{
    field: string;
    message: string;
    value: any;
  }>;
}
