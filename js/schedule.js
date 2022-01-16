import {deserialize, getWeekNumber, niceDate, req, json} from './base.js';

function getTD(text, width) {
    var td = document.createElement('td');
    td.className = "row"
    td.width=width

    var clazz = "containerMark"
    if (width === "150") {
        clazz = "containerSubj"
    } else {
        if (width === "250") {
            clazz = "containerDesc"
        }
    }

    var div = document.createElement('div');
    div.className = clazz
    div.innerHTML = '&nbsp;' + text

    td.appendChild(div)
    return td
}

function getSubject(array, mark) {
    var tr = document.createElement('tr');

    tr.appendChild(getTD(array[0], "150"))
    tr.appendChild(getTD(array[1], "250"))
    tr.appendChild(getTD(mark, "30"))
    var task = ""
    if (array[1] != "") {
        task = '<b>Задание: </b> ' + array[1]
    }
    var markT = ""
    if (mark != "") {
        markT = '<br> <b>Оценка: </b> ' + mark + "</br>"
    }

    tr.onclick = function() {
        Swal.mixin({
          customClass: {
            cancelButton: 'button'
          },
          buttonsStyling: false
        }).fire({
            title: array[0],
            html: task + markT,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: '<i>Закрыть</i>',
            icon: 'info',
            timer: 3500,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        Swal.stopTimer()
    };
    return tr
}

var weekControl = document.querySelector('input[type="week"]');
weekControl.value = niceDate(new Date())

req.open("GET", "get_schedule/" + deserialize(json.School) + "/" + deserialize(json.Class) + "/" + getWeekNumber(new Date()), false);
req.send(null);

var schedule = JSON.parse(req.responseText).schedule[0]
for (var i = 0; i < schedule.length; i++) {
    var weekDay = schedule[i]
    var subj = document.getElementById(i + "")

    for (var j = 0; j < weekDay.length; j++) {
        subj.append(getSubject(weekDay[j], ""))
    }
}
