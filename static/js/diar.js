import {setResponseForButton, setFuncForButton} from './base.js';
import {runSchedule} from "./schedule.js"

const mainTable = document.getElementById("table")
let curPage = sessionStorage.getItem("html")

const json = JSON.parse(sessionStorage.getItem("user"))
let role = ""

if (json) {
    role = json["role"][1]
    if (!curPage) {
        curPage = role
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

    setResponseForButton("ads", "ads", page)
    setResponseForButton("marks", "student_marks", page)
    setResponseForButton("schedule", "student_schedule", page, runSchedule)
    setFuncForButton("back", function () {
        page(role)
    })
}
