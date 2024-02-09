import EnvConfig from './configs/EnvConfig';
import Runner from './works/Runner';

/**
 * 작업을 시작합니다.
 */
const main = async () => {
  EnvConfig.parseEnv();

  await new Runner(EnvConfig).run();
};

main();
