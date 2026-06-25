export type ApiValidationErrors = Record<string, string[]>

export class ApiError extends Error {
  status: number
  data: unknown
  validationErrors?: ApiValidationErrors

  constructor({
    message,
    status,
    data,
    validationErrors,
  }: {
    message: string
    status: number
    data?: unknown
    validationErrors?: ApiValidationErrors
  }) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
    this.validationErrors = validationErrors
  }
}

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong.") {
  if (error instanceof ApiError) {
    return error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return fallback
}
