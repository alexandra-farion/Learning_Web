const json = JSON.parse(sessionStorage.getItem("user"))
const role = json["role"]

const table = document.getElementById("table")
const newTable = document.createElement("table")
newTable.id = role[0] + "_table"

switch (role[0]) {
    case "student":
        newTable.innerHTML = role[1]
        table.after(newTable)
}
