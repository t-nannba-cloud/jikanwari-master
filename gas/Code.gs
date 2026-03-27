function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('週案')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveData(jsonStr) {
  try {
    PropertiesService.getUserProperties().setProperty('weeklyPlanData', jsonStr);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function loadData() {
  try {
    const data = PropertiesService.getUserProperties().getProperty('weeklyPlanData');
    return { success: true, data: data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function createCalendarEvents(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    const { year, month, state } = data;
    const calendars = CalendarApp.getCalendarsByName('授業');
    if (!calendars || calendars.length === 0) {
      return { success: false, error: '「授業」という名前のカレンダーが見つかりません' };
    }
    const calendar = calendars[0];
    const DOW_KEYS = ['', '月', '火', '水', '木', '金', '土'];
    const lastDay = new Date(year, month, 0).getDate();
    let count = 0;

    for (let d = 1; d <= lastDay; d++) {
      const date = new Date(year, month - 1, d);
      const dow = date.getDay();
      if (dow === 0) continue;

      const dateStr = gasFormatDate(date);
      const config = state.calendarConfig && state.calendarConfig[dateStr];
      if (!config || !config.presetId) continue;

      const preset = state.presets.find(function(p) { return p.id === config.presetId; });
      if (!preset) continue;

      const dayKey = DOW_KEYS[dow];
      const visiblePeriods = preset.visiblePeriods || ['1','2','3','4','5','6','放課後'];

      for (let pi = 0; pi < visiblePeriods.length; pi++) {
        const period = visiblePeriods[pi];
        const slot = preset.slots && preset.slots[period];
        if (!slot || !slot.start || slot.start === slot.end) continue;

        const cell = state.timetable[dayKey] && state.timetable[dayKey][period];
        const subject = cell && cell.subject ? cell.subject : slot.label;
        const room = cell && cell.room ? cell.room : '';
        const className = cell && cell.className ? cell.className : '';

        const startTime = gasParseTime(date, slot.start);
        const endTime = gasParseTime(date, slot.end);
        const title = subject + (className ? '（' + className + '）' : '');
        const options = { description: slot.label + (room ? '　場所：' + room : '') };
        if (room) options.location = room;

        calendar.createEvent(title, startTime, endTime, options);
        count++;
      }
    }
    return { success: true, count: count };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function deleteCalendarEvents(jsonStr) {
  try {
    const data = JSON.parse(jsonStr);
    const { year, month } = data;
    const calendar = CalendarApp.getDefaultCalendar();
    const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);
    const events = calendar.getEvents(startOfMonth, endOfMonth);
    let count = 0;
    for (let i = 0; i < events.length; i++) {
      events[i].deleteEvent();
      count++;
    }
    return { success: true, count: count };
  } catch(e) {
    return { success: false, error: e.toString() };
  }
}

function gasFormatDate(date) {
  return date.getFullYear() + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    String(date.getDate()).padStart(2, '0');
}

function gasParseTime(date, timeStr) {
  const parts = timeStr.split(':');
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(),
                     parseInt(parts[0]), parseInt(parts[1]), 0);
  return d;
}
