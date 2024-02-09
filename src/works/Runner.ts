import EnvConfig from '../configs/EnvConfig';

/**
 * 정의해놓은 work들을 동작시킵니다.
 */
export default class Runner {
  constructor(private readonly confing: EnvConfig) {}
  async run() {
    console.log(this.confing);
  }
}
