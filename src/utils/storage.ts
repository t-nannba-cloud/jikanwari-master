import type { AppData } from '../types'
import { createDefaultData } from './defaults'

const STORAGE_KEY = 'jikanwari-data-v4'

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const defaults = createDefaultData()
      const timetable = parsed.timetable ?? defaults.timetable
      if (timetable && !timetable['土']) {
        timetable['土'] = defaults.timetable['土']
      }
      return {
        ...defaults,
        ...parsed,
        timetable,
        presets: parsed.presets?.length ? parsed.presets : defaults.presets,
        subjectPresets: parsed.subjectPresets?.length ? parsed.subjectPresets : defaults.subjectPresets,
        dailyTimetables: parsed.dailyTimetables ?? {},
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
