import * as env from 'dotenv';

export default class EnvConfig {
  static defaultCondition: Partial<EnvConfig>;
  static url: Partial<EnvConfig>;
  static kakaoLogin: Partial<EnvConfig>;
  static path: Partial<EnvConfig>;

  readonly DATE_3_2: string;
  readonly DATE_3_3: string;
  readonly DATE_3_9: string;
  readonly DATE_3_10: string;

  readonly TARGET_DATE_3_2: string;
  readonly TARGET_DATE_3_3: string;
  readonly TARGET_DATE_3_9: string;
  readonly TARGET_DATE_3_10: string;

  readonly SECTION_R: string;
  readonly SECTION_S: string;
  readonly SECTION_A: string;

  readonly TARGET_SECTION_DATE_R_3_2: string;
  readonly TARGET_SECTION_DATE_S_3_2: string;
  readonly TARGET_SECTION_DATE_A_3_2: string;

  readonly TARGET_SECTION_DATE_R_3_3: string;
  readonly TARGET_SECTION_DATE_S_3_3: string;
  readonly TARGET_SECTION_DATE_A_3_3: string;

  readonly TARGET_SECTION_DATE_R_3_9: string;
  readonly TARGET_SECTION_DATE_S_3_9: string;
  readonly TARGET_SECTION_DATE_A_3_9: string;

  readonly TARGET_SECTION_DATE_R_3_10: string;
  readonly TARGET_SECTION_DATE_S_3_10: string;
  readonly TARGET_SECTION_DATE_A_3_10: string;

  readonly TARGET_AREA_R: string;
  readonly TARGET_AREA_S: string;
  readonly TARGET_AREA_A: string;

  readonly MELON_TICKET: string;

  readonly ID: string;
  readonly PW: string;

  readonly TOP_LOGIN_BUTTON: string;
  readonly KAKAO_LOGIN_BUTTON: string;
  readonly KAKAO_LOGIN_ID_INPUT: string;
  readonly KAKAO_LOGIN_PW_INPUT: string;
  readonly KAKAO_LOGIN_SUBMIT_BUTTON: string;

  /** 탐색을 희망하는 모든 경우를 defaultCondition으로 초기화 */
  static initDefaultConditionConfig() {
    this.defaultCondition = EnvConfig.parseDefaultConditionEnv();
  }

  /** 각 역할별로 초기화 */
  static initProcessConfig() {
    this.url = EnvConfig.parseUrlEnv();
    this.kakaoLogin = EnvConfig.parseKakaoLoginEnv();
    this.path = EnvConfig.parsePathEnv();
  }

  /**
   * EnvConfig 인스턴스 초기화 함수임
   *
   * @param env 환경변수
   * @returns EnvConfig 인스턴스
   */
  private static createConfig(env: Partial<EnvConfig>) {
    return Object.assign(new EnvConfig(), env);
  }

  /** env 로드하기 */
  private static loadEnv() {
    env.config();
  }

  /** 탐색을 희망하는 모든 경우를 담은 EnvConfig 인스턴스 만들기 */
  private static parseDefaultConditionEnv() {
    EnvConfig.loadEnv();

    return this.createConfig({
      DATE_3_2: process.env.DATE_3_2,
      DATE_3_3: process.env.DATE_3_3,
      DATE_3_9: process.env.DATE_3_9,
      DATE_3_10: process.env.DATE_3_10,

      TARGET_DATE_3_2: process.env.TARGET_DATE_3_2,
      TARGET_DATE_3_3: process.env.TARGET_DATE_3_3,
      TARGET_DATE_3_9: process.env.TARGET_DATE_3_9,
      TARGET_DATE_3_10: process.env.TARGET_DATE_3_10,

      SECTION_R: process.env.SECTION_R,
      SECTION_S: process.env.SECTION_S,
      SECTION_A: process.env.SECTION_A,

      TARGET_SECTION_DATE_R_3_2: process.env.TARGET_SECTION_DATE_R_3_2,
      TARGET_SECTION_DATE_S_3_2: process.env.TARGET_SECTION_DATE_S_3_2,
      TARGET_SECTION_DATE_A_3_2: process.env.TARGET_SECTION_DATE_A_3_2,

      TARGET_SECTION_DATE_R_3_3: process.env.TARGET_SECTION_DATE_R_3_3,
      TARGET_SECTION_DATE_S_3_3: process.env.TARGET_SECTION_DATE_S_3_3,
      TARGET_SECTION_DATE_A_3_3: process.env.TARGET_SECTION_DATE_A_3_3,

      TARGET_SECTION_DATE_R_3_9: process.env.TARGET_SECTION_DATE_R_3_9,
      TARGET_SECTION_DATE_S_3_9: process.env.TARGET_SECTION_DATE_S_3_9,
      TARGET_SECTION_DATE_A_3_9: process.env.TARGET_SECTION_DATE_A_3_9,

      TARGET_SECTION_DATE_R_3_10: process.env.TARGET_SECTION_DATE_R_3_10,
      TARGET_SECTION_DATE_S_3_10: process.env.TARGET_SECTION_DATE_S_3_10,
      TARGET_SECTION_DATE_A_3_10: process.env.TARGET_SECTION_DATE_A_3_10,

      TARGET_AREA_R: process.env.TARGET_AREA_R,
      TARGET_AREA_S: process.env.TARGET_AREA_S,
      TARGET_AREA_A: process.env.TARGET_AREA_A,
    });
  }

  /** 접속 주소를 담은 EnvConfig 인스턴스 만들기 */
  private static parseUrlEnv() {
    EnvConfig.loadEnv();

    return this.createConfig({
      MELON_TICKET: process.env.MELON_TICKET,
    });
  }

  /** 카카오 계정 정보를 담은 EnvConfig 인스턴스 만들기 */
  private static parseKakaoLoginEnv() {
    EnvConfig.loadEnv();

    return this.createConfig({
      ID: process.env.ID,
      PW: process.env.PW,
    });
  }
  /** 필수 경로 변수를 담은 EnvConfig 인스턴스 만들기 */
  private static parsePathEnv() {
    EnvConfig.loadEnv();

    return this.createConfig({
      TOP_LOGIN_BUTTON: process.env.TOP_LOGIN_BUTTON,
      KAKAO_LOGIN_BUTTON: process.env.KAKAO_LOGIN_BUTTON,
      KAKAO_LOGIN_ID_INPUT: process.env.KAKAO_LOGIN_ID_INPUT,
      KAKAO_LOGIN_PW_INPUT: process.env.KAKAO_LOGIN_PW_INPUT,
      KAKAO_LOGIN_SUBMIT_BUTTON: process.env.KAKAO_LOGIN_SUBMIT_BUTTON,
    });
  }
}
