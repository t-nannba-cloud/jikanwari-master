import type { Holiday } from '../types'

export async function fetchJapaneseHolidays(year: number): Promise<Holiday[]> {
  try {
    const res = await fetch(
      `https://holidays-jp.github.io/api/v1/${year}/date.json`
    )
    if (!res.ok) return []
    const data: Record<string, string> = await res.json()
    return Object.entries(data).map(([date, name]) => ({
      date,
      name,
      isManual: false,
    }))
  } catch {
    return []
  }
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const date = new Date(year, month - 1, 1)
  while (date.getMonth() === month - 1) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}
