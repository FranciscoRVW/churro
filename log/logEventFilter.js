function filterLoggedEvents(bulkUserEvents, loggedEvents){
  let userEvents = bulkUserEvents.filter(event => {
    return !loggedEvents.some(loggedEvent => {
      return (
        event['Recipient'] == loggedEvent['Recipient'] &&
        event['template'] == loggedEvent['template'] &&
        event['Event'] == loggedEvent['Event']
      );
    });
  });
  
  return userEvents;    
}
