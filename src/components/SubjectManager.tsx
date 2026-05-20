import { useState } from 'react'
import type { SubjectPreset } from '../types'

interface Props {
  subjectPresets: SubjectPreset[]
  onUpdate: (presets: SubjectPreset[]) => void
}

const COLORS = [
  '#fee2e2', '#dbeafe', '#dcfce7', '#fef3c7', '#fce7f3',
  '#e0e7ff', '#fae8ff', '#ccfbf1', '#fed7aa', '#fbcfe8',
  '#d9f99d', '#e2e8f0', '#f1f5f9', '#bfdbfe', '#a7f3d0',
]

export function SubjectManager({ subjectPresets, onUpdate }: Props) {
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(COLORS[0])

  const handleAdd = () => {
    if (!newName.trim()) return
    const id = `s-${Date.now()}`
    onUpdate([...subjectPresets, { id, name: newName.trim(), color: newColor }])
    setNewName('')
  }

  const handleDelete = (id: string) => {
    onUpdate(subjectPresets.filter((s) => s.id !== id))
  }

  const handleColorChange = (id: string, color: string) => {
    onUpdate(subjectPresets.map((s) => (s.id === id ? { ...s, color } : s)))
  }

  return (
    <div className="subject-manager">
      <h2>教科プリセット</h2>
      <p className="text-muted">時間割編集時にクリックで教科を選択できます</p>

      <div className="subject-list">
        {subjectPresets.map((sp) => (
          <div key={sp.id} className="subject-item" style={{ borderLeftColor: sp.color }}>
            <span className="subject-name" style={{ background: sp.color }}>{sp.name}</span>
            <select
              className="subject-color-select"
              value={sp.color}
              onChange={(e) => handleColorChange(sp.id, e.target.value)}
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(sp.id)}>削除</button>
          </div>
        ))}
      </div>

      <div className="subject-add-form">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="教科名"
        />
        <select value={newColor} onChange={(e) => setNewColor(e.target.value)}>
          {COLORS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleAdd}>追加</button>
      </div>
    </div>
  )
}
