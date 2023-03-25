function employeeAdapter(employeeObject){
  if (employeeObject['Template'] == false) {
    return
  }
  const adaptedEmployee = {...employeeObject};
  adaptedEmployee['Template'] = adaptedEmployee['Template'].split(',');
  adaptedEmployee['Template'] = adaptedEmployee['Template'].map(template =>  template.trim());
  return adaptedEmployee;
}