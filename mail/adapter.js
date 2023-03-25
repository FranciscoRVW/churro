function mailAdapter(eventObject) {
  let mailObject = {}
  mailObject.to = eventObject.stageSpan < 0 ? eventObject['Personal Recipient'] : eventObject['Recipient']
  mailObject.subject = eventObject['Subject']
  let htmlBody = convertGoogleDocToCleanHtml(eventObject['Document'])
  mailObject = {...mailObject, ...htmlBody}
  let employeeHTMLTemplate = fillInTemplateFromObject_(mailObject.htmlBody, eventObject);
  mailObject.htmlBody = employeeHTMLTemplate

  return mailObject
}