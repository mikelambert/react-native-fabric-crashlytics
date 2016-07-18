'use strict';

import StackTrace from 'stacktrace-js';
import { Crashlytics } from 'react-native-fabric';

function init() {
  if (__DEV__) {
    // Don't send exceptions from __DEV__, it's way too noisy!
    // Live reloading and hot reloading in particular lead to tons of noise...
    return;
  }

  var originalHandler = global.ErrorUtils.getGlobalHandler();
  function errorHandler(e) {
    StackTrace.fromError(e, {offline: true}).then((x)=>Crashlytics.recordCustomExceptionName(e.message, e.message, x));
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
