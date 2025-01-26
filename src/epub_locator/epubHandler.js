// src/epub_locator/epubHandler.js

import { Logster } from "../util/logging.js"; // Adjust the path if necessary

class EpubHandler {
  constructor(url) {
    this.url = url;
    this.logster = new Logster(); // Assuming you want to create a new instance of Logster for each handler
    this.ebookName = "unknown_ebook";
  }

  // Abstract method to be implemented by subclasses
  async getEpubBaseUrl() {
    throw new Error("Method 'getEpubBaseUrl' must be implemented.");
  }

  getEbookName() {
    return this.ebookName;
  }
}

export { EpubHandler };
