// Test your functions here
// logs as progressEvents Array
function test_any(){
  const employee = EMPLOYEES[0];
  const employeeEvents = employeeEventsAdapter(employee);
  console.log(employeeEvents);

  const employeeLoggedEvents = IN_PROGRESS_LOG_DATA.filter(row => {
    return (
      row['User'] === employee['Recipient'] &&
      row['Type'] === 'email'
    );
  }).map(row => {
    return JSON.parse(row['Result'])
  });

  console.log('In progress log data: \n',employeeLoggedEvents);
  console.log('Event in array: \n', eventInArray(employeeEvents[0], employeeLoggedEvents));
  console.log('All events in array: \n', employeeEvents.every(event => eventInArray(event, employeeLoggedEvents)));
}


// test user events (all) -> prod candidate
function test_mailer_all_users(){
  console.time('Mailer all');
  console.log(EMPLOYEES);
  let allUserEvents = (EMPLOYEES.map(employee => employeeEventsAdapter(employee))).flat();
  let userLoggedEvents = [...IN_PROGRESS_LOGGED_EVENTS];
  let userEvents = filterLoggedEvents(allUserEvents,userLoggedEvents);
  console.log('User events: \n', userEvents);
  let currentProgress = [...IN_PROGRESS_DATA];
  let currentLog = []
  console.log('Current progress is: ', currentProgress)
  console.log('User events: \n', userEvents);

  userEvents.forEach( userEvent => {
    const {timeZone, hireDate, stageSpan, emailSent, eventTime} = userEvent;
    if (mailSendingRules(timeZone, hireDate, stageSpan, emailSent, eventTime)){
      const mailObject = mailAdapter(userEvent);
      console.log(mailObject);
      try{
        // MailApp.sendEmail({...mailObject});
        updateProgressData(userEvent, currentProgress)
        currentLog.push(logRecordAdapter(userEvent, 'email', progressStateAdapter(userEvent)))

      } catch(e) {
        console.log([e.message]);
        currentLog.push(logRecordAdapter(userEvent, 'email', progressStateAdapter([e.message])))

      }
      console.log('mail sent: ', mailObject.subject);
    };
  });

  console.log('Latest progress: ', currentProgress);
  updateProgressSheet(IN_PROGRESS_SHEET, currentProgress)
  appendLogRecordsToSheet(IN_PROGRESS_LOG_SHEET, currentLog);
  appendLogRecordsToSheet(ACTIVITY_LOG_SHEET, currentLog);
  console.timeEnd('Mailer all');
}

// test enrollment end eval
function test_end_of_enrollment(){

}

// test log filter function
function test_log_filter(){
  const totalUserEvents = (EMPLOYEES.map(employee => employeeEventsAdapter(employee))).flat();
  const sheet = ACTIVITY_LOG_SHEET;
  const dataColumns = convertSheetColumnsToObject(sheet);
  const userLoggedEvents = dataColumns['Result'].map(item => JSON.parse(item));

  const userEvents = filterLoggedEvents(totalUserEvents,userLoggedEvents);

  console.log('Data columns: \n', dataColumns);
  console.log('User logged events: \n', userLoggedEvents);
  console.log('User events: \n', userEvents );

}


// test create a log record object
function test_log_record_adapter(){
  const userEvent = { 
    'Personal Recipient': 'john@personal.com',
    Recipient: 'john.doe@wizeline.com',
    'PC - Agent': 'francisco.rv@wizeline.com',
    Name: 'John Doe',
    'Start date': '2023-02-15',
    OfficeLocation: 'CDMX',
    Project: '',
    template: 'Template1 - US Onboarding',
    Event: 'Foo',
    Subject: 'US template 1',
    Document: 'https://docs.google.com/document/d/1v1kgAlzt7WNJQGWbmSsgA0Vp8U5xYULKmGutwvG1rP0/edit',
    'Send as': '',
    CC: '',
    BCC: '',
    timeZone: 'Mexico',
    hireDate: '2023-02-01',
    stageSpan: -5,
    eventTime: 0 
  };
  
  let logRecord = logRecordAdapter(userEvent,'email', progressStateAdapter(userEvent));

  console.log(logRecord)
}
// test update in progress sheet
function test_update_in_progress_sheet(){
  let latestProgress = 	[ { 'Personal Recipient': 'francisco.rv@wizeline.com',
    Recipient: 'fran.rv@wizeline.com',
    'Time Zone': 'US',
    'Hire date': '2023-01-01',
    Template: 'Template1 - MX Onboarding',
    Event: 'Correo2',
    'Event Start Date': '1',
    'PC - Agent': 'francisco.rv@wizeline.com' },
  { 'Personal Recipient': 'francisco.rv@wizeline.com',
    Recipient: 'fran.rv@wizeline.com',
    'Time Zone': 'US',
    'Hire date': '2023-01-01',
    Template: 'Template1 - US Onboarding',
    Event: 'Correo 2',
    'Event Start Date': '1',
    'PC - Agent': 'francisco.rv@wizeline.com' } ]
  
  let sheet = IN_PROGRESS_SHEET

  updateProgressSheet(sheet, latestProgress)
}

// test progressUpdate -function code-
function test_progress_update(){
  let employee = EMPLOYEES[0];
  let userEvents = employeeEventsAdapter(employee);
  let eventObject = userEvents[1]
  console.log('User event: ', eventObject)

  // let currentProgress =   [ 
  //   { 'Personal Recipient': 'francisco.rv@wizeline.com',
  //   Recipient: 'fran.rv@wizeline.com',
  //   'Time Zone': 'US',
  //   'Hire date': '2023-01-01',
  //   Template: 'Template1 - MX Onboarding',
  //   Event: 'Corre1',
  //   'Event Start Date': '-5',
  //   'PC - Agent': 'francisco.rv@wizeline.com' },

  // { 'Personal Recipient': 'francisco.rv@wizeline.com',
  //   Recipient: 'fran.rv@wizeline.com',
  //   'Time Zone': 'US',
  //   'Hire date': '2023-01-01',
  //   Template: 'Template1 - US Onboarding',
  //   Event: 'Correo 1',
  //   'Event Start Date': '-5',
  //   'PC - Agent': 'francisco.rv@wizeline.com' }
  // ];

  // let currentProgress = [];

  let state = currentProgress.find(stage => {
    return (stage['Personal Recipient'] === eventObject['Personal Recipient']) &&
    (stage['Template'] === eventObject['template']);
  });

  console.log('Found state: ', state);

  if (state) {
    console.log('Found')
    const index = currentProgress.findIndex(item => {
      return (item['Personal Recipient'] === state['Personal Recipient'] &&
      item['Template'] === state['Template'])
    });
    console.log('Found item index: ', index)
    currentProgress[index] = progressStateAdapter(eventObject)
  }else{
    console.log('Not found, push event: ', eventObject)
    currentProgress.push(progressStateAdapter(eventObject))
  }
  console.log('Updated progress: \n', currentProgress)

}


// Test update progress
function test_update_progress() {
  let employee = EMPLOYEES[0];
  let userEvents = employeeEventsAdapter(employee);

  let progress =   [ { 'Personal Recipient': 'francisco.rv@wizeline.com',
  Recipient: 'fran.rv@wizeline.com',
  timeZone: 'US',
  hireDate: '2023-01-01',
  template: 'Template1 - MX Onboarding',
  Event: 'Correo 2',
  stageSpan: 1,
  'PC - Agent': 'francisco.rv@wizeline.com' } ];

  console.log('user events: \n', userEvents)
  updateProgressData(userEvents[2], progress)

  console.log(progress)


}

// Get active user
function test_active_user(){
  console.log(Session.getActiveUser().getUsername())
}


function test_sending_rules(){
  // console.log(`Hiring span: ${timeSpan()}`)
  console.log(`Send mails: ${mailSendingRules(timeZone='mexico', hireDate='2023-01-01', stageSpan = 1, emailSent = '', eventTime = 1)}`);
}


// Find object in array by property value
// var result = myArray.find(item => item.id === 2);

// Test doc to html
function test_compose_html_from_doc(){
  let mail_object = convertGoogleDocToCleanHtml('https://docs.google.com/document/d/15yXiRW9DS_y8fX3o2yQqOX48txjppZ-_0k7ir50CPdM/edit');
  MailApp.sendEmail({
    to: 'francisco.rv@wizeline.com',
    subject: 'test doc to mail',
    ...mail_object
    }
  );
}

// employee object adapter test
function test_employee_adapter() {
  let enrollment = convertSheetToObjArray(BASE_ENROLLMENT_SHEET)
  let employees = enrollment.map(employeeAdapter)
  console.log(enrollment)
  console.log(employees)
}

// mail adapter tests
function test_mail_adapter() {
  console.log(EMPLOYEES)
}

// Test convert a sheet to an array of objects
function test_convert_to_array(){
  console.log(LISTS_SHEET_DATA)
}

// Test text replacement in mail object
function test_text_replacement(){
  // Create a base HTML + images base object, this will be a reference to compare the text substitution
  let mailObject = convertGoogleDocToCleanHtml('https://docs.google.com/document/d/15yXiRW9DS_y8fX3o2yQqOX48txjppZ-_0k7ir50CPdM/edit');
  // duplicate the object, to edit the template text
  let customMailObject = {...mailObject}
  // Select the employees catalog
  let employees = employeesAdapter(BASE_ENROLLMENT_SHEET);
  // Create the template by selecting the plain html + an employee from the catalog
  let employeeHTMLTemplate = fillInTemplateFromObject_(mailObject.htmlBody, employees.find(employee => employee['Name'] === 'Sofi Gudino'));
  console.log('Original text: ', mailObject.htmlBody)
  console.log('Replaced contents: ', employeeHTMLTemplate)
  // Insert the newly created text to the email object
  customMailObject.htmlBody = employeeHTMLTemplate
  // Send the email to verify everything worked as expected
  MailApp.sendEmail({
    to: 'francisco.rv@wizeline.com',
    subject: 'test custom template',
    ...customMailObject
  })
}


