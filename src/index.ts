import Runner from './works/Runner';

/**
 * 작업을 시작합니다.
 */
const main = async () => {
  await new Runner().run();
};

main();
