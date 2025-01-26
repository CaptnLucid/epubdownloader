// src/epub_locator/epubLocator.js

import { EpubHandlerFactory } from "./epubHandlerFactory.js";
import { Logster } from "../util/logging.js";

class EpubLocator {
  constructor(logster, url) {
    this.logster = logster; // Instance of Logster for logging
    this.url = url; // The URL that indicates the EPUB source
    this.handler = EpubHandlerFactory.getHandler(url, logster); // Instantiate the appropriate handler
  }

  async getEpubBaseUrl() {
    // Calls the handler's method to get the base URL for the EPUB
    return await this.handler.getEpubBaseUrl();
  }

  getEbookName() {
    // Calls the handler's method to retrieve the ebook name
    return this.handler.getEbookName();
  }
}

export { EpubLocator };
