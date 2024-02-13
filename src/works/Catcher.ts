import { Frame } from 'puppeteer';
import PageHandler from '../handlers/PageHandler';
import EnvConfig from '../configs/EnvConfig';
import Indicator from './Indicator';

export default class Catcher {
  /** 빈자리가 존재하는 구역 찾기 성공 여부 상태값 */
  static area_status: boolean = false;

  /** 빈자리가 있는 구역의 좌석 등급 */
  static currentSection: string = '';

  /** 빈자리가 있는 구역의 좌석 li태그 id값 */
  static targetListId: string = '';

  /** 빈자리가 있는 구역의 이름 */
  static targetAreaName: string = '';

  /** 포도알의 nth-child 인덱스 */
  static targetRectIndex: number = 0;

  /** 포도알 찾기 성공 여부 상태값 */
  static seat_status: boolean = false;

  /**
   * 잔여 좌석이 0보다 큰 좌석 등급 및 구역 정보를 캐치하는 함수임
   *
   * @param sectionIndex 좌석 등급 배열의 인덱스
   * @param seatsSelector 특정 좌석 등급의 모든 구역(li) 요소들
   * @param oneStopFrame 예매 팝업 창 안에있는 iframe
   * @param pageHandler 페이지 핸들러
   * @param pathConfig 탐색 경로 변수
   * @param currnetConfig 탐색 희망 조건
   */
  async catchArea(
    sectionIndex: number,
    seatsSelector: string,
    oneStopFrame: Frame,
    pageHandler: PageHandler,
    pathConfig: Partial<EnvConfig>,
    currnetConfig: Partial<Indicator>
  ) {
    /** 좌석 등급이 모두 클릭 되었을때, 모든 컨텐츠 내용 로드하기 */
    const $ = await pageHandler.loadContent(oneStopFrame);

    /** 특정 좌석 등급의 모든 구역(li)들을  lists 에 할당 */
    const lists = $(seatsSelector);

    console.log(
      `ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ ${currnetConfig.SECTIONS[sectionIndex]}석 ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ`
    );

    /** 특정 좌석 등급의 특정 구역(li)에 접근 하기*/
    lists.each((index, list) => {
      /** 특정 좌석 등급의 특정 구역 이름 */
      const area = $(list).find(pathConfig.TARGET_SECTION_AREA_NAME_SPAN).text();

      /** 특정 좌석 등급의 특정 구역의 남은 좌석 수 */
      const count = $(list).find(pathConfig.TARGET_SECTION_AREA_COUNT_STRONG).text();

      /** 특정 좌석 등급에 해당하는 모든 구역 정보 출력 */
      console.log({
        section: `${currnetConfig.SECTIONS[sectionIndex]}석`,
        area,
        count,
      });

      /** 잔여 좌석이 0보다 크면, */
      if (parseInt(count) > 0) {
        /** 성공 여부 상태값 초기화 */
        Catcher.area_status = true;

        /** 성공한 좌석 등급 */
        Catcher.currentSection = `${currnetConfig.SECTIONS[sectionIndex]}석`;

        /** 성공한 좌석 li태그 id값 */
        Catcher.targetListId = $(list).attr('id');

        /** 성공한 좌석 구역 */
        Catcher.targetAreaName = area;

        /** each문 탈출! */
        return false;
      }
    });
  }

  /**
   * 잔여 좌석이 0보다 큰 구역에서 포도알을 캐치하는 함수임
   *
   * @param oneStopFrame 예매 팝업 창 안에있는 iframe
   * @param pageHandler 페이지 핸들러
   * @param pathConfig 탐색 경로 변수
   */
  async catchSeat(oneStopFrame: Frame, pageHandler: PageHandler, pathConfig: Partial<EnvConfig>) {
    /** 좌석 선택 화면으로 들어왔을때, 모든 컨텐츠 내용 로드하기 */
    const $ = await pageHandler.loadContent(oneStopFrame);

    /** 포도알 불이 꺼졌을때의 색상 코드 리스트 */
    const stopFillCode = [pathConfig.SEAT_STOP_FILL_CODE_NONE, pathConfig.SEAT_STOP_FILL_CODE_GREY];

    /** 좌석 맵을 감싸고 있는 svg 경로 */
    const targetSeat = [pathConfig.TARGET_SEAT_MAP_SVG];

    const seatSvgElements = $(targetSeat[0]);

    /** svg 안에서 포도알(rect) 찾기 */
    const rectElements = $(seatSvgElements).find('rect');

    /** 해당 구역에 존재하는 모든 포도알(rect)에 접근하기 */
    rectElements.each((rectIndex, rectElement) => {
      /** 각 포도알(rect)의 색상(fill)코드 뽑기 */
      const fill = $(rectElement).attr('fill');

      /** 해당 포도알에 불이 켜져있으면, */
      if (!stopFillCode.includes(fill)) {
        /** 포도알 찾기 성공 여부 상태값 초기화 */
        Catcher.seat_status = true;

        /**
         * 포도알(rect) 인덱스 초기화
         * rect 위에 desc, defs, rect(감싸는) 3개가 있어서 3 추가
         * */
        Catcher.targetRectIndex = rectIndex + 3;

        /** each문 탈출! */
        return false;
      }
    });
  }
}
