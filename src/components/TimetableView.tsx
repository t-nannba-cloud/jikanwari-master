import { useState } from 'react'
import type { Timetable, TimetableCell, DayOfWeek, Period, TimePreset } from '../types'
import { DAYS, PERIODS } from '../types'
import { CellEditor } from './CellEditor'

interface Props {
  timetable: Timetable
  activePreset: TimePreset | undefined
  onUpdate: (timetable: Timetable) => void
}

export function TimetableView({ timetable, activePreset, onUpdate }: Props) {
  const [editing, setEditing] = useState<{ day: DayOfWeek; period: Period } | null>(null)

  const handleCellClick = (day: DayOfWeek, period: Period) => {
    setEditing({ day, period })
  }

  const handleSave = (cell: TimetableCell) => {
    if (!editing) return
    const updated = { ...timetable }
    updated[editing.day] = { ...updated[editing.day] }
    updated[editing.day][editing.period] = cell
    onUpdate(updated)
    setEditing(null)
  }

  return (
    <div className="timetable-container">
      <div className="timetable-scroll">
        <table className="timetable">
          <thead>
            <tr>
              <th className="period-header">時限</th>
              {DAYS.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(activePreset?.visiblePeriods ?? PERIODS).map((period) => {
              const slot = activePreset?.slots[period]
              return (
                <tr key={period}>
                  <td className="period-cell">
                    <div className="period-label">
                      {period === '放課後' ? '放課後' : `${period}時限`}
                    </div>
                    {slot && (
                      <div className="period-time">
                        {slot.start}〜{slot.end}
                      </div>
                    )}
                  </td>
                  {DAYS.map((day) => {
                    const cell = timetable[day]?.[period]
                    const isEmpty = !cell?.subject && !cell?.className && !cell?.room
                    return (
                      <td
                        key={day}
                        className={`timetable-cell ${isEmpty ? 'empty' : ''}`}
                        onClick={() => handleCellClick(day, period)}
                      >
                        {cell?.subject && <div className="cell-subject">{cell.subject}</div>}
                        {cell?.className && <div className="cell-class">{cell.className}</div>}
                        {cell?.room && <div className="cell-room">{cell.room}</div>}
                        {isEmpty && <div className="cell-empty">+</div>}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <CellEditor
          cell={timetable[editing.day]?.[editing.period] || { subject: '', className: '', room: '' }}
          day={editing.day}
          period={editing.period}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
