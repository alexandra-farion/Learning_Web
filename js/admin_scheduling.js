function deserialize(string) {
    string = string.split(" ")
    arr = string.map(s => parseInt(s))
    str = ""
    for (i = 0; i < arr.length;i++) {
        str += String.fromCharCode(arr[i])
    }
    return str
}

function niceDate(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);

    if (weekNo < 10) {
        weekNo = String(0) + String(weekNo)
    }
    // Return array of year and week number
    return String(d.getUTCFullYear()) + "-W" + weekNo;
}

var school = deserialize(JSON.parse(document.cookie.match('(^|;) ?user_data=([^;]*)(;|$)')[2].split("\\054").join(",").slice(1, -1).split("'").join('"')).School)
var req = new XMLHttpRequest();
var weekControl = document.querySelector('input[type="week"]');
weekControl.value = niceDate(new Date())

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("change").onclick = function() {
        var inputs = document.getElementsByTagName("input")
        var clazz = inputs[0].value
        var week = inputs[1].value

        if (clazz.length > 3 || clazz.length <= 1 || !(/[0-9]/.test(clazz)) || !(/[а-яё]/i.test(clazz))) {
            alert("Введён некорректный класс!")
            return
        }

        var schedule = [[], [], [], [], [], []]
        var numSubj = 0;
        var day = 0;
        week = Number(week[week.length-2] + week[week.length-1])

        for (var i = 2; i < inputs.length; i++) {
            schedule[day][numSubj] = inputs[i].value

            numSubj += 1
            if (numSubj == 8) {
                day += 1
                numSubj = 0
            }
        }

        req.open("GET", "post_schedule/" + JSON.stringify({"Schedule": schedule,
                "Class": clazz.toUpperCase(), "Week": week, "School": school}), false);
        req.send(null);
    }
});
