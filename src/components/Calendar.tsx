import { useState, useEffect } from 'react'
import type { CalendarConfig, TimePreset, Holiday } from '../types'
import { getDaysInMonth, formatDate } from '../utils/holidays'

interface Props {
  calendarConfig: CalendarConfig
  presets: TimePreset[]
  holidays: Holiday[]
  onUpdateConfig: (config: CalendarConfig) => void
  onFetchHolidays: (year: number) => void
}

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

export function Calendar({
  calendarConfig,
  presets,
  holidays,
  onUpdateConfig,
  onFetchHolidays,
}: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth() + 1)

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
    updated[dateStr] = {
      ...updated[dateStr],
      presetId: presetId || null,
    }
    onUpdateConfig(updated)
  }

  const getHoliday = (dateStr: string) => {
    return holidays.find((h) => h.date === dateStr)
  }

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12)
      setYear(year - 1)
    } else {
      setMonth(month - 1)
    }
  }

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1)
      setYear(year + 1)
    } else {
      setMonth(month + 1)
    }
  }

  const getPresetColor = (presetId: string | null): string => {
    if (!presetId) return ''
    const idx = presets.findIndex((p) => p.id === presetId)
    const colors = ['preset-color-1', 'preset-color-2', 'preset-color-3', 'preset-color-4']
    return colors[idx % colors.length]
  }

  return (
    <div className="calendar">
      <h2>月間カレンダー</h2>

      <div className="calendar-nav">
        <button className="btn" onClick={prevMonth}>
          &lt;
        </button>
        <span className="calendar-title">
          {year}年{month}月
        </span>
        <button className="btn" onClick={nextMonth}>
          &gt;
        </button>
      </div>

      <div className="calendar-legend">
        {presets.map((p, i) => {
          const colors = ['preset-color-1', 'preset-color-2', 'preset-color-3', 'preset-color-4']
          return (
            <span key={p.id} className={`legend-item ${colors[i % colors.length]}`}>
              {p.name}
            </span>
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
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
          const isHoliday = !!holiday
          const todayStr = formatDate(today)

          return (
            <div
              key={dateStr}
              className={`calendar-day ${isWeekend ? 'weekend' : ''} ${isHoliday ? 'holiday' : ''} ${dateStr === todayStr ? 'today' : ''} ${getPresetColor(config?.presetId ?? null)}`}
            >
              <div className={`day-number ${dayOfWeek === 0 ? 'sunday' : ''} ${dayOfWeek === 6 ? 'saturday' : ''}`}>
                {date.getDate()}
              </div>
              {holiday && <div className="holiday-name">{holiday.name}</div>}
              {!isWeekend && !isHoliday && (
                <select
                  className="day-preset-select"
                  value={config?.presetId || ''}
                  onChange={(e) => handlePresetChange(dateStr, e.target.value)}
                >
                  <option value="">−</option>
                  {presets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
