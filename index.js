'use strict';

import StackTrace from 'stacktrace-js';
import { Crashlytics } from 'react-native-fabric';

function init() {
  var originalHandler = global.ErrorUtils.getGlobalHandler();
  function errorHandler(e) {
    StackTrace.fromError(e).then((x)=>Crashlytics.recordCustomExceptionName(e.message, e.message, x));
    // And then re-throw the exception with the original handler
    if (originalHandler) {
      originalHandler(e);
    }
  }
  global.ErrorUtils.setGlobalHandler(errorHandler);
}

module.exports = {
  init,
}
