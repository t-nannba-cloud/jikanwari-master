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
      visiblePeriods: ['1', '2', '3', '4'],
      slots: {
        // 学活17:30-17:35、休憩17:35-17:40
        '1': { label: '1時限', start: '17:40', end: '18:20' },
        // 給食18:20-18:50
        '2': { label: '2時限', start: '18:50', end: '19:30' },
        '3': { label: '3時限', start: '19:35', end: '20:15' },
        '4': { label: '4時限', start: '20:20', end: '21:00' },
        '5': { label: '5時限', start: '21:05', end: '21:45' },
        '6': { label: '6時限', start: '21:50', end: '22:30' },
        '放課後': { label: '放課後', start: '22:35', end: '23:25' },
      },
    },
    {
      id: '35min',
      name: '35分日程',
      visiblePeriods: ['1', '2', '3', '4', '5'],
      slots: {
        // 学活17:30-17:35、休憩17:35-17:40
        '1': { label: '1時限', start: '17:40', end: '18:15' },
        // 給食18:15-18:45
        '2': { label: '2時限', start: '18:45', end: '19:20' },
        '3': { label: '3時限', start: '19:25', end: '20:00' },
        '4': { label: '4時限', start: '20:05', end: '20:40' },
        '5': { label: '5時限', start: '20:40', end: '21:00' },
        '6': { label: '6時限', start: '20:40', end: '20:40' },
        '放課後': { label: '放課後', start: '20:40', end: '20:40' },
      },
    },
    {
      id: '30min',
      name: '30分授業',
      visiblePeriods: ['1', '2', '3', '4', '5'],
      slots: {
        // 学活17:30-17:35、休憩17:35-17:40
        '1': { label: '1時限', start: '17:40', end: '18:10' },
        // 給食18:10-18:40
        '2': { label: '2時限', start: '18:40', end: '19:10' },
        '3': { label: '3時限', start: '19:15', end: '19:45' },
        '4': { label: '4時限', start: '19:50', end: '20:20' },
        '5': { label: '5時限', start: '20:20', end: '21:00' },
        '6': { label: '6時限', start: '20:20', end: '20:20' },
        '放課後': { label: '放課後', start: '20:20', end: '20:20' },
      },
    },
    {
      id: 'exam',
      name: 'テスト日程',
      visiblePeriods: ['1', '2', '3', '4'],
      slots: {
        // 学活17:30-17:35、休憩17:35-17:40
        '1': { label: '1時限', start: '17:40', end: '18:10' },
        // 給食18:10-18:40
        '2': { label: '2時限', start: '18:40', end: '19:20' },
        '3': { label: '3時限', start: '19:30', end: '20:10' },
        '4': { label: '4時限', start: '20:20', end: '21:00' },
        '5': { label: '5時限', start: '21:00', end: '21:00' },
        '6': { label: '6時限', start: '21:00', end: '21:00' },
        '放課後': { label: '放課後', start: '21:00', end: '21:00' },
      },
    },
    {
      id: 'ceremony',
      name: '始業式・終業式・修了式',
      visiblePeriods: ['1', '放課後'],
      slots: {
        // 学活17:30-17:35、休憩17:35-17:40
        '1': { label: '式', start: '17:40', end: '18:10' },
        '2': { label: '2時限', start: '18:10', end: '18:10' },
        '3': { label: '3時限', start: '18:10', end: '18:10' },
        '4': { label: '4時限', start: '18:10', end: '18:10' },
        '5': { label: '5時限', start: '18:10', end: '18:10' },
        '6': { label: '6時限', start: '18:10', end: '18:10' },
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
