import {getWeekNumber, niceDate, req} from './base.js';

function setSubject(subject, id) {
    const tr = document.createElement('tr');
    tr.id = id
    tr.className = "edit"
    tr.innerHTML = '<td bgcolor="#ffffff"><input type="text" class="text" value="' + subject + '"><br></td>'
    return tr
}

function createSchedule(text) {
    let schedule;
    if (text) {
        schedule = JSON.parse(text).schedule
    }

    for (let i = 0; i <= 5; i++) {
        for (let j = 0; j <= 7; j++) {
            const old = document.getElementById(i + "" + j)
            if (old) {
                old.remove()
            }

            let subject = "";
            if (text) {
                subject = schedule[i][j][0]
            }
            document.getElementById(i + "").append(setSubject(subject, i + "" + j))
        }
    }
}

function getSchedule(date) {
    req.open("GET", "get_schedule/" + school + "/" + classInput.value + "/" + date, true);
    req.onload = function (e) {
        if (req.status === 200) {
            createSchedule(req.responseText)
        } else {
            createSchedule(null)
        }
    };
    req.send(null);
}

const inputs = document.getElementsByTagName("input")
const classInput = document.querySelector('input[type="text"]');
const weekNumber = document.querySelector('input[type="week"]');
weekNumber.value = niceDate(new Date())

const cookie = JSON.parse('"' + JSON.parse(document.cookie.match(/Student=(.+?)(;|$)/)[1]) + '"').split(" ")
const school = cookie.slice(1, cookie.length - 1).join(" ")

getSchedule(getWeekNumber(new Date()))

document.addEventListener("DOMContentLoaded", function () {
    weekNumber.addEventListener("input", function () {
        getSchedule(parseInt(weekNumber.value.slice(6, weekNumber.value.length)))
    })
    document.getElementById("change").onclick = function () {
        const clazz = classInput.value;

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
        const week = parseInt(weekNumber.value.slice(6, weekNumber.value.length))

        for (let i = 2; i < inputs.length; i++) {
            schedule[day][numSubj] = inputs[i].value

            numSubj += 1
            if (numSubj === 8) {
                day += 1
                numSubj = 0
            }
        }

        req.open("POST", "/post_schedule", true);
        req.onload = function (e) {
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
                console.log(req.responseText)
            }
        };
        req.send(JSON.stringify({
            "Schedule": [schedule[0], schedule[2], schedule[4], schedule[1], schedule[3], schedule[5]],
            "Class": clazz.toUpperCase(), "Week": week, "School": school
        }));
    }
});
