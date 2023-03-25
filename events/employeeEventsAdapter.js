function employeeEventsAdapter(employee){
  let userEvents = [];
  console.log('Processing events for employee: ', employee['Name']);
  employee['Template'].forEach(template => {
    console.log('Current template:', template)
    let templateSs = SpreadsheetApp.getActive().getSheetByName(template);
    let currentTemplate = templateAdapter(templateSs)
    currentTemplate.forEach(row =>{
      let userEvent = {...employee, ...row};
      renameObjectKey(userEvent, 'timeZone', 'Time Zone')
      renameObjectKey(userEvent, 'hireDate', 'Hire date')
      renameObjectKey(userEvent, 'stageSpan', 'Number of days until event')
      renameObjectKey(userEvent, 'eventTime', 'Time of the event')
      delete userEvent['Template']
      userEvents.push(userEvent)
      })
  });
  return userEvents
};