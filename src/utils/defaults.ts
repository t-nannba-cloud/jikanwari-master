import type { AppData, Timetable, TimetableCell, TimePreset, Period } from '../types'
import { DAYS, PERIODS } from '../types'

function emptyCell(): TimetableCell {
  return { subject: '', className: '', room: '' }
}

function createEmptyTimetable(): Timetable {
  const timetable = {} as Timetable
  for (const day of DAYS) {
    timetable[day] = {} as Record<Period, TimetableCell>
    for (const period of PERIODS) {
      timetable[day][period] = emptyCell()
    }
  }
  return timetable
}

function createDefaultPresets(): TimePreset[] {
  return [
    {
      id: 'normal',
      name: '通常日課',
      slots: {
        '1': { label: '1時限', start: '08:45', end: '09:35' },
        '2': { label: '2時限', start: '09:45', end: '10:35' },
        '3': { label: '3時限', start: '10:45', end: '11:35' },
        '4': { label: '4時限', start: '11:45', end: '12:35' },
        '5': { label: '5時限', start: '13:25', end: '14:15' },
        '6': { label: '6時限', start: '14:25', end: '15:15' },
        '放課後': { label: '放課後', start: '15:25', end: '16:15' },
      },
    },
    {
      id: 'short',
      name: '短縮日課',
      slots: {
        '1': { label: '1時限', start: '08:45', end: '09:25' },
        '2': { label: '2時限', start: '09:35', end: '10:15' },
        '3': { label: '3時限', start: '10:25', end: '11:05' },
        '4': { label: '4時限', start: '11:15', end: '11:55' },
        '5': { label: '5時限', start: '12:45', end: '13:25' },
        '6': { label: '6時限', start: '13:35', end: '14:15' },
        '放課後': { label: '放課後', start: '14:25', end: '15:15' },
      },
    },
    {
      id: 'exam',
      name: 'テスト日課',
      slots: {
        '1': { label: '1時限', start: '08:45', end: '09:35' },
        '2': { label: '2時限', start: '09:55', end: '10:45' },
        '3': { label: '3時限', start: '11:05', end: '11:55' },
        '4': { label: '4時限', start: '12:00', end: '12:00' },
        '5': { label: '5時限', start: '12:00', end: '12:00' },
        '6': { label: '6時限', start: '12:00', end: '12:00' },
        '放課後': { label: '放課後', start: '12:05', end: '12:55' },
      },
    },
  ]
}

export function createDefaultData(): AppData {
  return {
    timetable: createEmptyTimetable(),
    presets: createDefaultPresets(),
    calendarConfig: {},
    holidays: [],
    activePresetId: 'normal',
  }
}

export function createEmptyCell(): TimetableCell {
  return emptyCell()
}

export function getNewDayTimetable(): Record<Period, TimetableCell> {
  const day = {} as Record<Period, TimetableCell>
  for (const period of PERIODS) {
    day[period] = emptyCell()
  }
  return day
}
