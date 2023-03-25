function logRecordAdapter(eventObject, eventType, result) {
  let record = {};
  record.eventDate = (new Date()).toISOString().slice(0,10);
  record.eventType = eventType;
  record.user = eventObject['Recipient'];
  record['PC - Agent'] = eventObject['PC - Agent'];
  record.result = JSON.stringify(result);
  return record
}
