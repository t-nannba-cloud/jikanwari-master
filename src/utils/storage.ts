import type { AppData } from '../types'
import { createDefaultData } from './defaults'

const STORAGE_KEY = 'jikanwari-data-v3'

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const defaults = createDefaultData()
      const timetable = parsed.timetable ?? defaults.timetable
      // Migrate: add '土' column if missing from saved data
      if (timetable && !timetable['土']) {
        timetable['土'] = defaults.timetable['土']
      }
      return {
        ...defaults,
        ...parsed,
        timetable,
        presets: parsed.presets?.length ? parsed.presets : defaults.presets,
      }
    }
  } catch {
    // ignore parse errors
  }
  return createDefaultData()
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}
