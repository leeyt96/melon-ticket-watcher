import { Page } from 'puppeteer';

export default class PageHandler {
  /**
   *
   * @param page 현재 페이지
   * @returns 현재 페이지 주소 반환
   */
  getCurrentUrl(page: Page) {
    return page.url();
  }

  /**
   *
   * @param page 현재 페이지
   * @param path 해당 요소 selector 경로
   */
  async clickElement(page: Page, path: string) {
    await page.waitForSelector(path);

    await page.click(path);
  }

  /**
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
}
