
react-native-fabric-crashlytics
===============================

Reports javascript exceptions in React Native to the Crashlytics server, using the react-native-fabric library.

Usage
-----

To use, add this code to your index.ios.js and index.android.js (or some library included by both).

```
// Already assumes that Fabric is initialized/configured properly in the iOS and Android app startup code.
import crashlytics from 'react-native-fabric-crashlytics';
crashlytics.init();
```