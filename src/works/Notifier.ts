import * as notifier from 'node-notifier';

export default class Notifier {
  /**
   * 포도알 탐지 성공 알림 발생기
   *
   * @param currentDate 예매 날짜
   * @param currentSection 좌석 등급
   * @param targetAreaName 좌석 구역
   */
  notify(currentDate: string, currentSection: string, targetAreaName: string) {
    notifier.notify({
      title: `[${currentSection}] / ${targetAreaName}`,
      message: currentDate,
      sound: true,
    });
  }
}
