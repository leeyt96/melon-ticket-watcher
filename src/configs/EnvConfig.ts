import * as env from 'dotenv';

export default class EnvConfig {
  static url: { readonly MELON_TICKET_URL: string };

  static info: { readonly ID: string; readonly PW: string };

  static path: { readonly TOP_LOGIN_BUTTON: string };

  private static load() {
    env.config();
  }

  static parseEnv() {
    this.url = EnvConfig.getUrl();
    this.info = EnvConfig.getInfo();
    this.path = EnvConfig.getPath();
  }

  private static getUrl() {
    EnvConfig.load();

    return {
      MELON_TICKET_URL: process.env.MELON_TICKET_URL,
    };
  }
  private static getInfo() {
    EnvConfig.load();

    return {
      ID: process.env.ID,
      PW: process.env.PW,
    };
  }
  private static getPath() {
    EnvConfig.load();

    return {
      TOP_LOGIN_BUTTON: process.env.TOP_LOGIN_BUTTON,
    };
  }
}
