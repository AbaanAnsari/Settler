import type { DebtState } from './debtStore';
import type { EventState } from './eventStore';
import { computePersonBalance, computeEventSummary } from '../utils/balanceCalc';

// -- Debt Selectors --

export const selectPersonTransactions = (personId: string) => (state: DebtState) =>
  state.transactions.filter((t) => t.personId === personId);

export const selectPersonBalance = (personId: string) => (state: DebtState) => {
  const transactions = state.transactions.filter((t) => t.personId === personId);
  return computePersonBalance(transactions);
};

// -- Event Selectors --

export const selectEventExpenses = (eventId: string) => (state: EventState) =>
  state.expenses.filter((ex) => ex.eventId === eventId);

export const selectEventSummary = (eventId: string) => (state: EventState) => {
  const expenses = state.expenses.filter((ex) => ex.eventId === eventId);
  return computeEventSummary(expenses);
};
