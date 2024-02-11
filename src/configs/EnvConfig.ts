import * as env from 'dotenv';

export default class EnvConfig {
  static current: EnvConfig;

  readonly URL: string;

  readonly ID: string;
  readonly PW: string;

  readonly TOP_LOGIN_BUTTON: string;
  readonly KAKAO_LOGIN_BUTTON: string;

  /** current에다가 환경변수 초기화 */
  static initConfig() {
    this.current = EnvConfig.parseEnv();
  }

  /**
   * EnvConfig 인스턴스 초기화 함수임
   *
   * @param env 환경변수
   */
  private static createConfig(env: EnvConfig) {
    return Object.assign(new EnvConfig(), env);
  }

  /** env 로드하기 */
  private static loadEnv() {
    env.config();
  }

  /** env 값들을 읽어와서 EnvConfig 인스턴스 생성 */
  private static parseEnv() {
    EnvConfig.loadEnv();

    return this.createConfig({
      URL: process.env.URL,
      ID: process.env.ID,
      PW: process.env.PW,
      TOP_LOGIN_BUTTON: process.env.TOP_LOGIN_BUTTON,
      KAKAO_LOGIN_BUTTON: process.env.KAKAO_LOGIN_BUTTON,
    });
  }
}
