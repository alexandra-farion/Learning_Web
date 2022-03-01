import {niceDate, str} from './base.js';
import {getSchedule} from './baseSchedule.js';

function setSwal(tr, title, html) {
    tr.onclick = function () {
        Swal.mixin({
            customClass: {
                cancelButton: 'button'
            },
            buttonsStyling: false
        }).fire({
            title: title,
            html: html,
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

function getSubject(array, mark, id) {
    const subject = array[0]
    const homework = array[1]
    const tr = document.createElement('tr');
    tr.id = id

    let task = "";
    if (homework) {
        task = `<b>Задание: </b> ${homework}</br>`
    }

    let markT = "";
    if (mark) {
        markT = `<br><b>Оценка: </b> ${mark[0]}</br>
                     <b>По теме: </b> ${mark[2]}</br>
                     <b>С весом: </b> ${mark[1]}</br>`
    } else {
        mark = [""]
    }
    tr.insertAdjacentHTML("afterbegin", `<td class="row">
                                                        <div class="containerSubj">${subject}</div>
                                                      </td>
                                                      <td class="row">
                                                        <div class="containerDesc">${homework}</div>
                                                      </td>
                                                      <td class="row" align="center">
                                                        <div class="containerMark">${mark[0]}</div>
                                                      </td>`)

    if (subject) {
        setSwal(tr, subject, task + markT)
    }
    return tr
}

function createSchedule(jsonSchedule, marks) {
    const schedule = JSON.parse(jsonSchedule)["schedule"]

    for (let i = 0; i <= 5; i++) {
        const subjects = []
        const markData = marks[i]
        for (let j = 0; j < markData.length; j++) {
            subjects.push(markData[j][3])
        }

        for (let j = 0; j <= 7; j++) {
            const old = document.getElementById(str(i, j))
            if (old) {
                old.remove()
            }

            const line = schedule[i][j]
            const ind = subjects.indexOf(line[0])
            let mark = ""

            if (ind !== -1 && subjects.length > 0) {
                mark = [markData[ind][0], markData[ind][1], markData[ind][2]]
                delete subjects[ind]
            }
            document.getElementById(str(i)).append(getSubject(line, mark, str(i, j)))
        }
    }
}

export function runSchedule(clazz, school, nickname) {
    const req = new XMLHttpRequest()
    const weekNumber = document.querySelector('input[type="week"]')
    weekNumber.value = niceDate(new Date())

    function schedule() {
        req.open("POST", "get_marks", true)
        req.onload = function () {
            if (req.status === 200) {
                getSchedule(weekNumber.value, clazz, school, createSchedule, JSON.parse(req.responseText)["marks"])
            } else {
                console.log(req.response)
            }
        }
        req.send(JSON.stringify({
            "nickname": nickname,
            "week": weekNumber.value
        }))
    }

    schedule()
    weekNumber.addEventListener("input", schedule)
}
