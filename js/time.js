function showTime(date) {
  let str;
  let am = "am";
  let hh = date.getHours();
  if (hh < 10) hh = "0" + hh;
  let mm = date.getMinutes();
  if (mm < 10) mm = "0" + mm;
  let ss = date.getSeconds();
  if (ss < 10) ss = "0" + ss;

  if (hh > 12) {
    hh = hh - 12;
    am = "pm";
  }
  str = '<span class="thin">' + hh + ":" + mm + ":" + ss + " " + am + "</span>";

  return str;
}

function showDate(date) {
  let str;
  let MM = date.getMonth() + 1;
  let DD = date.getDate();
  let YY = date.getFullYear();
  let ww = date.getDay();

  switch (ww) {
    case 0:
      ww = "Sun";
      break;
    case 1:
      ww = "Mon";
      break;
    case 2:
      ww = "Tue";
      break;
    case 3:
      ww = "Wed";
      break;
    case 4:
      ww = "Thu";
      break;
    case 5:
      ww = "Fri";
      break;
    case 6:
      ww = "Sat";
      break;

    default:
      break;
  }

  str = '<span class="thin">' + ww + " " + MM + "/" + DD + "/" + YY + "</span>";

  return str;
}

function tick() {
  let today = new Date();
  document.getElementById("date").innerHTML = showDate(today);
  document.getElementById("time").innerHTML = showTime(today);
  window.setTimeout("tick()", 1000);
}

tick();
