export function apiSuccess<T>(data: T, message = "OK") {
  return { success: true, message, data };
}

export function apiError(message: string, details?: unknown) {
  return { success: false, message, details };
}
