export default class DelayHandler {
  /**
   * 딜레이 만들어줌
   *
   * @param ms 미리초
   * @returns
   */
  async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
