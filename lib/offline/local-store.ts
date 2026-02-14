import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'

interface NagomiDB extends DBSchema {
  settings: {
    key: string
    value: {
      key: string
      data: Record<string, unknown>
      updatedAt: number
      synced: boolean
    }
  }
  pendingSessions: {
    key: string
    value: {
      id: string
      userId: string
      sessionType: string
      durationMinutes: number
      startedAt: string
      endedAt?: string
      status: string
      xpEarned?: number
      synced: boolean
    }
  }
}

const DB_NAME = 'nagomi-hub'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<NagomiDB>> | null = null

function getDB() {
  if (typeof window === 'undefined') return null

  if (!dbPromise) {
    dbPromise = openDB<NagomiDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' })
        }
        if (!db.objectStoreNames.contains('pendingSessions')) {
          db.createObjectStore('pendingSessions', { keyPath: 'id' })
        }
      },
    })
  }
  return dbPromise
}

// --- Settings ---

export async function saveSettingsLocally(userId: string, data: Record<string, unknown>) {
  const db = await getDB()
  if (!db) return
  await db.put('settings', {
    key: `user_settings_${userId}`,
    data,
    updatedAt: Date.now(),
    synced: false,
  })
}

export async function getLocalSettings(userId: string) {
  const db = await getDB()
  if (!db) return null
  return db.get('settings', `user_settings_${userId}`)
}

export async function markSettingsSynced(userId: string) {
  const db = await getDB()
  if (!db) return
  const entry = await db.get('settings', `user_settings_${userId}`)
  if (entry) {
    entry.synced = true
    await db.put('settings', entry)
  }
}

// --- Pending Sessions (offline) ---

export async function savePendingSession(session: NagomiDB['pendingSessions']['value']) {
  const db = await getDB()
  if (!db) return
  await db.put('pendingSessions', { ...session, synced: false })
}

export async function getUnsyncedSessions() {
  const db = await getDB()
  if (!db) return []
  const all = await db.getAll('pendingSessions')
  return all.filter((s) => !s.synced)
}

export async function markSessionSynced(id: string) {
  const db = await getDB()
  if (!db) return
  const entry = await db.get('pendingSessions', id)
  if (entry) {
    entry.synced = true
    await db.put('pendingSessions', entry)
  }
}

export async function clearSyncedSessions() {
  const db = await getDB()
  if (!db) return
  const all = await db.getAll('pendingSessions')
  const tx = db.transaction('pendingSessions', 'readwrite')
  for (const s of all) {
    if (s.synced) await tx.store.delete(s.id)
  }
  await tx.done
}
