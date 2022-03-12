import {niceDate, req, str} from './base.js';
import {getSchedule} from './baseSchedule.js';

function setSubject(subject, id) {
    const tr = document.createElement('tr');
    tr.id = id
    tr.innerHTML = `<th style="border: #F9F2DC"><input type="text" value="${subject}"></th>`
    return tr
}

function createSchedule(schedule) {
    for (let i = 0; i <= 5; i++) {
        for (let j = 0; j <= 7; j++) {
            const old = document.getElementById(str(i, j))
            if (old) {
                old.remove()
            }

            const subject = schedule[i][j][0]
            document.getElementById(str(i)).append(setSubject(subject, str(i, j)))
        }
    }
}

export function runScheduling(school) {
    function schedule() {
        getSchedule(weekNumber.value, classSelect.value, school, createSchedule)
    }

    const inputs = document.getElementsByTagName("input")
    const classSelect = document.getElementById("class")
    const weekNumber = document.querySelector('input[type="week"]')
    weekNumber.value = niceDate(new Date())

    schedule()
    weekNumber.addEventListener("input", schedule)
    classSelect.addEventListener("input", schedule)

    document.getElementById("change").onclick = function () {
        const clazz = classSelect.value;

        if (clazz.length > 3 || clazz.length <= 1 || !(/[0-9]/.test(clazz)) || !(/[а-яё]/i.test(clazz))) {
            Swal.fire({
                title: "Введён некорректный класс!",
                icon: 'error',
                timer: 2500,
                showConfirmButton: false,
                toast: true,
                position: "top"
            })
            return
        }

        const schedule = [[], [], [], [], [], []];
        let numSubj = 0;
        let day = 0;

        for (let i = 1; i < inputs.length; i++) {
            schedule[day][numSubj] = inputs[i].value

            numSubj += 1
            if (numSubj === 8) {
                day += 1
                numSubj = 0
            }
        }

        req.open("POST", "post_schedule", true);
        req.onload = function () {
            if (req.status === 200) {
                Swal.fire({
                    title: "Сохранено!",
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: "top"
                })
            } else {
                console.log(req.response)
            }
        }
        req.send(JSON.stringify({
            "schedule": [schedule[0], schedule[2], schedule[4], schedule[1], schedule[3], schedule[5]],
            "class": clazz.toUpperCase(),
            "week": weekNumber.value,
            "school": school
        }))
    }
}
