// src/epub_locator/handlers/epubPubHandler.js

import axios from "axios";
import { JSDOM } from "jsdom";
import { EpubHandler } from "../epubHandler.js";

class EpubPubHandler extends EpubHandler {
  async getEpubBaseUrl() {
    const domain = new URL(this.url).hostname; // Using URL constructor to parse the URL

    let epubBaseUrl;

    if (domain === "spread.epub.pub" || domain === "continuous.epub.pub") {
      const contentOpfUrl = await this._getEpubPubEbookContentOpfUrl(this.url);
      epubBaseUrl = this._getEpubBaseUrlFromSpecificUrl(contentOpfUrl);
    } else if (domain === "asset.epub.pub") {
      epubBaseUrl = this._getEpubBaseUrlFromSpecificUrl(this.url);
    } else {
      const spreadUrl = await this._getEpubPubReadOnlineUrl();
      const contentOpfUrl = await this._getEpubPubEbookContentOpfUrl(spreadUrl);
      epubBaseUrl = this._getEpubBaseUrlFromSpecificUrl(contentOpfUrl);
    }

    this.logster.log(`Determined EPUB base URL: ${epubBaseUrl}`);
    return epubBaseUrl;
  }

  _getEpubBaseUrlFromSpecificUrl(url) {
    this.logster.log(`Parsing base URL from URL: ${url}`);
    const parts = url.split("/");
    const epubBaseUrlParts = [];

    for (const part of parts) {
      epubBaseUrlParts.push(part);
      if (part.endsWith(".epub")) {
        this.ebookName = part.split(".")[0];
        break;
      }
    }

    return epubBaseUrlParts.join("/");
  }

  async _getEpubPubReadOnlineUrl() {
    this.logster.log(`Fetching read online link from URL: ${this.url}`);
    const response = await axios.get(this.url);
    const dom = new JSDOM(response.data);
    const readOnlineButton = dom.window.document.querySelector("a.btn-read");

    if (!readOnlineButton) {
      throw new Error("Failed to find the 'Read Online' link.");
    }

    const domain = readOnlineButton.getAttribute("data-domain");
    const readId = readOnlineButton.getAttribute("data-readid");
    const readOnlineUrl = `${domain}/epub/${readId}`;

    return readOnlineUrl;
  }

  async _getEpubPubEbookContentOpfUrl(readOnlineUrl) {
    this.logster.log(`Fetching content.opf from URL: ${readOnlineUrl}`);
    const response = await axios.get(readOnlineUrl);
    const dom = new JSDOM(response.data);
    const assetUrl = dom.window.document.querySelector("#assetUrl");

    if (!assetUrl || !assetUrl.value) {
      throw new Error("Failed to find content.opf URL in the spread page.");
    }

    const contentOpfUrl = assetUrl.value;
    return contentOpfUrl;
  }
}

export { EpubPubHandler };
