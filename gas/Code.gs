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
