// https://www.w3schools.com/jsref/jsref_obj_date.asp


// refector to take in function and time it
async function timeIt() {
  var d = new Date();
  var now = d.getTime();
  
  // t = `time: ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;

  return now;
}



