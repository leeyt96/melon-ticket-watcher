import { Frame, Page } from 'puppeteer';
import cheerio from 'cheerio';

export default class PageHandler {
  /**
   * 현재 페이지의 주소를 반환해줌
   *
   * @param page 현재 페이지
   * @returns 현재 페이지 주소
   */
  getCurrentUrl(page: Page) {
    return page.url();
  }

  /**
   * 현재 페이지 또는 프레임에 존재하는 특정 요소를 클릭해줌
   *
   * @param page 현재 페이지 or 프레임
   * @param path 해당 요소 selector 경로
   */
  async clickElement(page: Page | Frame, path: string) {
    await page.waitForSelector(path);

    await page.click(path);
  }

  /**
   * 걍 카카오 로그인 자동화 메서드
   *
   * @param page 현재 페이지
   * @param idInputPath id 입력 input selector 경로
   * @param pwInputPath pw 입력 input selector 경로
   * @param userId 카카오 id
   * @param userPw 카카오 pw
   */
  async insertLoginInfo(
    page: Page,
    idInputPath: string,
    pwInputPath: string,
    userId: string,
    userPw: string
  ) {
    await page.waitForSelector(idInputPath);
    await page.waitForSelector(pwInputPath);

    await page.type(idInputPath, userId);
    await page.type(pwInputPath, userPw);
  }

  /**
   * 현재 프레임의 전체 html 컨텐츠 내용을 반환해줌
   *
   * @param frame 현재 프레임
   * @returns html 컨텐츠 객체
   */
  async loadContent(frame: Frame) {
    const content = await frame.content();

    return cheerio.load(content);
  }
}
