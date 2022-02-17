import {setResponseForButton, setFuncForButton} from './base.js';
import {runSchedule} from "./schedule.js"
import {runScheduling} from "./admin_scheduling.js"

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

    setResponseForButton("ads", page)
    setFuncForButton("back", () => {
        page(role)
    })

    setResponseForButton("student_marks", page)
    setResponseForButton("student_schedule", page)

    setResponseForButton("admin_scheduling", page)
    setResponseForButton("teacher_diary", page)
    setResponseForButton("teacher_grading", page)

    if (document.getElementsByTagName("table").length === 8) {
        switch (json["role"][0]) {
            case "student":
                runSchedule()
                return
            case "admin":
                if (document.getElementsByTagName("button").length !== 25) {
                    runScheduling()
                }
        }
    }
}
