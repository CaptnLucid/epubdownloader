// src/epub_locator/epubHandlerFactory.js

import { EpubPubHandler } from "./handlers/epubPubHandler.js";
import { ReadAnyBookHandler } from "./handlers/readanyBookHandler.js";
import { DefaultHandler } from "./handlers/defaultHandler.js";
import { Logster } from "../util/logging.js"; // Adjust the import path if necessary

const EPUB_PUB_DOMAINS = [
  "www.epub.pub",
  "spread.epub.pub",
  "asset.epub.pub",
  "continuous.epub.pub",
];

class EpubHandlerFactory {
  static getHandler(url, logster) {
    const domain = new URL(url).hostname;

    if (EPUB_PUB_DOMAINS.includes(domain)) {
      logster.log(`Using epub.pub handler for url: ${url}`);
      return new EpubPubHandler(url, logster);
    }

    if (domain === "www.readanybook.com") {
      logster.log(`Using Read Any Book handler for url: ${url}`);
      return new ReadAnyBookHandler(url, logster);
    }

    logster.log(`Using default handler for url: ${url}`);
    return new DefaultHandler(url, logster);
  }
}

export { EpubHandlerFactory };
