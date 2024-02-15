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
     * Notice ) 탐색을 희망하는 [회차] 및 [좌석 등급]을 설정해주세요.
     *
     * [회차] : '1회차', '2회차', '3회차', '4회차'
     *
     * [등급] : 'R석', 'S석', 'A석', 'R/S석', 'R/S/A석'
     *
     */
    Indicator.initCurrentConditionConfig('4회차', 'R/S석');

    /** 경로 변수 초기화 */
    EnvConfig.initProcessConfig();

    const pageHandler = new PageHandler();

    const delayHandler = new DelayHandler();

    const catcher = new Catcher();

    const notifier = new Notifier();

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
