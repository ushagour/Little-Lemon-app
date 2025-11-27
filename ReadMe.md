# Little Lemon App

A small React Native demo app for a restaurant-style onboarding and profile flow. The app shows a compact header, onboarding screen, profile editing (with masked phone input), and a reusable button component.




## Scenario 

![Logo](./screenshots/scenario1.png)


## Features

- Onboarding with form validation (name + email) and Next button in the footer
- Profile screen with editable fields: First name, Family name, Email, Phone (US mask)
- Avatar with initials fallback when no image is uploaded
- Notification preferences (checkboxes)
- Persistent profile saved to device using AsyncStorage
- Reusable `AppButton` component for consistent buttons across screens

## Screenshots

Logo / Splash

![Logo](./screen/images/Logo.png)

Hero / Home (example)

![Hero](./screenshots/Hero image.png)

Profile (avatar & edit)

![Profile](./screenshots/Profile.png)

Food / content examples

![Greek Salad](./screenshots/Greek salad.png)

![Pasta](./screenshots/Pasta.png)

## Running

1. Install dependencies: `npm install` or `yarn`
2. Start the Metro bundler: `npx react-native start`
3. Run on Android: `npx react-native run-android` or iOS: `npx react-native run-ios`

Notes:
- This project uses `react-native-mask-text` for phone masking and `@react-native-async-storage/async-storage` for simple persistence.
- If you want me to add screenshots of other screens or change the README tone, tell me which images or wording you prefer.





