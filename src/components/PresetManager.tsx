import { useState } from 'react'
import type { TimePreset, Period } from '../types'
import { PERIODS } from '../types'

interface Props {
  presets: TimePreset[]
  activePresetId: string
  onUpdatePresets: (presets: TimePreset[]) => void
  onSetActive: (id: string) => void
}

export function PresetManager({ presets, activePresetId, onUpdatePresets, onSetActive }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')

  const editingPreset = presets.find((p) => p.id === editingId)

  const handleAddPreset = () => {
    if (!newName.trim()) return
    const id = `preset-${Date.now()}`
    const basePreset = presets[0]
    const newPreset: TimePreset = {
      id,
      name: newName.trim(),
      slots: { ...basePreset.slots },
    }
    onUpdatePresets([...presets, newPreset])
    setNewName('')
    setShowAdd(false)
  }

  const handleDeletePreset = (id: string) => {
    if (presets.length <= 1) return
    const updated = presets.filter((p) => p.id !== id)
    onUpdatePresets(updated)
    if (activePresetId === id) {
      onSetActive(updated[0].id)
    }
  }

  const handleSlotChange = (
    presetId: string,
    period: Period,
    field: 'start' | 'end',
    value: string
  ) => {
    onUpdatePresets(
      presets.map((p) => {
        if (p.id !== presetId) return p
        return {
          ...p,
          slots: {
            ...p.slots,
            [period]: { ...p.slots[period], [field]: value },
          },
        }
      })
    )
  }

  return (
    <div className="preset-manager">
      <h2>時間プリセット管理</h2>

      <div className="preset-selector">
        <label>現在のプリセット：</label>
        <select
          value={activePresetId}
          onChange={(e) => onSetActive(e.target.value)}
        >
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="preset-list">
        {presets.map((preset) => (
          <div key={preset.id} className="preset-card">
            <div className="preset-card-header">
              <strong>{preset.name}</strong>
              <div>
                <button
                  className="btn btn-sm"
                  onClick={() =>
                    setEditingId(editingId === preset.id ? null : preset.id)
                  }
                >
                  {editingId === preset.id ? '閉じる' : '編集'}
                </button>
                {presets.length > 1 && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeletePreset(preset.id)}
                  >
                    削除
                  </button>
                )}
              </div>
            </div>

            {editingId === preset.id && editingPreset && (
              <div className="preset-edit">
                <table className="preset-table">
                  <thead>
                    <tr>
                      <th>時限</th>
                      <th>開始</th>
                      <th>終了</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PERIODS.filter((p) => p !== '6').map((period) => (
                      <tr key={period}>
                        <td>{period === '放課後' ? '放課後' : `${period}時限`}</td>
                        <td>
                          <input
                            type="time"
                            value={editingPreset.slots[period].start}
                            onChange={(e) =>
                              handleSlotChange(preset.id, period, 'start', e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            value={editingPreset.slots[period].end}
                            onChange={(e) =>
                              handleSlotChange(preset.id, period, 'end', e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAdd ? (
        <div className="preset-add-form">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="プリセット名"
            autoFocus
          />
          <button className="btn btn-primary" onClick={handleAddPreset}>
            追加
          </button>
          <button className="btn" onClick={() => setShowAdd(false)}>
            キャンセル
          </button>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
          新しいプリセットを追加
        </button>
      )}
    </div>
  )
}
