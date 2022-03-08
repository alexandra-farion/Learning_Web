const req = new XMLHttpRequest()

export function getSchedule(date, clazz, school, func) {
    const argument = arguments[arguments.length - 1]

    req.open("POST", "get_schedule", true);
    req.onload = function () {
        if (req.status === 200) {
            func(JSON.parse(req.responseText), argument)
        } else {
            console.log(req.response)
        }
    }
    req.send(JSON.stringify({
        "class": clazz,
        "school": school,
        "week": date
    }))
}
