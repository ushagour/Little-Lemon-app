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
- **SQLite Integration**: Menu data persisted locally for fast offline access
- **Cold-start Optimization**: Loads from local DB on subsequent app launches, fetches remote API only when needed

## Cold-Start Flow

**First Launch (Fresh Install):**

```text
App Start
  ↓
SQLiteBootstrap (ensure DB table exists)
  ↓
Home Screen opens
  ↓
DB empty? Yes
  ↓
Fetch Remote API (menu.json)
  ↓
Insert rows into SQLite ← Background seeding
  ↓
Display UI from Remote Data (fast)
  ↓
Next cold start will load from DB
```

**Subsequent Launches (DB has data):**

```text
App Start
  ↓
SQLiteBootstrap (ensure DB table exists)
  ↓
Home Screen opens
  ↓
DB empty? No
  ↓
Load rows from SQLite (instant, no network)
  ↓
Display UI from Local Data
  ↓
User interaction (search, filter, order)
```

**If DB Fails:**

```text
Home Screen
  ↓
ensureMenuTable(db) fails / DB unavailable
  ↓
Fallback to Remote API fetch
  ↓
Display UI, retry DB seeding in background
```

## Screenshots

Logo / Splash

![Logo](./screenshots/splash.png)

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





