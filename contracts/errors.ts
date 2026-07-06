export const ErrorMessages = {
  unauthenticated: "You must be logged in to do this.",
  insufficientRole: "You do not have permission to do this.",
};

export class AppError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const Errors = {
  forbidden: (message: string) => new AppError(403, message),
};
