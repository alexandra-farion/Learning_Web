var req = new XMLHttpRequest();

function deserialize(string) {
    string = string.split(" ")
    arr = string.map(s => parseInt(s))
    str = ""
    for (i = 0; i < arr.length;i++) {
        str += String.fromCharCode(arr[i])
    }
    return str
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    return Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
}

function niceDate(d) {
    var weekNo = getWeekNumber(d)
    if (weekNo < 10) {
        weekNo = String(0) + String(weekNo)
    }
    return String(d.getFullYear()) + "-W" + weekNo;
}

function getSubject(array) {
    tr = document.createElement('tr');
    str = '<td bgcolor="#ffffff" width="150" height="30"><i>&nbsp;' + array[0] + '</i></td> <td bgcolor="#ffffff" width="250" height="30">'
    if (array.length == 2) {
        str += '<i>' + array[1] + '</i>'
    }
    str += '</td> <td bgcolor="#ffffff" width="30" height="30">'

    if (array.length == 3) {
        str += '<i>' + array[2] + '</i>'
    }

    tr.innerHTML = str + '</td>'
    return tr
}

var weekControl = document.querySelector('input[type="week"]');
weekControl.value = niceDate(new Date())

var json = JSON.parse(document.cookie.match('(^|;) ?user_data=([^;]*)(;|$)')[2].split("\\054").join(",").slice(1, -1).split("'").join('"'))

req.open("GET", "get_schedule/" + deserialize(json.School) + "/" + deserialize(json.Class) + "/" + getWeekNumber(new Date()), false);
req.send(null);

var schedule = JSON.parse(req.responseText).schedule[0]
for (var i = 0; i < schedule.length; i++) {
    var weekDay = schedule[i]
    var subj = document.getElementById(i + "")

    for (var j = 0; j < weekDay.length; j++) {
        subj.append(getSubject(weekDay[j]))
    }
}
