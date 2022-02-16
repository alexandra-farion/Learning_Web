export function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

export function niceDate(d) {
    let weekNo = getWeekNumber(d);
    if (weekNo < 10) {
        weekNo = String(0) + String(weekNo)
    }
    return String(d.getFullYear()) + "-W" + weekNo;
}

export function setResponseForButton() {
    const args = arguments
    setFuncForButton(args[0], function () {
        req.open("POST", "html", true);
        req.onload = function () {
            if (req.status === 200) {
                for (let i = 2; i < args.length; i++) {
                    args[i](req.response);
                }
                return
            }
            console.log(req.response)
        }
        req.send(JSON.stringify({"html": args[1]}));
    })
}

export function setFuncForButton(buttonName, func) {
    const button = document.getElementById(buttonName)
    if (button) {
        button.onclick = func
    }
}

export var req = new XMLHttpRequest();
