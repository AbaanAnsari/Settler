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
 
}
