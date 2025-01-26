import { Command } from "commander";
import EpubFileDownloader from "./epubfile_downloader/epubDownloader.js"; // Adjust the import as necessary
import { EpubLocator } from "./epub_locator/epubLocator.js";
import { Logster } from "./util/logging.js";
import inquirer from "inquirer"; // Import inquirer for interactive prompts

const program = new Command();

program
  .version("1.0.0")
  .description("Download an ebook and create an EPUB file.")
  .option("-v, --verbose", "Enable verbose output");

// Function to prompt for source selection
async function promptSource() {
  const choices = [
    { name: "EPUBPub", value: "epubpub" },
    { name: "ReadAnyBook", value: "readanybook" },
  ];

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "source",
      message: "Please select a source:",
      choices: choices,
      pageSize: 4,
    },
  ]);

  return answers.source; // Return the selected source
}

// Function to prompt for the book URL
async function promptBookUrl() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "bookUrl",
      message: "Enter the URL of the book:",
      validate: (input) => {
        // Example validation: check if it is not empty
        if (!input) {
          return "Book URL cannot be empty.";
        }
        return true;
      },
    },
  ]);

  return answers.bookUrl; // Return the book URL
}

async function main() {
  const options = program.opts();

  // Prompt user for source selection
  const selectedSource = await promptSource();

  // Prompt user for the book URL
  const bookUrl = await promptBookUrl();
  const sanitizedBookUrl = bookUrl.replace(/\/$/, ""); // Remove trailing slash if present

  const logger = new Logster(options.verbose);
  const locator = new EpubLocator(logger, sanitizedBookUrl);

  const baseUrl = await locator.getEpubBaseUrl(selectedSource); // You can modify this function to be aware of the source
  const ebookName = locator.getEbookName();

  const downloader = new EpubFileDownloader(
    logger,
    baseUrl,
    ebookName,
    selectedSource
  );

  await downloader.download_epub_files();
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
});
