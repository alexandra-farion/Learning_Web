import {niceDate, str} from "./base.js"
import {setSwal} from './base_schedule.js'

function getLessonContainer(id, clazz, subject, classroom, homework) {
    const lessonContainer = document.createElement("tr")
    lessonContainer.id = id
    lessonContainer.innerHTML = `
                    <td class="row" align="center">
                        <div style="width: 30px"><i>${clazz}</i></div>
                    </td>
                    <td class="row" align="center">
                        <div class="container" style="width: 75px"><i>${classroom}</i></div>
                    </td>                   
                    <td class="row">
                        <div class="container" style="width: 200px"><i>${subject}</i></div>
                    </td>          
                    <td class="row">
                        <div class="container" style="width: 200px"><i>${homework}</i></div>
                    </td>`
    if (clazz) {
        lessonContainer.innerHTML += `  <td class="row">
                                            <button class="button_add_task" id="${str("button", id)}"><i>Добавить дз</i></button>
                                        </td>`
        setSwal(lessonContainer, subject, ` <b>Класс: </b> ${clazz}</br>
                                                  <b>Кабинет: </b> ${classroom.split(" ").pop()}</br>
                                                  <b>Задание: </b> ${homework}</br>`)
    } else {
        lessonContainer.innerHTML += `
                    <td class="row">
                        <div class="container" style="width: 140px"></div>
                    </td>`
    }
    return lessonContainer
}

function createSchedule(schedule) {
    for (let i = 0; i < 6; i++) {
        const day = document.getElementById(str(i))

        for (let j = 0; j < 8; j++) {
            const lesson = schedule[i][j]

            const lessonLine = document.getElementById(str(i, j))
            if (lessonLine) {
                lessonLine.remove()
            }
            day.append(getLessonContainer(str(i, j), lesson[0], lesson[1], lesson[2], lesson[3]))

            const button = document.getElementById(str("button", i, j))
            if (button) {
                button.onclick = function (event) {
                    event.stopPropagation()
                    event.cancelBubble = true
                }
            }
        }
    }
}

export function runTeacherSchedule(fixed_classes, school) {
    const req = new XMLHttpRequest()
    const weekNumber = document.querySelector('input[type="week"]')
    weekNumber.value = niceDate(new Date())

    function schedule() {
        req.open("POST", "get_teacher_schedule", true)
        req.onload = function () {
            if (req.status === 200) {
                createSchedule(JSON.parse(req.responseText))
            } else {
                console.log(req.response)
            }
        }
        req.send(JSON.stringify({
            "fixed_classes": fixed_classes,
            "week": weekNumber.value,
            "school": school
        }))
    }

    schedule()
    weekNumber.addEventListener("input", schedule)
}
