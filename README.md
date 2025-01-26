# EPUB Downloader

This script is a re-creation of a python script made by [Mia Combeau](https://github.com/mcombeau), but in Javascript.

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
