'use strict';

import { Platform } from 'react-native';
import StackTrace from 'stacktrace-js';
import { Crashlytics } from 'react-native-fabric';
var assign = require('lodash.assign');

function init() {
  if (__DEV__) {
    // Don't send exceptions from __DEV__, it's way too noisy!
    // Live reloading and hot reloading in particular lead to tons of noise...
    return;
  }

  var originalHandler = global.ErrorUtils.getGlobalHandler();
  function errorHandler(e, isFatal) {
    StackTrace.fromError(e, {offline: true}).then((x) => {
      Crashlytics.recordCustomExceptionName(e.message, e.message, x.map((row) => (assign({}, row, {
        fileName: `${row.fileName}:${row.lineNumber || 0}:${row.columnNumber || 0}`,
      }))))
    });
    // And then re-throw the exception with the original handler
    if (originalHandler) {
      if (Platform.OS === 'ios') {
        originalHandler(e, isFatal);
      } else {
        // On Android, throwing the original exception immediately results in the
        // recordCustomExceptionName() not finishing before the app crashes and therefore not logged
        // Add a delay to give it time to log the custom JS exception before crashing the app.
        // The user facing effect of this delay is that separate JS errors will appear as separate
        // issues in the Crashlytics dashboard.
        setTimeout(() => {
          originalHandler(e, isFatal);
        }, 500);
      }
    }
  }
  global.ErrorUtils.setGlobalHandler(errorHandler);
}

module.exports = {
  init,
}
