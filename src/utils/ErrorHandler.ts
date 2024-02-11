export default class AppError extends Error {
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  static pageNotFound(message: string) {
    return new AppError(message);
  }
}
