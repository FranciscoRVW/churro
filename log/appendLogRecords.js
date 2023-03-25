function appendLogRecordsToSheet(sheet, recordsArray) {
  recordsArray.forEach(record => {
    sheet.appendRow([...Object.values(record)])
  })
  return recordsArray.length
}
