import EnvConfig from '../configs/EnvConfig';
import Approacher from './Approacher';
import PageHandler from './PageHandler';

/**
 * 정의해놓은 work들을 동작시킵니다.
 */
export default class Runner {
  async run() {
    EnvConfig.initConfig();

    const pageHandler = new PageHandler();

    const approacher = new Approacher(EnvConfig.current, pageHandler);

    approacher.accessPage();
  }
}
