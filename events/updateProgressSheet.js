function updateProgressSheet(sheet, progressArray){
  const dataRange = sheet.getDataRange();
  const data = dataRange.getDisplayValues();
  const heads = data.shift();

  sheet.clearContents();
  sheet.appendRow(heads);

  progressArray.forEach( item => {
    sheet.appendRow(Object.values(item))
  })
}