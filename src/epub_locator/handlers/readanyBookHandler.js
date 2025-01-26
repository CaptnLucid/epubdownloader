// src/epub_locator/handlers/readAnyBookHandler.js

import axios from "axios";
import { JSDOM } from "jsdom";
import { EpubHandler } from "../epubHandler.js";

class ReadAnyBookHandler extends EpubHandler {
  async getEpubBaseUrl() {
    this.logster.log(`Fetching EPUB base URL from: ${this.url}`);

    const response = await axios.get(this.url);
    const dom = new JSDOM(response.data);
    const linkDiv = dom.window.document.querySelector("div.links-row");

    if (!linkDiv || !linkDiv.hasAttribute("data-link")) {
      throw new Error("Failed to find the EPUB source URL on the page.");
    }

    const epubUrl = linkDiv.getAttribute("data-link").replace(/\/$/, ""); // Remove trailing slash
    this.logster.log(`Extracted EPUB URL: ${epubUrl}`);

    this.ebookName = epubUrl.split("/").pop().split(".")[0];

    return epubUrl;
  }
}

export { ReadAnyBookHandler };
