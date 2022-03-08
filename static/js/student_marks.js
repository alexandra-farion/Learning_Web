import {str} from './base.js';

function createReport(jsonReport) {
    const table = document.getElementById("markTable")
    let maxLen = -42636
    let id = 0
    for (let subject in jsonReport) {
        const marks = jsonReport[subject]
        let tr = document.getElementById(str(id))
        if (!tr) {
            tr = document.createElement("tr")
        }
        tr.innerHTML = `<td bgcolor="#ffffff"><i>${subject}</i></td>`
        if (marks.length > maxLen) {
            maxLen = marks.length
        }
        for (let i = 0; i < maxLen; i++) {
            const mark = marks[i]
            tr.insertAdjacentHTML("beforeend", `<td align="center" bgcolor="#ffffff"><i>${mark}</i></td>`)
        }
        table.append(tr)

        id += 1
    }
}

export function runMarks(nickname) {
    const req = new XMLHttpRequest()
    req.open("POST", "get_mark_report", true)
    req.onload = function () {
        if (req.status === 200) {
            createReport(JSON.parse(req.responseText))
        } else {
            console.log(req.response)
        }
    }
    req.send(JSON.stringify({
        "nickname": nickname
    }))
}
