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

## Author

**Abaan Ansari**

GitHub: [@AbaanAnsari](https://github.com/AbaanAnsari)

## Repository

[https://github.com/AbaanAnsari/Settler](https://github.com/AbaanAnsari/Settler)
