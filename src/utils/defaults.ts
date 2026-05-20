import type { AppData, Timetable, TimetableCell, TimePreset, Period, SubjectPreset } from '../types'
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
      visiblePeriods: ['1', '2', '3', '4', '5', '6', '放課後'],
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
      id: '35min',
      name: '35分授業',
      visiblePeriods: ['1', '2', '3', '4', '5', '6', '放課後'],
      slots: {
        '1': { label: '1時限', start: '08:45', end: '09:20' },
        '2': { label: '2時限', start: '09:30', end: '10:05' },
        '3': { label: '3時限', start: '10:15', end: '10:50' },
        '4': { label: '4時限', start: '11:00', end: '11:35' },
        '5': { label: '5時限', start: '12:25', end: '13:00' },
        '6': { label: '6時限', start: '13:10', end: '13:45' },
        '放課後': { label: '放課後', start: '13:55', end: '14:45' },
      },
    },
    {
      id: '30min',
      name: '30分授業',
      visiblePeriods: ['1', '2', '3', '4', '5', '6', '放課後'],
      slots: {
        '1': { label: '1時限', start: '08:45', end: '09:15' },
        '2': { label: '2時限', start: '09:25', end: '09:55' },
        '3': { label: '3時限', start: '10:05', end: '10:35' },
        '4': { label: '4時限', start: '10:45', end: '11:15' },
        '5': { label: '5時限', start: '12:05', end: '12:35' },
        '6': { label: '6時限', start: '12:45', end: '13:15' },
        '放課後': { label: '放課後', start: '13:25', end: '14:15' },
      },
    },
    {
      id: 'exam',
      name: 'テスト日課',
      visiblePeriods: ['1', '2', '3', '放課後'],
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

function createDefaultSubjects(): SubjectPreset[] {
  return [
    { id: 's1', name: '国語', color: '#fee2e2' },
    { id: 's2', name: '数学', color: '#dbeafe' },
    { id: 's3', name: '英語', color: '#dcfce7' },
    { id: 's4', name: '理科', color: '#fef3c7' },
    { id: 's5', name: '社会', color: '#fce7f3' },
    { id: 's6', name: '音楽', color: '#e0e7ff' },
    { id: 's7', name: '美術', color: '#fae8ff' },
    { id: 's8', name: '保体', color: '#ccfbf1' },
    { id: 's9', name: '技術', color: '#fed7aa' },
    { id: 's10', name: '家庭', color: '#fbcfe8' },
    { id: 's11', name: '道徳', color: '#e2e8f0' },
    { id: 's12', name: '学活', color: '#f1f5f9' },
    { id: 's13', name: '総合', color: '#d9f99d' },
  ]
}

export function createDefaultData(): AppData {
  return {
    timetable: createEmptyTimetable(),
    presets: createDefaultPresets(),
    calendarConfig: {},
    holidays: [],
    activePresetId: 'normal',
    subjectPresets: createDefaultSubjects(),
    dailyTimetables: {},
  }
}

export function createEmptyCell(): TimetableCell {
  return emptyCell()
}
