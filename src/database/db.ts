import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('settler.db');
  await initDb(db);
  return db;
}

async function initDb(database: SQLite.SQLiteDatabase) {
  // Use execAsync for PRAGMA and table creation
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS people (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      color TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY NOT NULL,
      personId TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (personId) REFERENCES people (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_transactions_personId ON transactions(personId);

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      date TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expenses (
      id TEXT PRIMARY KEY NOT NULL,
      eventId TEXT NOT NULL,
      personName TEXT NOT NULL,
      amount REAL NOT NULL,
      reason TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (eventId) REFERENCES events (id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_expenses_eventId ON expenses(eventId);

    CREATE TABLE IF NOT EXISTS voice_notes (
      id TEXT PRIMARY KEY NOT NULL,
      fileUri TEXT NOT NULL,
      duration REAL NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      tag TEXT
    );
  `);

  const result = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM people');
  if (result && result.count === 0) {
    await seedDb(database);
  }
}

async function seedDb(db: SQLite.SQLiteDatabase) {
  // People
  await db.runAsync("INSERT INTO people (id, name, color) VALUES ('p1', 'Arjun Sharma', '#7C6FF7')");
  await db.runAsync("INSERT INTO people (id, name, color) VALUES ('p2', 'Priya Kapoor', '#F87171')");
  await db.runAsync("INSERT INTO people (id, name, color) VALUES ('p3', 'Rahul Verma', '#34D399')");

  // Transactions
  await db.runAsync("INSERT INTO transactions (id, personId, amount, type, description, date) VALUES ('t1', 'p1', 1200, 'give', 'Dinner at Punjab Grill', '2026-04-10T19:30:00.000Z')");
  await db.runAsync("INSERT INTO transactions (id, personId, amount, type, description, date) VALUES ('t2', 'p1', 500, 'take', 'Movie tickets', '2026-04-15T14:00:00.000Z')");
  
  // Events
  await db.runAsync("INSERT INTO events (id, name, date) VALUES ('e1', 'Goa Trip 2026', '2026-04-25T00:00:00.000Z')");

  // Expenses
  await db.runAsync("INSERT INTO expenses (id, eventId, personName, amount, reason, date) VALUES ('ex1', 'e1', 'Arjun', 8500, 'Flight tickets', '2026-04-24T08:00:00.000Z')");
  await db.runAsync("INSERT INTO expenses (id, eventId, personName, amount, reason, date) VALUES ('ex2', 'e1', 'Priya', 4200, 'Hotel', '2026-04-25T14:00:00.000Z')");
}
