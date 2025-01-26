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
node index.js <url>
```

### Example

Currently `epub.pub` isn't working properly with the `spread/continuous` pages, so the best alternative is to use an asset link.

```bash
node index.js https://asset.epub.pub/epub/it-by-stephen-king-1.epub
```

Or for `Read Any Book`

```bash
https://www.readanybook.com/ebook/it-book-565296
```

## Notes

- The script will create a temporary directory to store downloaded files, which will be cleaned up after the EPUB is created.
- **Support Authors: If you enjoy an ebook you downloaded using this script, please consider supporting the author by purchasing the book from a legitimate retailer.**
