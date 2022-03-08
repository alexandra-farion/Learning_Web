import {str} from "./base.js";

function getDate() {
    let yourDate = new Date()
    yourDate = new Date(yourDate.getTime() - (yourDate.getTimezoneOffset() * 60000))
    return yourDate.toISOString().split('T')[0]
}

function swal(title, icon) {
    Swal.fire({
        title: title,
        icon: icon,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: "top"
    })
}

function postData(text, weight, date, subject) {
    const req = new XMLHttpRequest()
    const marksAndStudents = getMarksAndStudents()
    const json = {}

    if (!marksAndStudents) {
        return swal("Некорректные оценки!", "error")
    }
    if (!text) {
        return swal("Некорректное название работы!", "error")
    }

    swal("Сохранено!", "success")

    json["marks"] = marksAndStudents
    json["weight"] = weight
    json["theme"] = text
    json["date"] = date
    json["subject"] = subject

    req.open("POST", "post_marks", true);
    req.onload = null;
    req.send(JSON.stringify(json))
}

function getStudents(clazz, school, date, subject, workName, markWeight) {
    const req = new XMLHttpRequest()
    req.open("POST", "get_students", true);
    req.onload = function () {
        if (req.status === 200) {
            const json = JSON.parse(req.responseText)
            studentsNicks = []

            if (json["theme"]) {
                workName.value = json["theme"]
                markWeight.value = json["weight"]
            } else {
                workName.value = ""
                markWeight.value = "6"
            }
            createStudentsTable(json)
        } else {
            console.log(req.response)
        }
    }
    req.send(JSON.stringify({
        "class": clazz,
        "school": school,
        "date": date,
        "subject": subject
    }))
}

function createStudentsTable(json) {
    const tr = document.getElementById("students")
    const students = json["students"]
    const marks = json["marks"]

    for (let i = 0; i < 666; i++) {
        let oldTr = document.getElementById(str(i));
        if (oldTr) {
            oldTr.remove()
        } else {
            break
        }
    }

    for (let i = 0; i < students.length; i++) {
        let mark = marks[i];
        if (!mark) {
            mark = ""
        }
        studentsNicks.push(students[i][0])
        tr.insertAdjacentHTML('afterend', `<tr id="${i}">
                                                            <td>
                                                                <i">${students[i][1]}</i>
                                                            </td>
                                                            <td align="center">
                                                                <label>
                                                                    <input type='text' size="1" id="in${i}" value="${marks[i]}">
                                                                </label>
                                                            </td>
                                                        </tr>`)
    }
}

function getMarksAndStudents() {
    const marks = []

    for (let i = 0; i < 666; i++) {
        const markInput = document.getElementById("in" + i)
        if (markInput) {
            const markValue = markInput.value
            if (markValue) {
                if (markValue.length === 1 && (/[2-5]/.test(markValue))) {
                    marks.push([studentsNicks[i], markValue])
                } else {
                    return null
                }
            } else {
                marks.push([studentsNicks[i], 0])
            }
        } else {
            return marks
        }
    }
}

let studentsNicks

export function runGrading(school, subject) {
    function students() {
        getStudents(classInput.value, school, dateInput.value, subject, workName, markWeight)
    }

    const classInput = document.getElementById("class")
    const dateInput = document.querySelector('input[type="date"]')
    const workName = document.querySelector('input[type="text"]')
    const markWeight = document.getElementById("weight")

    document.getElementById("save").onclick = function () {
        postData(workName.value, markWeight.value, dateInput.value, subject)
    }

    classInput.addEventListener("input", students)

    dateInput.value = getDate()
    dateInput.addEventListener("input", students)

    students()
}
