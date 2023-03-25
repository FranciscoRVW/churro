function updateProgressData(eventObject, currentProgress){
  // Search for current state
  let state = currentProgress.find(stage => {
    return (stage['Personal Recipient'] === eventObject['Personal Recipient']) &&
    (stage['template'] === eventObject['template']);
  });

  if (state) {
    console.log('Found')
    const index = currentProgress.findIndex(item => {
      return (item['Personal Recipient'] === state['Personal Recipient'] &&
      item['template'] === state['template'])
    });
    console.log('Found item index: ', index)
    currentProgress[index] = progressStateAdapter(eventObject)
  }else{
    currentProgress.push(progressStateAdapter(eventObject))
  }
}