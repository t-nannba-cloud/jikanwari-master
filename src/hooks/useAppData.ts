import { useState, useCallback, useEffect } from 'react'
import type { AppData, Timetable, TimePreset, CalendarConfig, Holiday } from '../types'
import { loadData, saveData } from '../utils/storage'
import { fetchJapaneseHolidays } from '../utils/holidays'

export function useAppData() {
  const [data, setData] = useState<AppData>(loadData)

  useEffect(() => {
    saveData(data)
  }, [data])

  const updateTimetable = useCallback((timetable: Timetable) => {
    setData((prev) => ({ ...prev, timetable }))
  }, [])

  const updatePresets = useCallback((presets: TimePreset[]) => {
    setData((prev) => ({ ...prev, presets }))
  }, [])

  const setActivePreset = useCallback((activePresetId: string) => {
    setData((prev) => ({ ...prev, activePresetId }))
  }, [])

  const updateCalendarConfig = useCallback((calendarConfig: CalendarConfig) => {
    setData((prev) => ({ ...prev, calendarConfig }))
  }, [])

  const updateHolidays = useCallback((holidays: Holiday[]) => {
    setData((prev) => ({ ...prev, holidays }))
  }, [])

  const fetchHolidays = useCallback(async (year: number) => {
    const fetched = await fetchJapaneseHolidays(year)
    setData((prev) => {
      const manualHolidays = prev.holidays.filter((h) => h.isManual)
      const merged = [...manualHolidays]
      for (const h of fetched) {
        if (!merged.some((m) => m.date === h.date)) {
          merged.push(h)
        }
      }
      merged.sort((a, b) => a.date.localeCompare(b.date))
      return { ...prev, holidays: merged }
    })
  }, [])

  return {
    data,
    updateTimetable,
    updatePresets,
    setActivePreset,
    updateCalendarConfig,
    updateHolidays,
    fetchHolidays,
  }
}
