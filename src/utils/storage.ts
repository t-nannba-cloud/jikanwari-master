import type { AppData } from '../types'
import { createDefaultData } from './defaults'

const STORAGE_KEY = 'jikanwari-data'

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const defaults = createDefaultData()
      return {
        ...defaults,
        ...parsed,
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
