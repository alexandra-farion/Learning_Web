import {niceDate, str} from './base.js'
import {getSchedule, setSwal} from './base_schedule.js'

function getSubject(array, mark, id) {
    const subject = array[0]
    const homework = array[1]
    let html = ""
    const tr = document.createElement('tr');
    tr.id = id

    if (homework) {
        html += `<b>Задание: </b> ${homework}</br>`
    }
    if (mark[0]) {
        html += `<br><b>Оценка: </b> ${mark[0]}</br>
                     <b>Тип работы: </b> ${mark[2]}</br>
                     <b>Вес: </b> ${mark[1]}</br>`
    }

    tr.insertAdjacentHTML("afterbegin", `<td class="row">
                                                        <div class="container" style="width: 150px"><i>${subject}</i></div>
                                                      </td>
                                                      <td class="row">
                                                        <div class="container" style="width: 250px"><i>${homework}</i></div>
                                                      </td>
                                                      <td class="row" align="center">
                                                        <div class="container" style="width: 35px"><i>${mark[0]}</i></div>
                                                      </td>`)

    if (subject) {
        setSwal(tr, subject, html)
    }
    return tr
}

function createSchedule(schedule, marks) {
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
            let mark = [""]

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
                getSchedule(weekNumber.value, clazz, school, createSchedule, JSON.parse(req.responseText))
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
