import {setResponseForButton, setFuncForButton} from './base.js';
import {runSchedule} from "./schedule.js"
import {runScheduling} from "./admin_scheduling.js"
import {runGrading} from "./grading.js"
import {runMarks} from "./student_marks.js"
import {runTeacherSchedule} from "./teacher_schedule.js"

const mainTable = document.getElementById("table")
let curPage = sessionStorage.getItem("html")

const json = JSON.parse(sessionStorage.getItem("user"))
const school = json["school"]
const nickname = json["nickname"]
const character = json["character"]

const clazz = json["class"]
const grouping = json["grouping"]

const fixed_classes = json["fixed_classes"]
let htmlPage = ""

if (json) {
    htmlPage = character[1]
    if (!curPage) {
        curPage = htmlPage
    }
    page(curPage)
} else {
    window.location.href = "/";
}

function newPage(html) {
    let newTable = document.getElementById("optional_table")
    if (newTable) {
        newTable.remove()
    }

    newTable = document.createElement("table")
    newTable.id = "optional_table"
    newTable.className = "table"
    newTable.innerHTML = html
    mainTable.after(newTable)

    return newTable
}

function page(html) {
    sessionStorage.setItem("html", html)
    newPage(html)

    setResponseForButton("ads", page)
    setFuncForButton("back", () => {
        page(htmlPage)
    })

    setResponseForButton("student_marks", page)
    setResponseForButton("student_schedule", page)

    setResponseForButton("admin_scheduling", page)
    setResponseForButton("teacher_diary", page)
    setResponseForButton("teacher_grading", page)

    const studentSchedule = document.getElementById("studentSchedule")
    if (studentSchedule) {
        runSchedule(clazz, school, nickname, grouping)
        return
    }

    const adminScheduling = document.getElementById("adminScheduling")
    if (adminScheduling) {
        runScheduling(school)
        return
    }

    const markWeight = document.getElementById("weight")
    if (markWeight) {
        runGrading(school, fixed_classes)
        return
    }

    const tableMarkReport = document.getElementById("markTable")
    if (tableMarkReport) {
        runMarks(nickname)
        return
    }

    const teacherTable = document.getElementById("teacherTable")
    if (teacherTable) {
        runTeacherSchedule(fixed_classes, school)
    }
}
