export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 404) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }

  public serializeError() {
    return {
      message: this.message,
      statusCode: this.statusCode,
    }
  }
}
