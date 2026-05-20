import { useState } from 'react'
import { useAppData } from './hooks/useAppData'
import { TimetableView } from './components/TimetableView'
import { PresetManager } from './components/PresetManager'
import { Calendar } from './components/Calendar'
import { HolidayManager } from './components/HolidayManager'
import { SubjectManager } from './components/SubjectManager'
import './App.css'

type Tab = 'timetable' | 'presets' | 'calendar' | 'holidays' | 'subjects'

function App() {
  const {
    data,
    updateTimetable,
    updatePresets,
    setActivePreset,
    updateCalendarConfig,
    updateHolidays,
    updateSubjectPresets,
    updateDailyTimetables,
    fetchHolidays,
  } = useAppData()

  const [activeTab, setActiveTab] = useState<Tab>('timetable')

  const activePreset = data.presets.find((p) => p.id === data.activePresetId)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'timetable', label: '時間割' },
    { id: 'calendar', label: 'カレンダー' },
    { id: 'subjects', label: '教科' },
    { id: 'presets', label: 'プリセット' },
    { id: 'holidays', label: '祝日' },
  ]

  return (
    <div className="app">
      <header className="app-header">
        <h1>時間割管理</h1>
        {activePreset && (
          <span className="header-preset">{activePreset.name}</span>
        )}
      </header>

      <nav className="tab-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === 'timetable' && (
          <TimetableView
            timetable={data.timetable}
            activePreset={activePreset}
            subjectPresets={data.subjectPresets}
            onUpdate={updateTimetable}
          />
        )}
        {activeTab === 'presets' && (
          <PresetManager
            presets={data.presets}
            activePresetId={data.activePresetId}
            onUpdatePresets={updatePresets}
            onSetActive={setActivePreset}
          />
        )}
        {activeTab === 'calendar' && (
          <Calendar
            calendarConfig={data.calendarConfig}
            presets={data.presets}
            holidays={data.holidays}
            baseTimetable={data.timetable}
            dailyTimetables={data.dailyTimetables}
            subjectPresets={data.subjectPresets}
            onUpdateConfig={updateCalendarConfig}
            onUpdateDailyTimetables={updateDailyTimetables}
            onFetchHolidays={fetchHolidays}
          />
        )}
        {activeTab === 'holidays' && (
          <HolidayManager
            holidays={data.holidays}
            onUpdate={updateHolidays}
            onFetchHolidays={fetchHolidays}
          />
        )}
        {activeTab === 'subjects' && (
          <SubjectManager
            subjectPresets={data.subjectPresets}
            onUpdate={updateSubjectPresets}
          />
        )}
      </main>
    </div>
  )
}

export default App
