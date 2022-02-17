import {niceDate} from './base.js';
import {getSchedule} from './baseSchedule.js';

function getTD(text, width) {
    const td = document.createElement('td');
    td.className = "row"
    td.width = width

    let clazz = "containerMark";
    if (width === "150") {
        clazz = "containerSubj"
    } else {
        if (width === "250") {
            clazz = "containerDesc"
        }
    }

    const div = document.createElement('div');
    div.className = clazz
    div.innerHTML = '&nbsp;' + text

    td.append(div)
    return td
}

function getSubject(array, mark, id) {
    const tr = document.createElement('tr');

    tr.append(getTD(array[0], "150"))
    tr.append(getTD(array[1], "250"))
    tr.append(getTD(mark, "30"))
    tr.id = id
    let task = "";
    if (array[1]) {
        task = '<b>Задание: </b> ' + array[1]
    }
    let markT = "";
    if (mark) {
        markT = '<br> <b>Оценка: </b> ' + mark + "</br>"
    }

    if (array[0]) {
        tr.onclick = function () {
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
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            })
            Swal.stopTimer()
        }
    }
    return tr
}

function createSchedule(text) {
    let schedule;
    if (text) {
        schedule = JSON.parse(text)["schedule"]
    }

    for (let i = 0; i <= 5; i++) {
        for (let j = 0; j <= 7; j++) {
            const old = document.getElementById(i + "" + j)
            if (old) {
                old.remove()
            }

            let line = ["", "", ""];
            if (text) {
                line = schedule[i][j]
            }
            document.getElementById(i + "").append(getSubject(line, "", i + "" + j))
        }
    }
}

export function runSchedule() {
    const weekNumber = document.querySelector('input[type="week"]');
    weekNumber.value = niceDate(new Date())

    const json = JSON.parse(sessionStorage.getItem("user"))
    const clazz = json["class"]
    const school = json["school"]

    function schedule() {
        getSchedule(parseInt(weekNumber.value.slice(6, weekNumber.value.length)) + "", clazz, school, createSchedule)
    }

    schedule()
    weekNumber.addEventListener("input", schedule)
}
