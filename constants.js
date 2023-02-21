/**
 * Change these to match the column names you are using for email 
 * recipient addresses and email sent column.
*/
const RECIPIENT_COL  = "Recipient";
const EMAIL_SENT_COL = "Email Sent";
const ACTIVE_USER_EMAIL = Session.getActiveUser().getEmail();
const SENDER_ALIAS_COL = "Send as"
const HIRE_DATE_COL = "Hire date"


/**
 * Time zone constants
 * All time bases calculations are located on the GMT-6 TZ
 */
const VIETNAM_TIME = timeNow(13)
const SPAIN_TIME = timeNow(7)
