/** 
 * Creates the menu item "Mail Merge" for user to run scripts on drop-down.
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Churro')
      .addItem('Send Emails', 'sendEmails')
      .addToUi();
}

function renameObjectKey(obj, newKey, oldKey) {
  obj[ newKey ] = obj[ oldKey ];
  delete obj[ oldKey ];
}

function onEdit(e) {
  Logger.log(e)
  Logger.log(e.range.getSheet().getSheetName());
  let sheet = e.range.getSheet().getSheetName();
  let range = e.range;
  let column = range.getColumn();
  let row = range.getRow();
  let user = e.user
  let agentCell = BASE_ENROLLMENT_SHEET.getRange(row, 6)
  Logger.log(`sheet: ${sheet}, column: ${column}, row: ${row}`);
  if (sheet === BASE_ENROLLMENT_SHEET.getName() && column === 1 || column === 2) {
    agentCell.getValue() == '' ? agentCell.setValue(user) : false
  }
}

/**
 * Test if an employeeEvent is contained in an Array
 * @param {employeeEvent} employeeEvent - Object containing employee info and template stage
 * @param {Array} - An event objects array
 * @return {Boolean} - Boolean determining if an event is member of the Array
 */
function eventInArray(event, arr){
  return !!(
    arr.find(item => {
      return (
        event['template'] === item['template'] &&
        event['Event'] === item['Event']
      )
    })
  );
}



/**
 * Calculates the local time based on the time difference in hours
 * versus the target time zone
 * @param {number} timeDifference - Time difference in hours
 * @return {Date} localDate - Date object adjusted by the time difference
 */
function timeNow(timeDifference=0){
  let localDate = new Date
  localDate.setHours(localDate.getHours() + timeDifference)
  return localDate
}

/**
 * Tests if a date is a holiday in an array of a particular country
 * holidays
 * @param {String} country - Select the country to test the date
 * @param {Date} date - Date to determine if is a holiday
 * @return {Boolean} isHoliday - Boolean determining if a date is a holiday
 */
function isHoliday(country, date) {
  let dateISOstring = date.toISOString().slice(0,10);
  const holidays = HOLIDAYS[`${date.getFullYear()}`][country];

  return holidays.some(holiday => holiday === dateISOstring);
}


/**
 * Calculates the time in days between the employee's hire date and the current date
 * @param {string} date - ISO 8601 compliant date string
 * @return {number} timeSpan - The time in days elapsed between the hire date and the
 * current date
 */
function timeSpan(date) {
  let today = new Date
  let hireDate = new Date(date)
  let span = (today - hireDate) / (24*60*60*1000)
  return span
}

/**
 * Convert sheet columns into an array of Objects
 * @param {Sheet} Sheet Class - Spreadsheet from where the data will be extracted
 * @return {Array} array - sheet data array of objects
 */
function convertSheetColumnsToObject(sheet){
  const dataRange = sheet.getDataRange();
  const data = dataRange.getDisplayValues();
  const heads = data.shift()

  let arraysObject = {}

  const arrayColumn = (arr, n) => {
    let column = arr.map(x => x[n])
    let cleanColumn = column.filter(n=>n);
    return cleanColumn
  }

  heads.forEach((k, i ) => arraysObject[k] = arrayColumn(data, i));

  return arraysObject
}  


/**
 * Convert sheet into object array
 * @param {Sheet} Sheet Class - Spreadsheet from where the data will be extracted
 * @return {Object} object - sheet data object 
 */
function convertSheetToObjArray(sheet){
  // Gets the data from the passed sheet
  const dataRange = sheet.getDataRange();

  // Fetches displayed values for each row in the Range HT Andrew Roberts 
  // https://mashe.hawksey.info/2020/04/a-bulk-email-mail-merge-with-gmail-and-google-sheets-solution-evolution-using-v8/#comment-187490
  // @see https://developers.google.com/apps-script/reference/spreadsheet/range#getdisplayvalues
  const data = dataRange.getDisplayValues();

  // Assumes row 1 contains our column headings
  const heads = data.shift(); 

  // Converts 2d array into an object array
  // See https://stackoverflow.com/a/22917499/1027723
  // For a pretty version, see https://mashe.hawksey.info/?p=17869/#comment-184945
  const dataObject = data.map(r => (heads.reduce((o, k, i) => (o[k] = r[i] || '', o), {})));

  return dataObject
}

/**
 * Escape cell data to make JSON safe
 * @see https://stackoverflow.com/a/9204218/1027723
 * @param {string} str to escape JSON special characters from
 * @return {string} escaped string
*/
function escapeData_(str) {
  return str
    .replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
};


/**
 * Fill template string with data object
 * @see https://stackoverflow.com/a/378000/1027723
 * @param {string} template string containing {{}} markers which are replaced with data
 * @param {object} data object used to replace {{}} markers
 * @return {object} message replaced with data
*/
function fillInTemplateFromObject_(template, data) {
  // We have two templates one for plain text and the html body
  // Stringifing the object means we can do a global replace
  let template_string = JSON.stringify(template);

  // Token replacement
  template_string = template_string.replace(/{{[^{}]+}}/g, key => {
    return escapeData_(data[key.replace(/[{}]+/g, "")] || "");
  });
  return  JSON.parse(template_string);
}

/**
 * Determine if under the arguments conditions the email should
 * be sent to the recipient or not.
 * @param {string} timeZone - Timezone of the recipient.
 * @param {string} hireDate - ISO 8601 compliant date string of the employee
 * hiring date.
 * @param {number} stageSpan - Integer representing the minimum time elapsed
 * from the hiring date to email sending.
 * @param {string} emailSent - If the contents of the cell are empty, the email
 * will be sent
 * @param {number} eventTime - Hour of the day for the mail to be sent
 * @return {boolean} sendMails
 */
function mailSendingRules(timeZone, hireDate, stageSpan, eventTime){
  console.log('Debug mode is: ', DEBUG)
  const TIMEZONES = {
    apac: 13,
    australia: 17,
    canada: 1,
    colombia: 1,
    mexico: 0,
    spain: 7,
    thailand: 13,
    vietnam: 13,
    us: -2,
    custom: 0
  };

  let timezone = timeZone.toLowerCase()
  let localTime = timeNow(TIMEZONES[timezone]);

  let sendMails = true;


  if (localTime.getHours() < 9) { 
    sendMails = false;

    if (DEBUG == true) { 
      console.log('localTime.getHours =', localTime.getHours(), 'sendMails', sendMails);
    }
  };
  if (localTime.getHours() > 17) { 
    sendMails = false;

    if (DEBUG == true) { 
      console.log('localTime.getHours =', localTime.getHours(), 'sendMails', sendMails);
    }
  };
  if (localTime.getDay() === 0) {
    sendMails = false;

    if (DEBUG == true) { 
      console.log('localTime.getDay =', localTime.getDay(), 'sendMails', sendMails);
    }
  };
  if (localTime.getDay() === 6) {
    sendMails = false;

    if (DEBUG == true) { 
      console.log('localTime.getHours =', localTime.getHours(), 'sendMails', sendMails)
    }
  };
  if (timeSpan(hireDate) < stageSpan) {
    sendMails = false;

    if (DEBUG == true) { 
      console.log('Time span=', timeSpan(hireDate), 'stageSpan = ', stageSpan, 'sendMails', sendMails)
    }
  };
  if (localTime.getHours() < eventTime){
    sendMails = false;

    if (DEBUG == true) { 
      console.log('Local Time =', localTime.getHours(), 'Event time = ', eventTime, 'sendMails', sendMails)
    }
  }
  if (isHoliday(timezone, localTime)) {
    sendMails = false

    if (DEBUG == true) { 
      console.log('is holiday? =',isHoliday(timezone, localTime), 'sendMails', sendMails)
    }
  }

  return sendMails;
}



/**
 * Sends emails from sheet data.
 * @param {string} subjectLine (optional) for the email draft message
 * @param {Sheet} sheet to read data from
*/
function sendEmails(stage, options) {
  console.log('sheet name:', options['Sheet name'])

  if (options[`Stage ${stage} template`] == '') {
    console.log('No template for this stage')
    return
  }

  const sheet = SpreadsheetApp.getActive().getSheetByName(options['Sheet name'])
  // Gets the draft Gmail message to use as a template
    console.log(options['Stage template: ',`Stage ${stage} template`])
  const emailTemplate = getGmailTemplateFromDrafts_(options[`Stage ${stage} template`]);
  
  // Gets the data from the passed sheet
  const dataRange = sheet.getDataRange();
  // Fetches displayed values for each row in the Range HT Andrew Roberts 
  // https://mashe.hawksey.info/2020/04/a-bulk-email-mail-merge-with-gmail-and-google-sheets-solution-evolution-using-v8/#comment-187490
  // @see https://developers.google.com/apps-script/reference/spreadsheet/range#getdisplayvalues
  const data = dataRange.getDisplayValues();

  // Assumes row 1 contains our column headings
  const heads = data.shift(); 
  
  // Gets the index of the column named 'Email Status' (Assumes header names are unique)
  // @see http://ramblings.mcpher.com/Home/excelquirks/gooscript/arrayfunctions
  console.log('Stage: ', `Stage ${stage}`)
  const emailSentColIdx = heads.indexOf(`Stage ${stage}`);
  
  // Converts 2d array into an object array
  // See https://stackoverflow.com/a/22917499/1027723
  // For a pretty version, see https://mashe.hawksey.info/?p=17869/#comment-184945
  const obj = data.map(r => (heads.reduce((o, k, i) => (o[k] = r[i] || '', o), {})));

  // Creates an array to record sent emails
  const out = [];

  // Loops through all the rows of data
  obj.forEach(function(row, rowIdx){
    // Only sends emails if email_sent cell is blank and not hidden by a filter
    // TODO: Refactor send test to take into account weekdays, date and TZ
    if (row[`Stage ${stage}`] == '' && mailSendingRules(
      options['Time zone'], 
      row['Hire date'], 
      options[`Stage ${stage} span`],
      row[`Stage ${stage}`])
      ){
      try {
        const msgObj = fillInTemplateFromObject_(emailTemplate.message, row);


        // See https://developers.google.com/apps-script/reference/gmail/gmail-app#sendEmail(String,String,String,Object)
        // If you need to send emails with unicode/emoji characters change GmailApp for MailApp
        // Uncomment advanced parameters as needed (see docs for limitations)
        GmailApp.sendEmail(row['Recipient'], msgObj.subject, msgObj.text, {
          htmlBody: msgObj.html,
          bcc: row[BCC_COL],
          cc: row[CC_COL],
          // name: 'name of the sender',
          // replyTo: 'a.reply@email.com',
          // noReply: true, // if the email should be sent from a generic no-reply email address (not available to gmail.com users),
          from: row[SENDER_ALIAS_COL] ? row[SENDER_ALIAS_COL] : ACTIVE_USER_EMAIL,
          attachments: emailTemplate.attachments,
          inlineImages: emailTemplate.inlineImages
        });
        // Edits cell to record email sent date
        out.push([new Date()]);
      } catch(e) {
        // modify cell to record error
        out.push([e.message]);
      }
    } else {
      out.push([row[options[`Stage ${stage}`]]]);
    }
  });
  
  // Updates the sheet with new data
  sheet.getRange(2, emailSentColIdx+1, out.length).setValues(out);
  
  /**
   * Get a Gmail draft message by matching the subject line.
   * @param {string} subject_line to search for draft message
   * @return {object} containing the subject, plain and html message body and attachments
  */
  function getGmailTemplateFromDrafts_(subject_line){
    try {
      // get drafts
      const drafts = GmailApp.getDrafts();
      // filter the drafts that match subject line
      const draft = drafts.filter(subjectFilter_(subject_line))[0];
      // get the message object
      const msg = draft.getMessage();

      // Handles inline images and attachments so they can be included in the merge
      // Based on https://stackoverflow.com/a/65813881/1027723
      // Gets all attachments and inline image attachments
      const allInlineImages = draft.getMessage().getAttachments({includeInlineImages: true,includeAttachments:false});
      const attachments = draft.getMessage().getAttachments({includeInlineImages: false});
      const htmlBody = msg.getBody(); 

      // Creates an inline image object with the image name as key 
      // (can't rely on image index as array based on insert order)
      const img_obj = allInlineImages.reduce((obj, i) => (obj[i.getName()] = i, obj) ,{});

      //Regexp searches for all img string positions with cid
      const imgexp = RegExp('<img.*?src="cid:(.*?)".*?alt="(.*?)"[^\>]+>', 'g');
      const matches = [...htmlBody.matchAll(imgexp)];

      //Initiates the allInlineImages object
      const inlineImagesObj = {};
      // built an inlineImagesObj from inline image matches
      matches.forEach(match => inlineImagesObj[match[1]] = img_obj[match[2]]);

      return {message: {subject: subject_line, text: msg.getPlainBody(), html:htmlBody}, 
              attachments: attachments, inlineImages: inlineImagesObj };
    } catch(e) {
      throw new Error("Oops - can't find Gmail draft");
    }

    /**
     * Filter draft objects with the matching subject linemessage by matching the subject line.
     * @param {string} subject_line to search for draft message
     * @return {object} GmailDraft object
    */
    function subjectFilter_(subject_line){
      return function(element) {
        if (element.getMessage().getSubject() === subject_line) {
          return element;
        }
      }
    }
  }
}
