# Settler

> A local-first expense, debt, and event-splitting app built with Expo, React Native, TypeScript, Zustand, and SQLite.

[![Expo](https://img.shields.io/badge/Expo-55-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.83-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-local%20database-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Zustand](https://img.shields.io/badge/Zustand-state%20management-433E38)](https://zustand.docs.pmnd.rs/)

## Overview

**Settler** is a mobile-first personal finance utility designed to keep track of money owed between people and expenses associated with shared events.

The application has two closely related workflows:

- **Debt tracking** — record people, money given/taken, descriptions, and transaction dates.
- **Event expense tracking** — create an event, record expenses paid by different people, and calculate each person's contribution and net position.

The project is built as an **offline/local-first application**. Data is stored in a local SQLite database on the device rather than relying on a remote backend.

## Features

### Debt Management

- Add people to your debt ledger.
- Assign an optional avatar and automatically generated accent color.
- Record transactions as:
  - `give` — money you gave to a person.
  - `take` — money you received/took from a person.
- Add a description and date to every transaction.
- Edit or delete people.
- Edit or delete transactions.
- Deleting a person cascades to their associated transactions.

### Event Expense Tracking

- Create events with a name and date.
- Add expenses to an event.
- Store:
  - payer/person name
  - amount
  - expense reason
  - expense date
- Edit or delete events and expenses.
- Deleting an event removes its associated expenses.
- Calculate per-person event summaries including:
  - total paid
  - equal share
  - net balance

A positive net value means the person should receive money; a negative value means the person owes money.

### Local Persistence

Settler uses `expo-sqlite` for persistent local storage.

The database contains four core tables:

| Table | Purpose |
|---|---|
| `people` | People participating in debt tracking |
| `transactions` | Individual give/take transactions |
| `events` | Shared events |
| `expenses` | Expenses belonging to events |

SQLite foreign keys and cascading deletes are enabled, and WAL mode is used for the database.

## Tech Stack

| Technology | Role |
|---|---|
| **Expo 55** | React Native development platform |
| **React Native 0.83** | Mobile UI framework |
| **TypeScript 5.9** | Type-safe application development |
| **Expo Router** | File-based navigation |
| **Zustand** | Application state management |
| **Expo SQLite** | Local persistent database |
| **React Native Reanimated** | Animations |
| **React Native Gesture Handler** | Gesture interactions |
| **React Native UI Datepicker** | Date selection |
| **Day.js** | Date manipulation |
| **AsyncStorage** | Lightweight local storage support |
| **Expo Vector Icons / Symbols** | Icons and interface elements |

The dependency configuration is defined in `package.json`.

## Architecture

```text
Settler
│
├── Expo / React Native UI
│   └── src/app
│       ├── (tabs)
│       ├── debt
│       └── events
│
├── Reusable Components
│   └── src/components
│
├── State Management
│   └── src/store
│       ├── debtStore.ts
│       ├── eventStore.ts
│       └── selectors.ts
│
├── Data Layer
│   └── src/database
│       ├── db.ts
│       └── queries.ts
│
└── Utilities
    └── src/utils
```

### Data Flow

```text
User Interaction
       │
       ▼
React Native Screens
       │
       ▼
Zustand Store
       │
       ▼
Database Query Layer
       │
       ▼
Expo SQLite
       │
       ▼
Local settler.db
```

The store layer exposes CRUD operations while the database/query layer handles SQLite reads and writes.

## Project Structure

```text
Settler/
├── assets/
│   ├── icon/
│   └── Design.png
│
├── src/
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── debt/
│   │   │   ├── events/
│   │   │   └── _layout.tsx
│   │   ├── debt/
│   │   │   └── [personId].tsx
│   │   ├── events/
│   │   │   └── [eventId].tsx
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   │
│   ├── components/
│   │   ├── debt/
│   │   ├── events/
│   │   └── ui/
│   │
│   ├── database/
│   │   ├── db.ts
│   │   └── queries.ts
│   │
│   ├── store/
│   │   ├── debtStore.ts
│   │   ├── eventStore.ts
│   │   └── selectors.ts
│   │
│   └── utils/
│
├── app.json
├── eas.json
├── eslint.config.js
├── metro.config.js
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js
- npm
- Git
- Expo-compatible development environment
- Android Studio for an Android emulator, if required
- Xcode for an iOS simulator, if developing on macOS

### 1. Clone the repository

```bash
git clone https://github.com/AbaanAnsari/Settler.git
cd Settler
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npx expo start
```

You can then open the application using:

- **Expo Go**
- **Android emulator**
- **iOS simulator**
- A development build

### Run on Android

```bash
npm run android
```

### Run on iOS

```bash
npm run ios
```

### Run on Web

```bash
npm run web
```

### Run linting

```bash
npm run lint
```

## Database

The application creates a local SQLite database named:

```text
settler.db
```

The schema is initialized automatically when the database is first opened.

### `people`

```text
id
name
avatar
color
```

### `transactions`

```text
id
personId
amount
type
description
date
```

### `events`

```text
id
name
date
```

### `expenses`

```text
id
eventId
personName
amount
reason
date
```

Relationships:

```text
people
  │
  └── transactions

events
  │
  └── expenses
```

Foreign keys are enabled with cascading deletes so related records are cleaned up when their parent record is removed.

## State Management

Settler uses Zustand stores to separate application state from the UI.

### Debt Store

`src/store/debtStore.ts` manages:

- People
- Transactions
- Database loading
- Add/update/delete operations

A transaction contains:

```ts
{
  id: string;
  personId: string;
  amount: number;
  type: "give" | "take";
  description: string;
  date: string;
}
```

### Event Store

`src/store/eventStore.ts` manages:

- Events
- Event expenses
- Database loading
- Add/update/delete operations
- Per-person event summaries

An expense contains:

```ts
{
  id: string;
  eventId: string;
  personName: string;
  amount: number;
  reason: string;
  date: string;
}
```

## Expense Settlement Logic

For an event, Settler tracks how much each person has paid and compares it with the equal share of the total expense.

Conceptually:

```text
Total Event Expense
        │
        ▼
Total / Number of People
        │
        ▼
Equal Share Per Person
```

For each person:

```text
Net = Total Paid - Equal Share
```

Therefore:

- `Net > 0` → person should receive money.
- `Net = 0` → person is settled.
- `Net < 0` → person owes money.

This makes the event module useful for trips, dinners, group purchases, college events, and shared activities.

## Design Approach

The project follows a modular architecture:

- **Screens** handle user interaction.
- **Components** provide reusable UI.
- **Zustand stores** coordinate application state.
- **Query functions** isolate database operations.
- **SQLite** provides persistent offline storage.
- **TypeScript interfaces** define the core domain models.

This separation makes it easier to extend Settler with additional financial features without tightly coupling the UI to the database.

## Current Scope

Settler currently focuses on local expense and debt tracking.

It does **not** currently rely on a cloud backend, authentication system, or online synchronization layer.

Potential future extensions include:

- Debt settlement suggestions
- Automatic "who pays whom" optimization
- Group/member management
- Expense categories
- Recurring expenses
- Charts and spending analytics
- Export to CSV/PDF
- Cloud backup and synchronization
- Authentication
- Multi-device collaboration
- Notifications and payment reminders
- UPI/payment deep links

## Development Notes

The repository currently contains an Expo starter/template section in the root README, while the actual application implementation has evolved into a debt and event expense tracker. This README is intended to document the implemented application rather than the original Expo starter text.

## Contributing

Contributions are welcome.

A typical workflow:

```bash
git checkout -b feature/your-feature
npm install
npm run lint
```

Then make your changes, test the application on the target platform, commit them, and open a pull request.

## License

No explicit open-source license is currently declared in the repository metadata. If this project is intended for public reuse, add a `LICENSE` file and update this section accordingly.

## Author

**Abaan Ansari**

GitHub: [@AbaanAnsari](https://github.com/AbaanAnsari)

## Repository

[https://github.com/AbaanAnsari/Settler](https://github.com/AbaanAnsari/Settler)
