import puppeteer, { Browser, Frame, Page } from 'puppeteer';
import EnvConfig from '../configs/EnvConfig';
import AppError from '../utils/ErrorHandler';
import PageHandler from '../utils/PageHandler';
import DelayHandler from '../utils/DelayHandler';
import Indicator from './Indicator';

export default class Approacher {
  constructor(
    private readonly pageHandler: PageHandler,
    private readonly delayHandler: DelayHandler,
    private readonly currnetConfig: Partial<Indicator>,
    private readonly urlConfig: Partial<EnvConfig>,
    private readonly pathConfig: Partial<EnvConfig>,
    private readonly kakaoLoginConfig: Partial<EnvConfig>
  ) {}

  /** 크롬 테스트 브라우저 */
  private static browser: Browser;

  /** 예매 시작 페이지 */
  private static homePage: Page;

  /** 카카오 로그인 팝업 창 */
  private static kokaoLoginPopupPage: Page;

  /** 예매 팝업 창 */
  private static reservationPopupPage: Page;

  /** 예매 팝업 창 안에있는 iframe */
  private static oneStopFrame: Frame;

  /**
   * 예매 팝업 창에 들어가서, 그 안에있는 iframe 을 따옵니다.
   *
   * @returns iframe
   */
  static initFrame() {
    new Approacher(
      new PageHandler(),
      new DelayHandler(),
      Indicator.currentCondition,
      EnvConfig.url,
      EnvConfig.path,
      EnvConfig.kakaoLogin
    ).accessOneStopFrame();

    return this.oneStopFrame;
  }

  /**
   * 콘서트 예매 시작 페이지에 접속하고, 해당 브라우저 및 페이지를 초기화 합니다.
   */
  private async accessHomePage() {
    /** 크롬 테스트 브라우저 열기 */
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--start-maximized'], // 브라우저 창 최대
    });

    /** 브라우저 초기화 */
    Approacher.browser = browser;

    /** 빈 새 페이지(탭) 생성 */
    const homePage = await browser.newPage();

    /** 페이지 크기 설정 */
    await homePage.setViewport({
      width: 1100,
      height: 900,
    });

    /** 콘서트 예매 시작 페이지 접속 */
    await homePage.goto(this.urlConfig.MELON_TICKET);

    /** 페이지 초기화 */
    Approacher.homePage = homePage;
  }

  /**
   * 카카오 로그인 팝업 창에 접속하고, 해당 페이지를 초기화 합니다.
   */
  private async accessKakaoLoginPage() {
    /** 콘서트 예매 시작 페이지 접속 */
    await this.accessHomePage();

    console.log('1. 예매 시작 페이지 접속 OK');

    /** 상단 로그인 버튼 클릭 */
    await this.pageHandler.clickElement(Approacher.homePage, this.pathConfig.TOP_LOGIN_BUTTON);

    /** 로그인 선택 페이지 url 따기 */
    const currentUrl = this.pageHandler.getCurrentUrl(Approacher.homePage);

    /** 로그인 선택 페이지에 잘 들어왔는지 확인 */
    if (!currentUrl.includes('login_inform.htm'))
      throw AppError.pageNotFound('⛔ 로그인 선택 페이지를 찾지 못했습니다.');

    /** 카카오계정 로그인 버튼 클릭 */
    await this.pageHandler.clickElement(Approacher.homePage, this.pathConfig.KAKAO_LOGIN_BUTTON);

    /** 카카오 로그인 팝업 창이 나타날 때까지 대기 */
    const kakaoLoginPopupTarget = await Approacher.browser.waitForTarget(
      (target) => target.opener() === Approacher.homePage.target()
    );

    /** 카카오 로그인 팝업 창 접속 */
    const kokaoLoginPopupPage = await kakaoLoginPopupTarget.page();

    /** 카카오 로그인 팝업 창 초기화 */
    Approacher.kokaoLoginPopupPage = kokaoLoginPopupPage;
  }

  /**
   * 카카오 계정 정보를 바탕으로 카카오 로그인을 시도합니다.
   */
  private async kakaoLogin() {
    /** 카카오 로그인 팝업 창 접속 */
    await this.accessKakaoLoginPage();

    /** 카카오 로그인 팝업 창이 제대로 생성되었는지 확인 */
    if (!Approacher.kokaoLoginPopupPage)
      throw AppError.pageNotFound('⛔ 카카오 로그인 팝업 창을 찾지 못했습니다.');
    else console.log('2. 카카오 로그인 팝업 창 접속 OK');

    /** 카카오 계정 정보 입력 */
    await this.pageHandler.insertLoginInfo(
      Approacher.kokaoLoginPopupPage,
      this.pathConfig.KAKAO_LOGIN_ID_INPUT,
      this.pathConfig.KAKAO_LOGIN_PW_INPUT,
      this.kakaoLoginConfig.ID,
      this.kakaoLoginConfig.PW
    );

    /** 카카오 로그인 제출 버튼 클릭 */
    await this.pageHandler.clickElement(
      Approacher.kokaoLoginPopupPage,
      this.pathConfig.KAKAO_LOGIN_SUBMIT_BUTTON
    );
  }

  /**
   * 예매 팝업 창에 접속하고, 해당 페이지를 초기화 합니다.
   */
  private async accessReservationPage() {
    /** 카카오 로그인 성공시, 다시 예매 시작 페이지 접속 */
    await this.kakaoLogin();

    console.log('3. 카카오 로그인 OK');

    /** 예매 날짜 선택 버튼 클릭 */
    await this.pageHandler.clickElement(Approacher.homePage, this.currnetConfig.TARGET_DATE[0]);

    console.log('4. 예매 날짜 선택 OK');

    /** 예매 시간 선택 버튼 클릭 */
    await this.pageHandler.clickElement(Approacher.homePage, this.pathConfig.TARGET_TIME_BUTTON);

    console.log('5. 예매 시간 선택 OK');

    /** 예매하기 버튼 클릭 전 딜레이 1초 */
    await this.delayHandler.delay(1000);

    /** 예매하기 버튼 클릭 */
    await this.pageHandler.clickElement(
      Approacher.homePage,
      this.pathConfig.TICKET_RESERVATION_BUTTON
    );

    console.log('6. 예매하기 버튼 클릭 OK');

    /** 예매 팝업 창 로드 딜레이 1.5초 */
    await this.delayHandler.delay(1500);

    /** 예매 팝업 창이 나타날 때까지 대기 */
    const reservationPopupTarget = await Approacher.browser.waitForTarget(
      (target) => target.opener() === Approacher.homePage.target()
    );

    /** 예매 팝업 창 접속 */
    const reservationPopupPage = await reservationPopupTarget.page();

    /** 예매 팝업 페이지 초기화 */
    Approacher.reservationPopupPage = reservationPopupPage;
  }

  /**
   * 예매 팝업 창 안에있는 iframe을 열고, 해당 frame을 초기화 합니다.
   */
  private async accessOneStopFrame() {
    /** 예매 팝업 창 접속 */
    await this.accessReservationPage();

    /** 예매하기 팝업 창이 제대로 생성되었는지 확인 */
    if (!Approacher.reservationPopupPage)
      throw AppError.pageNotFound('⛔ 예매하기 팝업 창을 찾지 못했습니다.');
    else console.log('7. 예매 팝업 창 접속 OK');

    /** 예매하기 팝업 창 크기 설정 */
    await Approacher.reservationPopupPage.setViewport({
      width: 1100,
      height: 900,
    });

    /** 캡챠 코드 입력 딜레이 15초 */
    await this.delayHandler.delay(15000);

    console.log('8. 캡챠 코드 입력 OK');

    /** oneStop.htm iframe 열기 */
    const oneStopFrame = Approacher.reservationPopupPage
      .frames()
      .find((frame) => frame.name() === 'oneStopFrame');

    /** oneStop.htm iframe 초기화 */
    Approacher.oneStopFrame = oneStopFrame;
  }
}
