// src/epub_file_downloader/epubDownloader.js

import fs from "fs/promises"; // Use fs/promises to avoid promise wrapper
import path from "path";
import axios from "axios";
import { JSDOM } from "jsdom";
import { SingleBar, Presets } from "cli-progress";
import FileManager from "../util/fileManager.js"; // Corrected import for default export

const MAX_RETRIES = 3;
const MAX_DELAY = 5;

class EpubFileDownloader {
  constructor(logster, base_url, ebook_name, source) {
    this.logster = logster;
    this.base_url = base_url;
    this.ebook_name = ebook_name;
    this.source = source;
    this.file_manager = new FileManager(logster, ebook_name); // Use the FileManager class
    this.retry_codes = [
      429, // TOO_MANY_REQUESTS
      500, // INTERNAL_SERVER_ERROR
      502, // BAD_GATEWAY
      503, // SERVICE_UNAVAILABLE
      504, // GATEWAY_TIMEOUT
    ];
  }

  async download_file(filePath) {
    const url = `${this.base_url}/${filePath}`;
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        this.logster.log(
          `Fetching URL: ${url} (Attempt ${attempt + 1}/${MAX_RETRIES})`
        );
        const response = await axios.get(url, { responseType: "arraybuffer" });
        if (!response.data) {
          return false;
        }
        await this.file_manager.saveContentToFile(response.data, filePath); // Modified method name
        return true;
      } catch (error) {
        this.logster.log(
          `Failed to fetch: ${url}, Attempt ${
            attempt + 1
          }/${MAX_RETRIES}, Error: ${error.message}`
        );
        if (
          error.response &&
          this.retry_codes.includes(error.response.status)
        ) {
          await new Promise((resolve) => setTimeout(resolve, MAX_DELAY * 1000));
          continue;
        }
        this.logster.log(
          `Giving up on fetching URL: ${url} after ${MAX_RETRIES} attempts.`
        );
        return false;
      }
    }
  }

  async extract_content_opf_path_from_xml(container_xml_path) {
    const local_path = this.file_manager.getLocalFilePath(container_xml_path); // Adjusted method name
    try {
      const fileContent = await fs.readFile(local_path, "utf-8");
      const dom = new JSDOM(fileContent, { contentType: "text/xml" });
      const rootfileElement = dom.window.document.querySelector("rootfile");

      if (!rootfileElement || !rootfileElement.getAttribute("full-path")) {
        throw new Error(
          "Failed to find the rootfile element in container.xml."
        );
      }
      return rootfileElement.getAttribute("full-path");
    } catch (error) {
      throw new Error(`Error reading container.xml: ${error.message}`);
    }
  }

  async get_file_paths_from_content_opf(content_opf_path) {
    const local_path = this.file_manager.getLocalFilePath(content_opf_path); // Adjusted method name

    const fileContent = await fs.readFile(local_path, "utf-8");
    const dom = new JSDOM(fileContent, { contentType: "text/xml" });
    const itemElements = dom.window.document.querySelectorAll("item");
    let file_paths = Array.from(itemElements).map((item) =>
      item.getAttribute("href")
    );

    const subdirectory = path.dirname(content_opf_path);
    if (subdirectory) {
      file_paths = file_paths.map(
        (file_path) => `${subdirectory}/${file_path}`
      );
    }

    this.logster.log(`Found ${file_paths.length} file paths in content.opf`);
    return file_paths;
  }

  async download_all_files(file_paths) {
    const totalFiles = file_paths.length;
    const bar = new SingleBar(
      {
        format: "{bar} | {percentage}% | {value}/{total}",
        barCompleteChar: "\u2588",
        barIncompleteChar: "\u2591",
        stopSymbol: "X",
      },
      Presets.shades_classic
    );

    bar.start(totalFiles, 0);

    for (let index = 0; index < totalFiles; index++) {
      const path = file_paths[index];
      await this.download_file(path);

      // Update progress bar
      bar.increment();
    }

    bar.stop();
    this.logster.log("All files downloaded successfully.");
  }

  async download_epub_files() {
    this.logster.log("---- Creating mimetype file...");
    await this.file_manager.saveContentToFile(
      Buffer.from("application/epub+zip", "utf-8"),
      "mimetype"
    );

    this.logster.log("---- Downloading container.xml file...");
    const container_xml_path = "META-INF/container.xml";
    await this.download_file(container_xml_path);

    this.logster.log("---- Extracting content.opf path from container.xml...");
    const content_opf_path = await this.extract_content_opf_path_from_xml(
      container_xml_path
    );

    this.logster.log("---- Downloading content.opf file...");
    await this.download_file(content_opf_path);

    this.logster.log("---- Getting file list from content.opf...");
    const file_paths = await this.get_file_paths_from_content_opf(
      content_opf_path
    );

    this.logster.log("---- Downloading files...");
    await this.download_all_files(file_paths);

    this.logster.log("---- Creating EPUB archive...");
    await this.file_manager.createEpubArchive(); // Adjusted method name

    this.logster.log("---- Deleting temporary files...");
    await this.file_manager.cleanupEpubFileDirectory(); // Adjusted method name
  }
}

export default EpubFileDownloader; // Use export default for ES Module
