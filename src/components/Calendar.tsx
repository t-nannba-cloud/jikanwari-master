import { useState, useEffect } from 'react'
import type { CalendarConfig, TimePreset, Holiday, Timetable, DailyTimetables, DailyTimetable, SubjectPreset } from '../types'
import { getDaysInMonth, formatDate } from '../utils/holidays'
import { DailyTimetableEditor } from './DailyTimetableEditor'

interface Props {
  calendarConfig: CalendarConfig
  presets: TimePreset[]
  holidays: Holiday[]
  baseTimetable: Timetable
  dailyTimetables: DailyTimetables
  subjectPresets: SubjectPreset[]
  onUpdateConfig: (config: CalendarConfig) => void
  onUpdateDailyTimetables: (dt: DailyTimetables) => void
  onFetchHolidays: (year: number) => void
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

export function Calendar({
  calendarConfig,
  presets,
  holidays,
  baseTimetable,
  dailyTimetables,
  subjectPresets,
  onUpdateConfig,
  onUpdateDailyTimetables,
  onFetchHolidays,
}: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [editingDow, setEditingDow] = useState<number>(0)
  const [memoDate, setMemoDate] = useState<string | null>(null)
  const [memoText, setMemoText] = useState('')

  useEffect(() => {
    onFetchHolidays(year)
  }, [year, onFetchHolidays])

  const days = getDaysInMonth(year, month)
  const firstDayOfWeek = days[0].getDay()

  const handlePresetChange = (dateStr: string, presetId: string) => {
    const updated = { ...calendarConfig }
    if (!updated[dateStr]) {
      updated[dateStr] = { presetId: null, isHoliday: false }
    }
    updated[dateStr] = { ...updated[dateStr], presetId: presetId || null }
    onUpdateConfig(updated)
  }

  const getHoliday = (dateStr: string) => {
    return holidays.find((h) => h.date === dateStr)
  }

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1) }
    else setMonth(month - 1)
  }

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1) }
    else setMonth(month + 1)
  }

  const getPresetColor = (presetId: string | null): string => {
    if (!presetId) return ''
    const idx = presets.findIndex((p) => p.id === presetId)
    const colors = ['preset-color-1', 'preset-color-2', 'preset-color-3', 'preset-color-4', 'preset-color-5']
    return colors[idx % colors.length]
  }

  const handleDayClick = (dateStr: string, dow: number) => {
    setEditingDate(dateStr)
    setEditingDow(dow)
  }

  const handleDailySave = (daily: DailyTimetable) => {
    if (!editingDate) return
    onUpdateDailyTimetables({ ...dailyTimetables, [editingDate]: daily })
    setEditingDate(null)
  }

  const handleMemoOpen = (dateStr: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setMemoDate(dateStr)
    setMemoText(calendarConfig[dateStr]?.memo || '')
  }

  const handleMemoSave = () => {
    if (!memoDate) return
    const updated = { ...calendarConfig }
    if (!updated[memoDate]) {
      updated[memoDate] = { presetId: null, isHoliday: false }
    }
    updated[memoDate] = { ...updated[memoDate], memo: memoText }
    onUpdateConfig(updated)
    setMemoDate(null)
  }

  const getPresetForDate = (dateStr: string): TimePreset | undefined => {
    const config = calendarConfig[dateStr]
    if (config?.presetId) return presets.find((p) => p.id === config.presetId)
    return presets[0]
  }

  return (
    <div className="calendar">
      <h2>月間カレンダー</h2>

      <div className="calendar-nav">
        <button className="btn" onClick={prevMonth}>&lt;</button>
        <span className="calendar-title">{year}年{month}月</span>
        <button className="btn" onClick={nextMonth}>&gt;</button>
      </div>

      <div className="calendar-legend">
        {presets.map((p, i) => {
          const colors = ['preset-color-1', 'preset-color-2', 'preset-color-3', 'preset-color-4', 'preset-color-5']
          return (
            <span key={p.id} className={`legend-item ${colors[i % colors.length]}`}>{p.name}</span>
          )
        })}
      </div>

      <div className="calendar-grid">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className={`calendar-header ${label === '日' ? 'sunday' : ''} ${label === '土' ? 'saturday' : ''}`}>
            {label}
          </div>
        ))}

        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}

        {days.map((date) => {
          const dateStr = formatDate(date)
          const dayOfWeek = date.getDay()
          const config = calendarConfig[dateStr]
          const holiday = getHoliday(dateStr)
          const isSunday = dayOfWeek === 0
          const isHoliday = !!holiday
          const todayStr = formatDate(today)
          const hasDailyEdit = !!dailyTimetables[dateStr]
          const hasMemo = !!config?.memo

          return (
            <div
              key={dateStr}
              className={`calendar-day ${isSunday ? 'weekend' : ''} ${isHoliday ? 'holiday' : ''} ${dateStr === todayStr ? 'today' : ''} ${getPresetColor(config?.presetId ?? null)}`}
              onClick={() => !isSunday && handleDayClick(dateStr, dayOfWeek)}
            >
              <div className={`day-number ${dayOfWeek === 0 ? 'sunday' : ''} ${dayOfWeek === 6 ? 'saturday' : ''}`}>
                {date.getDate()}
                {hasDailyEdit && <span className="daily-edit-badge">*</span>}
              </div>
              {holiday && <div className="holiday-name">{holiday.name}</div>}
              {!isSunday && !isHoliday && (
                <select
                  className="day-preset-select"
                  value={config?.presetId || ''}
                  onChange={(e) => { e.stopPropagation(); handlePresetChange(dateStr, e.target.value) }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">−</option>
                  {presets.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              )}
              {hasMemo && <div className="day-memo">{config!.memo}</div>}
              {!isSunday && (
                <button
                  className="btn-memo"
                  onClick={(e) => handleMemoOpen(dateStr, e)}
                  title="予定メモ"
                >
                  {hasMemo ? '✎' : '+'}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {editingDate && (
        <DailyTimetableEditor
          date={editingDate}
          dayOfWeek={editingDow}
          daily={dailyTimetables[editingDate]}
          baseTimetable={baseTimetable}
          preset={getPresetForDate(editingDate)}
          subjectPresets={subjectPresets}
          onSave={handleDailySave}
          onClose={() => setEditingDate(null)}
        />
      )}

      {memoDate && (
        <div className="modal-overlay" onClick={() => setMemoDate(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{memoDate} の予定</h3>
            <textarea
              className="memo-textarea"
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="例：保護者会、部活動停止..."
              rows={4}
            />
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={handleMemoSave}>保存</button>
              <button className="btn" onClick={() => setMemoDate(null)}>キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
