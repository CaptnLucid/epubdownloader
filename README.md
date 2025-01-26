# EPUB Downloader

This script is a re-creation of a python script made by [Mia Combeau](https://github.com/mcombeau/epub_downloader/), but in Javascript.

Just as the python script, this can pull epubs from the following sites:

- [epub.pub](https://www.epub.pub/)
- [Read Any Book](https://www.readanybook.com/)

If you're interested in additional domains, open an issue or submit a PR and it will be looked into.

## Prerequisites

- NodeJS
- Dependencies
  - `axios`
  - `cli-progress`
  - `commander`
  - `jsdom`
  - `zip-a-folder`

## Installation

1. Clone repository.
2. `cd epub-downloader-js`
3. Install NPM packages

```bash
npm install
```

## Usage

To run the script, use the following in a terminal space:

```bash
node index.js 
```
Use arrow keys to select the source and press `Enter` to choose it
```bash
- EPUBPub
- ReadAnyBook
```
Enter the URL of the book
```bash
? Enter the URL of the book:
```

## Notes

- The script will create a temporary directory to store downloaded files, which will be cleaned up after the EPUB is created.
- **Support Authors: If you enjoy an ebook you downloaded using this script, please consider supporting the author by purchasing the book from a legitimate retailer.**
