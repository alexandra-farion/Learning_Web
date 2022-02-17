import {req} from "./base.js";

export function getSchedule(date, clazz, school, func) {
    req.open("POST", "get_schedule", true);
    req.onload = function () {
        if (req.status === 200) {
            func(req.responseText)
        } else {
            func(null)
            console.log(req.response)
        }
    };
    req.send(JSON.stringify({
        "class": clazz,
        "school": school,
        "week": date
    }));
}
