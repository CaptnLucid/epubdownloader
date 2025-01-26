import { EpubHandler } from "../epubHandler.js";

class DefaultHandler extends EpubHandler {
  getEpubBaseUrl() {
    this.ebookName = this.url.split("/").pop().split(".")[0];
    return this.url;
  }
}

export { DefaultHandler };
