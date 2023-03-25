/**
 * Set DEBUG mode ON or OFF
 */
const DEBUG = true

/**
 * Control panel references
 */
const CONTROL_PANEL_SHEET = SpreadsheetApp.getActive().getSheetByName('control_panel');
const BASE_ENROLLMENT_SHEET = SpreadsheetApp.getActive().getSheetByName('Base - enrollment');
const EMPLOYEES = convertSheetToObjArray(BASE_ENROLLMENT_SHEET).map(employeeAdapter).filter(employee => employee);
const IN_PROGRESS_SHEET = SpreadsheetApp.getActive().getSheetByName('In Progress - enrollment');
const IN_PROGRESS_DATA = convertSheetToObjArray(IN_PROGRESS_SHEET).map(row => progressStateAdapter(row));
const IN_PROGRESS_LOG_SHEET = SpreadsheetApp.getActive().getSheetByName('In Progress log');
const IN_PROGRESS_LOG_DATA = convertSheetToObjArray(IN_PROGRESS_LOG_SHEET);
const IN_PROGRESS_LOGGED_EVENTS = convertSheetColumnsToObject(IN_PROGRESS_LOG_SHEET)['Result'].map(item => JSON.parse(item));
const ACTIVITY_LOG_SHEET = SpreadsheetApp.getActive().getSheetByName('Activity Log');
const LISTS_SHEET = SpreadsheetApp.getActive().getSheetByName('List');
const LISTS_SHEET_DATA = convertSheetColumnsToObject(LISTS_SHEET);

/**
 * Change these to match the column names you are using for email 
 * recipient addresses and email sent column.
*/
// NOTE: Right now this lines are commented, because all this data must be configured
// on the function that calls sendEmails(), so it gathers all the required data to send
// the information.
// !! THIS MAY CHANGE IN THE FUTURE THROUGH A sendEmails() REFACTOR !!

// const RECIPIENT_COL  = "Recipient";
// const EMAIL_SENT_COL = "Stage 1" //"Email Sent";
const ACTIVE_USER_EMAIL = Session.getActiveUser().getEmail();
const SENDER_ALIAS_COL = "Send as"
const BCC_COL = 'BCC'
const CC_COL = 'CC'



