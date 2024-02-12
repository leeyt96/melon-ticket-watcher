import Indicator from './Indicator';
import EnvConfig from '../configs/EnvConfig';
import Approacher from './Approacher';

/**
 * 정의해놓은 work들을 순서대로 동작시킵니다.
 */
export default class Runner {
  async run() {
    /** 탐색 희망 조건을 설정해주세요. */
    Indicator.initCurrentConditionConfig('4회차', 'R');

    EnvConfig.initProcessConfig();

    const iFrame = Approacher.initFrame();
  }
}
