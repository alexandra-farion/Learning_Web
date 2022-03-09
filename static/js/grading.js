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

function postData(text, weight, date) {
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
    json["subject"] = currentSubject

    req.open("POST", "post_marks", true);
    req.onload = null;
    req.send(JSON.stringify(json))
}

function getStudents(clazz, school, date, workName, markWeight) {
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
        "subject": currentSubject
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

function addSubjectSelect(subjects, func) {
    if (subjects.length > 1) {
        let selectSubjects = document.getElementById("subject")

        if (!selectSubjects) {
            document.getElementById("titles").insertAdjacentHTML("beforeend", `<td align="center"><i>Предмет</i></td>`)

            let selectSubjectsHTML = `<td align="center">
                                            <label for="subject">
                                                <select id="subject" style="width: 100%">`
            for (let i = 0; i < subjects.length; i++) {
                selectSubjectsHTML += `<option>${subjects[i]}</option>`
            }

            document.getElementById("inputs").insertAdjacentHTML("beforeend", selectSubjectsHTML + `</select></label></td>`)
            selectSubjects = document.getElementById("subject")
            selectSubjects.addEventListener("input", () => {
                currentSubject = selectSubjects.value
                func()
            })
        }
    }

    currentSubject = subjects[0]
}

let studentsNicks
let currentSubject

export function runGrading(school, subjects) {
    function students() {
        getStudents(classInput.value, school, dateInput.value, workName, markWeight)
    }

    const classInput = document.getElementById("class")
    const dateInput = document.querySelector('input[type="date"]')
    const workName = document.querySelector('input[type="text"]')
    const markWeight = document.getElementById("weight")

    addSubjectSelect(subjects, students)

    document.getElementById("save").onclick = function () {
        postData(workName.value, markWeight.value, dateInput.value)
    }

    classInput.addEventListener("input", students)

    dateInput.value = getDate()
    dateInput.addEventListener("input", students)

    students()
}
