import { useState } from 'react'
import type { TimetableCell, DayOfWeek, Period } from '../types'

interface Props {
  cell: TimetableCell
  day: DayOfWeek
  period: Period
  onSave: (cell: TimetableCell) => void
  onCancel: () => void
}

export function CellEditor({ cell, day, period, onSave, onCancel }: Props) {
  const [subject, setSubject] = useState(cell.subject)
  const [className, setClassName] = useState(cell.className)
  const [room, setRoom] = useState(cell.room)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ subject, className, room })
  }

  const handleClear = () => {
    onSave({ subject: '', className: '', room: '' })
  }

  const periodLabel = period === '放課後' ? '放課後' : `${period}時限`

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          {day}曜 {periodLabel}
        </h3>
        <form onSubmit={handleSubmit}>
          <label>
            教科名
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="例：数学"
              autoFocus
            />
          </label>
          <label>
            クラス名
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="例：2年1組"
            />
          </label>
          <label>
            教室
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="例：理科室"
            />
          </label>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">
              保存
            </button>
            <button type="button" className="btn btn-danger" onClick={handleClear}>
              クリア
            </button>
            <button type="button" className="btn" onClick={onCancel}>
              キャンセル
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
