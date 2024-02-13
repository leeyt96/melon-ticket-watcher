export default class AppError extends Error {
  message: string;

  constructor(message: string) {
    super();
    this.message = message;
  }

  /**
   * 페이지 접근 실패
   *
   * @param message 에러 내용
   * @returns 에러 객체
   */
  static pageNotFound(message: string) {
    return new AppError(message);
  }

  /**
   * 탐색 희망 인자값 유효성 검사 실패
   *
   * @param message 에러 내용
   * @returns 에러 객체
   */
  static badRequest(message: string) {
    return new AppError(message);
  }
}
