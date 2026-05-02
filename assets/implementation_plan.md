# Settler — Expense Tracker & Debt Manager

A React Native app built with **Expo SDK 55** (expo-router file-based routing, React 19, RN 0.83) that covers three core domains: Debt, Events, and Voice Notes.

---

## Project Context

The workspace already has an Expo SDK 55 project scaffolded at `d:\Projects\App Development\Settler` with:
- `expo-router` for file-based navigation
- `react-native-gesture-handler`, `react-native-reanimated 4.x`, `react-native-screens`
- `react-native-safe-area-context`
- TypeScript (strict)

The `src/app/` directory currently has only an empty `_layout.tsx` and `index.tsx`.

---

## Key Technical Decisions

> [!IMPORTANT]
> **`expo-av` is REMOVED from Expo SDK 55.** We will use `expo-audio` (new API) for voice note recording and playback. This requires installing `expo-audio` separately.

> [!IMPORTANT]
> **Bottom Tabs via expo-router**: We'll use expo-router's `<Tabs>` layout with a custom `tabBar` renderer to get the exact look required. Navigation is file-based: `src/app/(tabs)/`.

> [!NOTE]
> **Bottom Sheet**: We'll use `@gorhom/bottom-sheet` (compatible with reanimated 4.x via v5 beta) for all create/edit flows. This avoids writing custom animated sheets.

> [!NOTE]
> **State Management**: Zustand with `persist` + `@react-native-async-storage/async-storage` for full offline persistence across all three stores.

---

## Packages to Install

```bash
npx expo install zustand @react-native-async-storage/async-storage expo-audio @gorhom/bottom-sheet@5 react-native-haptic-feedback
```

---

## Folder Structure

```
src/
  app/
    _layout.tsx               ← Root layout (providers, gesture handler)
    (tabs)/
      _layout.tsx             ← Bottom tab navigator
      debt/
        index.tsx             ← People list (Debt tab)
        [personId].tsx        ← Person ledger screen
      events/
        index.tsx             ← Event list (Events tab)
        [eventId].tsx         ← Event detail screen
      voice-notes/
        index.tsx             ← Voice notes list
  components/
    ui/
      FAB.tsx                 ← Floating Action Button
      BottomSheet.tsx         ← Wrapper around @gorhom/bottom-sheet
      EmptyState.tsx          ← Reusable empty state component
      Badge.tsx               ← Color-coded amount badge
      Card.tsx                ← Base card component
    debt/
      PersonCard.tsx          ← Person list row
      TransactionRow.tsx      ← Transaction table row
      PersonForm.tsx          ← Add/edit person form (bottom sheet content)
      TransactionForm.tsx     ← Add/edit transaction form
    events/
      EventCard.tsx           ← Event list card
      ExpenseRow.tsx          ← Expense ledger row
      SummaryCard.tsx         ← Per-person balance summary
      EventForm.tsx           ← Add event form
      ExpenseForm.tsx         ← Add expense form
    voice-notes/
      VoiceNoteCard.tsx       ← Playback card with waveform-style UI
      RecordingSheet.tsx      ← Recording bottom sheet
  store/
    debtStore.ts              ← People + Transactions (Zustand + persist)
    eventStore.ts             ← Events + Expenses (Zustand + persist)
    voiceNoteStore.ts         ← Voice note metadata (Zustand + persist)
  utils/
    formatting.ts             ← Currency, date, duration formatters
    balanceCalc.ts            ← Running balance + event net calc helpers
    colors.ts                 ← Semantic color palette + theme tokens
    id.ts                     ← UUID generator (crypto.randomUUID polyfill)
```

---

## Design System (colors.ts)

| Token | Value | Usage |
|---|---|---|
| `background` | `#0F0F14` | Screen background |
| `surface` | `#1A1A24` | Card surface |
| `surfaceElevated` | `#222232` | Bottom sheet, elevated cards |
| `accent` | `#6C63FF` | Primary accent / FAB |
| `positive` | `#34D399` | You get / positive balance |
| `negative` | `#F87171` | You owe / negative balance |
| `neutral` | `#94A3B8` | Muted text, borders |
| `text` | `#F1F5F9` | Primary text |
| `textSecondary` | `#94A3B8` | Secondary text |

Font: **Inter** (via `expo-font` / Google Fonts)

---

## Proposed Changes

### 1 — Dependencies & Config

#### [MODIFY] [package.json](file:///d:/Projects/App%20Development/Settler/package.json)
Add `zustand`, `@react-native-async-storage/async-storage`, `expo-audio`, `@gorhom/bottom-sheet@5`.

#### [MODIFY] [app.json](file:///d:/Projects/App%20Development/Settler/app.json)
Add `expo-audio` plugin entry for microphone permissions.

---

### 2 — Root Layout & Providers

#### [MODIFY] [_layout.tsx](file:///d:/Projects/App%20Development/Settler/src/app/_layout.tsx)
- Wrap app in `GestureHandlerRootView`
- Load Inter font via `useFonts`
- Set dark background via `expo-system-ui`
- Wrap in `BottomSheetModalProvider` from `@gorhom/bottom-sheet`

---

### 3 — Tab Navigator

#### [NEW] `src/app/(tabs)/_layout.tsx`
Custom bottom tab bar:
- Dark background (#0F0F14)
- Active tab: filled SF Symbol / MaterialCommunityIcon + label in accent color
- Inactive: outlined icon + muted label
- Tabs: Debt, Events, Voice Notes

---

### 4 — Zustand Stores

#### [NEW] `src/store/debtStore.ts`
```ts
interface Person { id, name, avatar? }
interface Transaction { id, personId, amount, type: 'give'|'take', description, date }
// Actions: addPerson, deletePerson, addTransaction, editTransaction, deleteTransaction
// Selectors: getPersonTransactions, getPersonBalance
```
Persisted with AsyncStorage key `settler-debt`.

#### [NEW] `src/store/eventStore.ts`
```ts
interface Event { id, name, date }
interface Expense { id, eventId, personName, amount, reason, date }
// Selectors: getEventExpenses, computeEventSummary → { total, perPerson, netPerPerson }
```
Persisted with AsyncStorage key `settler-events`.

#### [NEW] `src/store/voiceNoteStore.ts`
```ts
interface VoiceNote { id, fileUri, duration, title, date, tag? }
// Actions: addNote, deleteNote, updateNote
```
Persisted with AsyncStorage key `settler-voice-notes`.

---

### 5 — Debt Tab

#### [NEW] `src/app/(tabs)/debt/index.tsx`
- `FlatList` of `PersonCard` components
- Shows name, "You owe" (red), "You get" (green), net balance
- FAB → opens `PersonForm` bottom sheet
- Empty state with illustration text

#### [NEW] `src/app/(tabs)/debt/[personId].tsx`
- Header: name, large net balance, "Settle Up" button
- Filter bar: All / Given / Taken
- Sort: Date / Amount  
- `FlatList` of `TransactionRow` with running balance column
- Tap row → edit bottom sheet
- FAB → `TransactionForm` bottom sheet

---

### 6 — Events Tab

#### [NEW] `src/app/(tabs)/events/index.tsx`
- `FlatList` of `EventCard` (name, date, total, #participants)
- FAB → `EventForm` bottom sheet

#### [NEW] `src/app/(tabs)/events/[eventId].tsx`
- Summary section: `SummaryCard` per person (paid, share, net)
- Expense ledger: `FlatList` of `ExpenseRow`
- FAB → `ExpenseForm` bottom sheet
- Participants auto-derived from expense entries

---

### 7 — Voice Notes Tab

#### [NEW] `src/app/(tabs)/voice-notes/index.tsx`
- `FlatList` of `VoiceNoteCard` (play/pause, duration, title, date, tag chip)
- FAB → `RecordingSheet` bottom sheet (record, stop, title input, save)
- Delete via swipe or long-press menu
- Uses `expo-audio` `useAudioPlayer` / `useAudioRecorder` hooks

---

### 8 — Shared UI Components

#### [NEW] `src/components/ui/FAB.tsx`
Floating action button, accent gradient, shadow, press animation (scale via Reanimated).

#### [NEW] `src/components/ui/BottomSheet.tsx`
Thin wrapper around `BottomSheetModal` pre-configured with dark handle + backdrop.

#### [NEW] `src/components/ui/EmptyState.tsx`
Centered icon (SF Symbol/emoji), title, subtitle. Used on all list screens.

---

## Dummy Data

Each store will be initialized with realistic dummy data (3 people, ~10 transactions each; 2 events with 4+ expenses; 2–3 voice notes with placeholder URIs).

---

## Verification Plan

### Automated
- `npx expo start` — check for red-screen errors
- Navigate all three tabs and sub-screens
- Open/close every bottom sheet

### Manual
- Test FAB animations and haptic feedback
- Verify running balance calculation correctness
- Verify event balance auto-split logic
- Confirm Zustand state persists across app reload (AsyncStorage)
- Voice recording on a physical device (microphone permission flow)
