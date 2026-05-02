import type { Transaction } from '../store/debtStore';
import type { Expense } from '../store/eventStore.ts';

// ── Debt / Person Balance ────────────────────────────────────────────────────

export interface TransactionWithBalance extends Transaction {
  runningBalance: number;
}

/**
 * Returns transactions sorted by date ASC with a running balance attached.
 * - 'give' means YOU gave money to the person  → you are owed → positive
 * - 'take' means YOU took / person paid for you → you owe them → negative
 */
export function computeRunningBalance(
  transactions: Transaction[]
): TransactionWithBalance[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let running = 0;
  return sorted.map((tx) => {
    if (tx.type === 'give') {
      running += tx.amount;
    } else {
      running -= tx.amount;
    }
    return { ...tx, runningBalance: running };
  });
}

/**
 * Net balance for a person.
 * Positive = they owe you (green)
 * Negative = you owe them (red)
 */
export function computePersonBalance(transactions: Transaction[]): {
  net: number;
  youGet: number;
  youOwe: number;
} {
  let youGet = 0;
  let youOwe = 0;
  for (const tx of transactions) {
    if (tx.type === 'give') youGet += tx.amount;
    else youOwe += tx.amount;
  }
  return { net: youGet - youOwe, youGet, youOwe };
}

// ── Event Balance ────────────────────────────────────────────────────────────

export interface PersonEventSummary {
  personName: string;
  totalPaid: number;
  equalShare: number;
  net: number; // positive = should receive, negative = owes
}

/**
 * Computes the per-person balance for an event.
 * Equal split: total / number of unique participants.
 */
export function computeEventSummary(expenses: Expense[]): {
  total: number;
  participants: string[];
  perPerson: PersonEventSummary[];
} {
  if (expenses.length === 0) {
    return { total: 0, participants: [], perPerson: [] };
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Derive unique participants from expenses
  const participantSet = new Set(expenses.map((e) => e.personName));
  const participants = Array.from(participantSet);
  const equalShare = total / participants.length;

  const paidMap: Record<string, number> = {};
  for (const p of participants) paidMap[p] = 0;
  for (const e of expenses) paidMap[e.personName] += e.amount;

  const perPerson: PersonEventSummary[] = participants.map((name) => ({
    personName: name,
    totalPaid: paidMap[name],
    equalShare,
    net: paidMap[name] - equalShare,
  }));

  return { total, participants, perPerson };
}
