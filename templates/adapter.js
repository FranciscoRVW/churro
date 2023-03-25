function templateAdapter(sheet) {
  let template = convertSheetToObjArray(sheet);
  const adaptedTemplate = template.map(event =>{
    // let adaptedEvent = {...event}
    let adaptedEvent = {}
    adaptedEvent['template'] = sheet.getName()
    adaptedEvent = {...adaptedEvent, ...event}
    adaptedEvent['Number of days until event'] = Number(adaptedEvent['Number of days until event']);
    adaptedEvent['Time of the event'] = Number(adaptedEvent['Time of the event']);
    return adaptedEvent
  });
  return adaptedTemplate
}
