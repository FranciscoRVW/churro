function progressStateAdapter(userEvent){
  let progressState = {};
  progressState['Personal Recipient'] = userEvent['Personal Recipient'];
  progressState['Recipient'] = userEvent['Recipient'];
  progressState['timeZone'] = userEvent['timeZone'] || userEvent['Time Zone'];
  progressState['hireDate'] = userEvent['hireDate'] || userEvent['Hire date'];
  progressState['template'] = userEvent['template'] || userEvent['Template'];
  progressState['Event'] = userEvent['Event'];
  progressState['stageSpan'] = userEvent['stageSpan'] ? String(userEvent['stageSpan']) : userEvent['Event Start Date'];
  progressState['PC - Agent'] = userEvent['PC - Agent'];

  return progressState
}