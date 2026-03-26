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
      name: '通常日程',
      slots: {
        '1': { label: '1時限', start: '17:30', end: '18:10' },
        '2': { label: '2時限', start: '18:40', end: '19:20' },
        '3': { label: '3時限', start: '19:25', end: '20:05' },
        '4': { label: '4時限', start: '20:10', end: '20:50' },
        '5': { label: '5時限', start: '20:55', end: '21:35' },
        '6': { label: '6時限', start: '21:40', end: '22:20' },
        '放課後': { label: '放課後', start: '22:25', end: '23:15' },
      },
    },
    {
      id: '35min',
      name: '35分日程',
      slots: {
        '1': { label: '1時限', start: '17:30', end: '18:05' },
        '2': { label: '2時限', start: '18:35', end: '19:10' },
        '3': { label: '3時限', start: '19:15', end: '19:50' },
        '4': { label: '4時限', start: '19:55', end: '20:30' },
        '5': { label: '5時限', start: '20:30', end: '20:30' },
        '6': { label: '6時限', start: '20:30', end: '20:30' },
        '放課後': { label: '放課後', start: '20:30', end: '20:50' },
      },
    },
    {
      id: '30min',
      name: '30分授業',
      slots: {
        '1': { label: '1時限', start: '17:30', end: '18:00' },
        '2': { label: '2時限', start: '18:30', end: '19:00' },
        '3': { label: '3時限', start: '19:05', end: '19:35' },
        '4': { label: '4時限', start: '19:40', end: '20:10' },
        '5': { label: '5時限', start: '20:10', end: '20:10' },
        '6': { label: '6時限', start: '20:10', end: '20:10' },
        '放課後': { label: '放課後', start: '20:10', end: '20:50' },
      },
    },
    {
      id: 'exam',
      name: 'テスト日程',
      slots: {
        '1': { label: '1時限', start: '17:30', end: '18:20' },
        '2': { label: '2時限', start: '18:40', end: '19:30' },
        '3': { label: '3時限', start: '19:50', end: '20:40' },
        '4': { label: '4時限', start: '20:40', end: '20:40' },
        '5': { label: '5時限', start: '20:40', end: '20:40' },
        '6': { label: '6時限', start: '20:40', end: '20:40' },
        '放課後': { label: '放課後', start: '20:45', end: '21:30' },
      },
    },
    {
      id: 'ceremony',
      name: '始業式・終業式・修了式',
      slots: {
        '1': { label: '式', start: '17:30', end: '18:00' },
        '2': { label: '2時限', start: '18:00', end: '18:00' },
        '3': { label: '3時限', start: '18:00', end: '18:00' },
        '4': { label: '4時限', start: '18:00', end: '18:00' },
        '5': { label: '5時限', start: '18:00', end: '18:00' },
        '6': { label: '6時限', start: '18:00', end: '18:00' },
        '放課後': { label: '解散', start: '19:00', end: '19:00' },
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
