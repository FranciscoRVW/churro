// Test your functions here
function main() {
  sendEmails(subjectLine='new_hires', sheet=SpreadsheetApp.getActiveSheet())
}

function timeNow(diff){
  let d = new Date
  d.setHours(d.getHours()+diff)
  return d
}

function timeTest(){
  let vietnamTime = timeNow(13)
  let spainTime = timeNow(7)
  console.log(`Vietnam time: ${vietnamTime.getDay()}`)
  console.log(`Spain time: ${spainTime.getDay()}`)
}