import { useState } from 'react'
import type { Holiday } from '../types'

interface Props {
  holidays: Holiday[]
  onUpdate: (holidays: Holiday[]) => void
  onFetchHolidays: (year: number) => void
}

export function HolidayManager({ holidays, onUpdate, onFetchHolidays }: Props) {
  const [newDate, setNewDate] = useState('')
  const [newName, setNewName] = useState('')
  const [fetchYear, setFetchYear] = useState(new Date().getFullYear())

  const handleAdd = () => {
    if (!newDate || !newName.trim()) return
    const updated = [
      ...holidays,
      { date: newDate, name: newName.trim(), isManual: true },
    ].sort((a, b) => a.date.localeCompare(b.date))
    onUpdate(updated)
    setNewDate('')
    setNewName('')
  }

  const handleDelete = (date: string) => {
    onUpdate(holidays.filter((h) => h.date !== date))
  }

  return (
    <div className="holiday-manager">
      <h2>祝日管理</h2>

      <div className="holiday-fetch">
        <label>祝日を自動取得：</label>
        <input
          type="number"
          value={fetchYear}
          onChange={(e) => setFetchYear(Number(e.target.value))}
          min={2020}
          max={2030}
        />
        <button className="btn btn-primary" onClick={() => onFetchHolidays(fetchYear)}>
          年
          取得
        </button>
      </div>

      <div className="holiday-add">
        <h3>手動追加</h3>
        <div className="holiday-add-form">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="祝日名"
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            追加
          </button>
        </div>
      </div>

      <div className="holiday-list">
        <h3>登録済み祝日</h3>
        {holidays.length === 0 ? (
          <p className="text-muted">祝日が登録されていません</p>
        ) : (
          <table className="holiday-table">
            <thead>
              <tr>
                <th>日付</th>
                <th>名称</th>
                <th>種別</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((h) => (
                <tr key={h.date}>
                  <td>{h.date}</td>
                  <td>{h.name}</td>
                  <td>{h.isManual ? '手動' : '自動'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(h.date)}
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
