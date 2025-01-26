// src/util/fileManager.js

import fs from "fs";
import path from "path";
import { promisify } from "util";
import { zip } from "zip-a-folder";

const OUTPUT_DIR = "downloaded_epubs";
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const rm = promisify(fs.rm);

class FileManager {
  constructor(logster, ebookName) {
    this.logster = logster;
    this.ebookName = ebookName;
    this.outputDirectory = path.join(OUTPUT_DIR, this.ebookName);
    this.setupDirectories();
  }

  async setupDirectories() {
    try {
      await mkdir(OUTPUT_DIR, { recursive: true });
      await mkdir(this.outputDirectory, { recursive: true });
    } catch (error) {
      this.logster.log(`Error setting up directories: ${error}`, true);
      throw error;
    }
  }

  async saveContentToFile(content, filePath) {
    const fullPath = path.join(this.outputDirectory, filePath);
    const directory = path.dirname(fullPath);

    try {
      await mkdir(directory, { recursive: true });
      if (content instanceof Buffer || typeof content === "string")
        await writeFile(fullPath, content);
      else if (content) await writeFile(fullPath, JSON.stringify(content));
      else throw new Error("Content to save is null or undefined!");

      this.logster.log(`Successfully saved: ${fullPath}`);
    } catch (error) {
      this.logster.log(`Error saving file: ${fullPath} - ${error}`, true);
      throw error;
    }
  }

  getLocalFilePath(filePath) {
    return path.join(this.outputDirectory, filePath);
  }

  async createEpubArchive() {
    const epubPath = path.join(OUTPUT_DIR, `${this.ebookName}.epub`);

    this.logster.log(`Creating EPUB at: ${epubPath}`);
    try {
      await zip(this.outputDirectory, epubPath);
      this.logster.log(`EPUB file created: ${epubPath}`, true);
    } catch (error) {
      this.logster.log(
        `Error creating epub archive at: ${epubPath}. Error: ${error}`,
        true
      );
      throw error;
    }
  }

  async cleanupEpubFileDirectory() {
    if (fs.existsSync(this.outputDirectory)) {
      try {
        await rm(this.outputDirectory, { recursive: true, force: true });
      } catch (error) {
        this.logster.log(
          `Error cleaning up directory: ${this.outputDirectory} - ${error}`,
          true
        );
        throw error;
      }
    }
  }
}

export default FileManager;
