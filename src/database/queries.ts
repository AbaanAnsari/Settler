import { getDb } from './db';
import type { Person, Transaction } from '../store/debtStore';
import type { Event, Expense } from '../store/eventStore';

// --- DEBT ---

export async function getPeopleFromDb(): Promise<Person[]> {
  const db = await getDb();
  return await db.getAllAsync<Person>('SELECT * FROM people');
}

export async function insertPersonDb(person: Person): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO people (id, name, avatar, color) VALUES (?, ?, ?, ?)',
    person.id, person.name, person.avatar || null, person.color
  );
}

export async function updatePersonDb(id: string, updates: Partial<Person>): Promise<void> {
  const db = await getDb();
  const keys = Object.keys(updates);
  if (keys.length === 0) return;
  const setString = keys.map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  await db.runAsync(`UPDATE people SET ${setString} WHERE id = ?`, ...values, id);
}

export async function deletePersonDb(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM people WHERE id = ?', id);
}

export async function getTransactionsFromDb(): Promise<Transaction[]> {
  const db = await getDb();
  return await db.getAllAsync<Transaction>('SELECT * FROM transactions');
}

export async function insertTransactionDb(tx: Transaction): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO transactions (id, personId, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?)',
    tx.id, tx.personId, tx.amount, tx.type, tx.description, tx.date
  );
}

export async function updateTransactionDb(id: string, updates: Partial<Transaction>): Promise<void> {
  const db = await getDb();
  const keys = Object.keys(updates);
  if (keys.length === 0) return;
  const setString = keys.map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  await db.runAsync(`UPDATE transactions SET ${setString} WHERE id = ?`, ...values, id);
}

export async function deleteTransactionDb(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM transactions WHERE id = ?', id);
}

// --- EVENTS ---

export async function getEventsFromDb(): Promise<Event[]> {
  const db = await getDb();
  return await db.getAllAsync<Event>('SELECT * FROM events');
}

export async function insertEventDb(event: Event): Promise<void> {
  const db = await getDb();
  await db.runAsync('INSERT INTO events (id, name, date) VALUES (?, ?, ?)', event.id, event.name, event.date);
}

export async function updateEventDb(id: string, updates: Partial<Event>): Promise<void> {
  const db = await getDb();
  const keys = Object.keys(updates);
  if (keys.length === 0) return;
  const setString = keys.map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  await db.runAsync(`UPDATE events SET ${setString} WHERE id = ?`, ...values, id);
}

export async function deleteEventDb(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM events WHERE id = ?', id);
}

export async function getExpensesFromDb(): Promise<Expense[]> {
  const db = await getDb();
  return await db.getAllAsync<Expense>('SELECT * FROM expenses');
}

export async function insertExpenseDb(expense: Expense): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO expenses (id, eventId, personName, amount, reason, date) VALUES (?, ?, ?, ?, ?, ?)',
    expense.id, expense.eventId, expense.personName, expense.amount, expense.reason, expense.date
  );
}

export async function updateExpenseDb(id: string, updates: Partial<Expense>): Promise<void> {
  const db = await getDb();
  const keys = Object.keys(updates);
  if (keys.length === 0) return;
  const setString = keys.map(k => `${k} = ?`).join(', ');
  const values = Object.values(updates);
  await db.runAsync(`UPDATE expenses SET ${setString} WHERE id = ?`, ...values, id);
}

export async function deleteExpenseDb(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM expenses WHERE id = ?', id);
}
