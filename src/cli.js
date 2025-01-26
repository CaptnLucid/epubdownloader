// src/cli.js

import { Command } from "commander";
import EpubFileDownloader from "./epubfile_downloader/epubDownloader.js"; // Corrected import
import { EpubLocator } from "./epub_locator/epubLocator.js";
import { Logster } from "./util/logging.js";

const program = new Command();

program
  .version("1.0.0")
  .description(
    "Download an ebook from https://www.epub.pub/ and create an EPUB file."
  )
  .argument("<bookUrl>", "The URL of the book on https://www.epub.pub/")
  .option("-v, --verbose", "Enable verbose output");

program.parse(process.argv);

const options = program.opts();
const bookUrl = program.args[0].replace(/\/$/, ""); // Remove trailing slash if present

async function main() {
  const logger = new Logster(options.verbose);
  const locator = new EpubLocator(logger, bookUrl);

  const baseUrl = await locator.getEpubBaseUrl();
  const ebookName = locator.getEbookName();
  const downloader = new EpubFileDownloader(logger, baseUrl, ebookName);

  await downloader.download_epub_files();
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
});
