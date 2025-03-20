# Contributing to Expensify

Welcome! Thanks for checking out the new Expensify app and for taking the time to contribute!

## Getting Started
If you would like to become an Expensify contributor, the first step is to read this document in its entirety. Please read the document before asking questions, as it may be covered within the documentation.

## Code of Conduct
This project and everyone participating in it is governed by the Expensify [Code of Conduct](https://github.com/Expensify/App/blob/main/CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to contributors@expensify.com.

## Restrictions
At this time, we are not hiring contractors in Crimea, North Korea, Russia, Iran, Cuba, or Syria.

## Asking Questions
If you have any general questions, please ask in the #expensify-open-source Slack channel. To request an invite to the channel, just email contributors@expensify.com with the subject Slack Channel Invite and include a link to your Upwork profile. We'll send you an invite! Note: The Expensify team will not be able to respond to direct messages in Slack.
If you are hired for an Upwork job and have any job-specific questions, please ask in the GitHub issue or pull request. This will ensure that the person addressing your question has as much context as possible.

## Reporting Vulnerabilities
If you've found a vulnerability, please email security@expensify.com with the subject Vulnerability Report instead of creating an issue.


## Development workflow

To get started with the project, run `npm install` in the root directory to install the required dependencies for each package:

```sh
npm install
```

While developing, you can run the [example app](/example/) to test your changes. Any changes you make in your library's JavaScript code will be reflected in the example app without a rebuild. If you change any native code, then you'll need to rebuild the example app.

To start the packager:

```sh
npm run example start
```

To run the example app on Android:

```sh
npm run example android
```

To run the example app on iOS:

```sh
npm run example ios
```


Make sure your code passes ESLint. Run the following to verify:

```sh
npm run lint
```

To fix formatting errors, run the following:

```sh
npm run lint --fix
```

Remember to add tests for your change if possible. Run the unit tests by:

```sh
npm run test
```
To edit the Objective-C files, open `example/ios/KeyCommandExample.xcworkspace` in XCode and find the source files at `Pods > Development Pods > react-native-key-command`.

To edit the Kotlin files, open `example/android` in Android studio and find the source files at `reactnativekeycommand` under `Android`.

- `npm run example start`: start the Metro server for the example app.
- `npm run example android`: run the example app on Android.
- `npm run example ios`: run the example app on iOS.

### Sending a pull request

> **Working on your first pull request?** You can learn how from this _free_ series: [How to Contribute to an Open Source Project on GitHub](https://app.egghead.io/playlists/how-to-contribute-to-an-open-source-project-on-github).


Minor update to documentation.