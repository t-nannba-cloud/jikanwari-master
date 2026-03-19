export interface TimetableCell {
  subject: string
  className: string
  room: string
}

export type DayOfWeek = '月' | '火' | '水' | '木' | '金'

export const DAYS: DayOfWeek[] = ['月', '火', '水', '木', '金']

export const PERIODS = ['1', '2', '3', '4', '5', '6', '放課後'] as const
export type Period = (typeof PERIODS)[number]

export type Timetable = Record<DayOfWeek, Record<Period, TimetableCell>>

export interface TimeSlot {
  label: string
  start: string
  end: string
}

export interface TimePreset {
  id: string
  name: string
  slots: Record<Period, TimeSlot>
}

export interface CalendarDayConfig {
  presetId: string | null
  isHoliday: boolean
  holidayName?: string
}

export type CalendarConfig = Record<string, CalendarDayConfig>

export interface Holiday {
  date: string
  name: string
  isManual: boolean
}

export interface AppData {
  timetable: Timetable
  presets: TimePreset[]
  calendarConfig: CalendarConfig
  holidays: Holiday[]
  activePresetId: string
}
