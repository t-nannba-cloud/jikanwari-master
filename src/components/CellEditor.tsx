import { useState } from 'react'
import type { TimetableCell, DayOfWeek, Period, SubjectPreset } from '../types'

interface Props {
  cell: TimetableCell
  day: DayOfWeek | string
  period: Period
  subjectPresets: SubjectPreset[]
  onSave: (cell: TimetableCell) => void
  onCancel: () => void
}

export function CellEditor({ cell, day, period, subjectPresets, onSave, onCancel }: Props) {
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

  const handleSubjectClick = (name: string) => {
    setSubject(name)
  }

  const periodLabel = period === '放課後' ? '放課後' : `${period}時限`

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>
          {day}曜 {periodLabel}
        </h3>

        <div className="subject-chips">
          {subjectPresets.map((sp) => (
            <button
              key={sp.id}
              type="button"
              className={`subject-chip ${subject === sp.name ? 'selected' : ''}`}
              style={{ background: subject === sp.name ? sp.color : undefined, borderColor: sp.color }}
              onClick={() => handleSubjectClick(sp.name)}
            >
              {sp.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            教科名
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="例：数学"
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
