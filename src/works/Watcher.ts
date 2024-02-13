import { Frame } from 'puppeteer';
import Catcher from './Catcher';
import Notifier from './Notifier';
import PageHandler from '../handlers/PageHandler';
import DelayHandler from '../handlers/DelayHandler';
import EnvConfig from '../configs/EnvConfig';
import Indicator from './Indicator';

export default class Watcher {
  constructor(
    private readonly catcher: Catcher,
    private readonly notifier: Notifier,
    private readonly oneStopFrame: Frame,
    private readonly pageHandler: PageHandler,
    private readonly delayHandler: DelayHandler,
    private readonly pathConfig: Partial<EnvConfig>,
    private readonly currnetConfig: Partial<Indicator>
  ) {}

  /** 빈자리가 존재하는 구역 찾기 성공 여부 상태값 */
  private static area_status: boolean = false;

  /** 빈자리가 있는 구역의 좌석 등급 */
  private static currentSection: string = '';

  /** 빈자리가 있는 구역의 좌석 li태그 id값 */
  private static targetListId: string = '';

  /** 빈자리가 있는 구역의 이름 */
  private static targetAreaName: string = '';

  /** 포도알의 nth-child 인덱스 */
  private static targetRectIndex: number = 0;

  /** 포도알 찾기 성공 여부 상태값 */
  private static seat_status: boolean = false;

  /**
   * 탐색을 희망하는 좌석 등급을 빙빙돌면서 포도알을 탐지하고 알려줍니다.
   *
   * @returns 특정 구역에 빈자리가 있을때, true를 반환
   */
  async watch() {
    /** 좌석 등급( R, S, A ) 버튼 클릭 */
    for (const sectionSelector of this.currnetConfig.TARGET_SECTIONS) {
      await this.pageHandler.clickElement(this.oneStopFrame, sectionSelector);

      /** 좌석 등급 클릭 딜레이 0.2초 */
      await this.delayHandler.delay(200);
    }

    /** 좌석 등급 배열의 인덱스 */
    let sectionIndex: number = 0;

    /** 모든 좌석 등급의 모든 구역(li)에 접근하기 */
    for (const seatsSelector of this.currnetConfig.TARGET_AREAS) {
      /** 잔여 좌석이 0보다 큰 좌석 등급 및 구역 정보를 캐치하는 함수임 */
      await this.catcher.catchArea(
        sectionIndex,
        seatsSelector,
        this.oneStopFrame,
        this.pageHandler,
        this.pathConfig,
        this.currnetConfig
      );

      /** 캐치한 좌석 등급 및 구역 정보 업뎃 */
      Watcher.area_status = Catcher.area_status;
      Watcher.currentSection = Catcher.currentSection;
      Watcher.targetListId = Catcher.targetListId;
      Watcher.targetAreaName = Catcher.targetAreaName;

      /** 잔여 좌석이 0보다 크면, 해당 구역을 클릭하고 for문 탈출하기 */
      if (Watcher.area_status === true) {
        /** 성공한 좌석 등급에 해당하는 구역 클릭 */
        await this.pageHandler.clickElement(this.oneStopFrame, `#${Watcher.targetListId}`);

        console.log(
          `>> ${this.currnetConfig.DATE} / [${Watcher.currentSection}] / ${Watcher.targetAreaName}에 자리가 생겼습니다!`
        );

        break;
      } else sectionIndex++;
    }

    /** 해당 구역 클릭 후 좌석 선택 화면으로 왔다면, 포도알을 찾아보자 */
    if (Watcher.area_status === true) {
      /** 잔여 좌석이 0보다 큰 구역에서 포도알을 캐치하는 함수임 */
      await this.catcher.catchSeat(this.oneStopFrame, this.pageHandler, this.pathConfig);

      /** 캐치한 포도알 정보 업뎃 */
      Watcher.seat_status = Catcher.seat_status;
      Watcher.targetRectIndex = Catcher.targetRectIndex;

      /** 이제 포도알을 클릭하고 좌석 선택 완료 버튼을 눌러보자 */
      if (Watcher.seat_status === true) {
        /** 포도알 찾았을때 알림!! */
        this.notifier.notify(
          this.currnetConfig.DATE,
          Watcher.currentSection,
          Watcher.targetAreaName
        );

        /** 해당 포도알 클릭 */
        await this.pageHandler.clickElement(
          this.oneStopFrame,
          `${this.pathConfig.TARGET_ACTIVE_SEAT_RECT}:nth-child(${Watcher.targetRectIndex})`
        );

        /** 좌석 선택 완료 버튼 클릭 전 딜레이 0.7초 */
        await this.delayHandler.delay(700);

        /** 좌석 선택 완료 버튼 클릭 */
        await this.pageHandler.clickElement(
          this.oneStopFrame,
          this.pathConfig.TARGET_SELECT_SEAT_COMPLETE_BUTTON
        );

        console.log(
          `>> ${this.currnetConfig.DATE} / [${Watcher.currentSection}] / ${Watcher.targetAreaName} / 포도알 클릭 성공!!`
        );

        /** while문으로 return! */
        return Watcher.area_status;
      } else {
        /** 포도알을 뻇겼다면.. */
        console.log(
          `>> ${this.currnetConfig.DATE} / [${Watcher.currentSection}] / ${Watcher.targetAreaName} / 포도알 클릭 실패..`
        );

        /** while문으로 return.. */
        return Watcher.area_status;
      }
    } else {
      /** 메인 루프 딜레이 1초 */
      await this.delayHandler.delay(1000);

      /** 좌석 등급( R, S, A ) 버튼 닫기 */
      for (const sectionSelector of this.currnetConfig.TARGET_SECTIONS) {
        await this.pageHandler.clickElement(this.oneStopFrame, sectionSelector);

        /** 좌석 등급 클릭 딜레이 0.2초 */
        await this.delayHandler.delay(200);
      }
    }
  }
}
