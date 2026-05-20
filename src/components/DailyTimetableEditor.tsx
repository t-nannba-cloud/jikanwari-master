import { useState } from 'react'
import type { DailyTimetable, TimetableCell, Period, TimePreset, Timetable, SubjectPreset, DayOfWeek } from '../types'
import { PERIODS, DAYS } from '../types'
import { CellEditor } from './CellEditor'

interface Props {
  date: string
  dayOfWeek: number
  daily: DailyTimetable | undefined
  baseTimetable: Timetable
  preset: TimePreset | undefined
  subjectPresets: SubjectPreset[]
  onSave: (daily: DailyTimetable) => void
  onClose: () => void
}

const DAY_LABELS = ['日', '月', '火', '水', '木', '金', '土']

export function DailyTimetableEditor({ date, dayOfWeek, daily, baseTimetable, preset, subjectPresets, onSave, onClose }: Props) {
  const dayLabel = DAY_LABELS[dayOfWeek] as DayOfWeek
  const baseDay = DAYS.includes(dayLabel) ? dayLabel : '月'

  const getInitialCells = (): Record<Period, TimetableCell> => {
    if (daily?.cells) return { ...daily.cells }
    const base = baseTimetable[baseDay]
    if (base) {
      const cells = {} as Record<Period, TimetableCell>
      for (const p of PERIODS) {
        cells[p] = { ...base[p] }
      }
      return cells
    }
    const cells = {} as Record<Period, TimetableCell>
    for (const p of PERIODS) {
      cells[p] = { subject: '', className: '', room: '' }
    }
    return cells
  }

  const [cells, setCells] = useState<Record<Period, TimetableCell>>(getInitialCells)
  const [editing, setEditing] = useState<Period | null>(null)

  const visiblePeriods = preset?.visiblePeriods ?? PERIODS

  const handleCellSave = (cell: TimetableCell) => {
    if (!editing) return
    setCells((prev) => ({ ...prev, [editing]: cell }))
    setEditing(null)
  }

  const handleSaveAll = () => {
    onSave({ cells, presetId: preset?.id })
  }

  const handleReset = () => {
    const base = baseTimetable[baseDay]
    if (base) {
      const newCells = {} as Record<Period, TimetableCell>
      for (const p of PERIODS) {
        newCells[p] = { ...base[p] }
      }
      setCells(newCells)
    }
  }

  const getSubjectColor = (subjectName: string): string | undefined => {
    return subjectPresets.find((s) => s.name === subjectName)?.color
  }

  const dateParts = date.split('-')
  const displayDate = `${dateParts[1]}/${dateParts[2]}（${DAY_LABELS[dayOfWeek]}）`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h3>{displayDate} の時間割</h3>

        <table className="daily-table">
          <thead>
            <tr>
              <th>時限</th>
              <th>時間</th>
              <th>教科</th>
              <th>クラス</th>
              <th>教室</th>
            </tr>
          </thead>
          <tbody>
            {(visiblePeriods as readonly Period[]).map((period) => {
              const cell = cells[period]
              const slot = preset?.slots[period]
              const bgColor = cell?.subject ? getSubjectColor(cell.subject) : undefined
              return (
                <tr
                  key={period}
                  className="daily-row"
                  style={bgColor ? { background: bgColor } : undefined}
                  onClick={() => setEditing(period)}
                >
                  <td className="daily-period">{period === '放課後' ? '放課後' : `${period}限`}</td>
                  <td className="daily-time">{slot ? `${slot.start}〜${slot.end}` : ''}</td>
                  <td className="daily-subject">{cell?.subject || '−'}</td>
                  <td className="daily-class">{cell?.className || '−'}</td>
                  <td className="daily-room">{cell?.room || '−'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="modal-actions">
          <button className="btn btn-primary" onClick={handleSaveAll}>保存</button>
          <button className="btn" onClick={handleReset}>週時間割に戻す</button>
          <button className="btn" onClick={onClose}>閉じる</button>
        </div>
      </div>

      {editing && (
        <CellEditor
          cell={cells[editing] || { subject: '', className: '', room: '' }}
          day={DAY_LABELS[dayOfWeek]}
          period={editing}
          subjectPresets={subjectPresets}
          onSave={handleCellSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  )
}
