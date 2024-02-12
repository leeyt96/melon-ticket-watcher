import EnvConfig from '../configs/EnvConfig';
import AppError from '../utils/ErrorHandler';

export default class Indicator {
  static currentCondition: Partial<Indicator>;

  readonly DATE: string;
  readonly TARGET_DATE: string[];
  readonly SECTIONS: string[];
  readonly TARGET_SECTIONS: string[];
  readonly TARGET_AREAS: string[];

  /** 탐색을 희망하는 경우를 담은 경로 변수들입니다. */
  private static date: string = ''; // 예매 날짜
  private static targetDate: string[] = []; // 예매 날짜 버튼 경로
  private static sections: string[] = []; // 좌석 등급 이니셜
  private static targetSections: string[] = []; // 예매 날짜에 해당하는 좌석 등급 버튼 경로
  private static targetAreas: string[] = []; // 예매 날짜에 해당하는 각 좌석 등급 구역의 li 태그 경로

  /**
   * 탑색을 희망하는 특정 경우를 currentCondition으로 초기화
   *
   * @param DATE_FOR 탐색 희망 회차를 입력하세요.
   * @param SEARCHING_FOR 탐색 희망 좌석 등급을 입력하세요.
   */
  static initCurrentConditionConfig(DATE_FOR: string, SEARCHING_FOR: string) {
    this.currentCondition = Indicator.indicateCurrentConditionConfig(DATE_FOR, SEARCHING_FOR);
  }

  /**
   * Indicator 인스턴스 초기화 함수임
   *
   * @param conditions 선택된 탐색 희망 조건
   * @returns Indicator 인스턴스
   */
  private static createCurrentConfig(conditions: Partial<Indicator>) {
    return Object.assign(new Indicator(), conditions);
  }

  /** default conditions 로드하기 */
  private static loadDefaultCondition() {
    EnvConfig.initDefaultConditionConfig();
  }

  /**
   * 탐색을 희망하는 조건을 입력받고, 해당 조건을 바탕으로 Indicator 인스턴스 만들기
   *
   * @param DATE_FOR 탐색 희망 회차
   * @param SEARCHING_FOR 탐색 희망 좌석 등급
   * @returns
   */
  private static indicateCurrentConditionConfig(DATE_FOR: string, SEARCHING_FOR: string) {
    Indicator.loadDefaultCondition();

    let TARGET_SECTION_LIST: string[] = []; // 좌석 등급

    switch (DATE_FOR) {
      case '1회차':
        Indicator.date = EnvConfig.defaultCondition.DATE_3_2;
        Indicator.targetDate = [EnvConfig.defaultCondition.TARGET_DATE_3_2];
        TARGET_SECTION_LIST = [
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_R_3_2,
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_S_3_2,
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_A_3_2,
        ];
        break;
      case '2회차':
        Indicator.date = EnvConfig.defaultCondition.DATE_3_3;
        Indicator.targetDate = [EnvConfig.defaultCondition.TARGET_DATE_3_3];
        TARGET_SECTION_LIST = [
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_R_3_3,
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_S_3_3,
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_A_3_3,
        ];
        break;
      case '3회차':
        Indicator.date = EnvConfig.defaultCondition.DATE_3_9;
        Indicator.targetDate = [EnvConfig.defaultCondition.TARGET_DATE_3_9];
        TARGET_SECTION_LIST = [
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_R_3_9,
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_S_3_9,
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_A_3_9,
        ];
        break;
      case '4회차':
        Indicator.date = EnvConfig.defaultCondition.DATE_3_10;
        Indicator.targetDate = [EnvConfig.defaultCondition.TARGET_DATE_3_10];
        TARGET_SECTION_LIST = [
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_R_3_10,
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_S_3_10,
          EnvConfig.defaultCondition.TARGET_SECTION_DATE_A_3_10,
        ];
        break;
      default:
        throw AppError.badRequest('⛔ 회차일이 유효하지 않습니다.');
    }

    switch (SEARCHING_FOR) {
      case 'R':
        Indicator.sections = [EnvConfig.defaultCondition.SECTION_R];
        Indicator.targetSections = [TARGET_SECTION_LIST[0]];
        Indicator.targetAreas = [EnvConfig.defaultCondition.TARGET_AREA_R];
        break;
      case 'RS':
        Indicator.sections = [
          EnvConfig.defaultCondition.SECTION_R,
          EnvConfig.defaultCondition.SECTION_S,
        ];
        Indicator.targetSections = [TARGET_SECTION_LIST[0], TARGET_SECTION_LIST[1]];
        Indicator.targetAreas = [
          EnvConfig.defaultCondition.TARGET_AREA_R,
          EnvConfig.defaultCondition.TARGET_AREA_S,
        ];
        break;
      case 'RSA':
        Indicator.sections = [
          EnvConfig.defaultCondition.SECTION_R,
          EnvConfig.defaultCondition.SECTION_S,
          EnvConfig.defaultCondition.SECTION_A,
        ];
        Indicator.targetSections = [
          TARGET_SECTION_LIST[0],
          TARGET_SECTION_LIST[1],
          TARGET_SECTION_LIST[2],
        ];
        Indicator.targetAreas = [
          EnvConfig.defaultCondition.TARGET_AREA_R,
          EnvConfig.defaultCondition.TARGET_AREA_S,
          EnvConfig.defaultCondition.TARGET_AREA_A,
        ];
        break;
      default:
        throw AppError.badRequest('⛔ 좌석 등급이 유효하지 않습니다.');
    }

    return this.createCurrentConfig({
      DATE: Indicator.date,
      TARGET_DATE: Indicator.targetDate,
      SECTIONS: Indicator.sections,
      TARGET_SECTIONS: Indicator.targetSections,
      TARGET_AREAS: Indicator.targetAreas,
    });
  }
}
