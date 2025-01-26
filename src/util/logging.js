// src/util/logging.js

class Logster {
  constructor(verbose) {
    this.verbose = verbose; // A flag to control verbosity
  }

  log(message, overrideVerbose = false) {
    // Logs the message if verbose mode is enabled or if overridden
    if (this.verbose || overrideVerbose) {
      console.log(message);
    }
  }
}

export { Logster };
