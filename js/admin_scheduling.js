import {deserialize, getWeekNumber, niceDate, req, json} from './base.js';

function setSubject(subject) {
    var tr = document.createElement('tr');
    tr.className = "edit"
    tr.innerHTML = '<td bgcolor="#ffffff"><input type="text" class="text" value="' + subject + '"><br></td>'
    return tr
}

function setSchedule(data) {
    var schedule = JSON.parse(data).schedule[0]

    for (var i = 0; i < schedule.length; i++) {
        var weekDay = schedule[i]
        var subj = document.getElementById(i + "")

        for (var j = 0; j < weekDay.length; j++) {
            subj.append(setSubject(weekDay[j][0]))
        }
    }
}

var weekControl = document.querySelector('input[type="week"]');
weekControl.value = niceDate(new Date())
var inputs = document.getElementsByTagName("input")
var week = Number(inputs[1].value[inputs[1].value.length-2] + inputs[1].value[inputs[1].value.length-1])

var school = deserialize(json.School)

req.open("GET", "get_schedule/" + school + "/" + inputs[0].value + "/" + getWeekNumber(new Date()), false);
req.send(null);
setSchedule(req.responseText)

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("change").onclick = function() {
        var clazz = inputs[0].value

        if (clazz.length > 3 || clazz.length <= 1 || !(/[0-9]/.test(clazz)) || !(/[а-яё]/i.test(clazz))) {
            alert("Введён некорректный класс!")
            return
        }

        var schedule = [[], [], [], [], [], []]
        var numSubj = 0;
        var day = 0;
        week = Number(inputs[1].value[inputs[1].value.length-2] + inputs[1].value[inputs[1].value.length-1])

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

        Swal.fire({
            title: "Сохранено!",
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: "top"
        })
    }
});
