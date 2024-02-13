import Indicator from './Indicator';
import EnvConfig from '../configs/EnvConfig';
import PageHandler from '../handlers/PageHandler';
import DelayHandler from '../handlers/DelayHandler';
import Approacher from './Approacher';
import Catcher from './Catcher';
import Watcher from './Watcher';
import Notifier from './Notifier';

/**
 * 정의해놓은 work들을 순서대로 동작시킵니다.
 */
export default class Runner {
  async run() {
    /**
     * 탐색 희망 [회차] 및 [좌석 등급]을 설정해주세요.
     *
     * [회차] : '1회차', '2회차', '3회차', '4회차'
     * [등급] : 'RSA', 'RS', 'R'
     */
    Indicator.initCurrentConditionConfig('4회차', 'RSA');

    /** 경로 변수 초기화 */
    EnvConfig.initProcessConfig();

    /** PageHandler 인스턴스 초기화 */
    const pageHandler = new PageHandler();

    /** DelayHandler 인스턴스 초기화 */
    const delayHandler = new DelayHandler();

    /** Catcher 인스턴스 초기화 */
    const catcher = new Catcher();

    /** Notifier 인스턴스 초기화 */
    const notifier = new Notifier();

    /** Approacher 인스턴스 초기화 */
    const approacher = new Approacher(
      pageHandler,
      delayHandler,
      EnvConfig.url,
      EnvConfig.path,
      EnvConfig.kakaoLogin,
      Indicator.currentCondition
    );

    /** 예매 페이지 접근 */
    const oneStopFrame = await approacher.accessOneStopFrame();

    /** Watcher 인스턴스 초기화 */
    const watcher = new Watcher(
      catcher,
      notifier,
      oneStopFrame,
      pageHandler,
      delayHandler,
      EnvConfig.path,
      Indicator.currentCondition
    );

    /** 희망하는 회차의 좌석 등급들을 빙빙돌면서 탐색 */
    while (true) {
      const result = await watcher.watch();

      /** 성공시, 작업을 종료합니다.  */
      if (result) break;
    }
  }
}
