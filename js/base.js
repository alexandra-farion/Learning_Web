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

export var req = new XMLHttpRequest();
// export var json = JSON.parse(document.cookie.match('(^|;) ?user_data=([^;]*)(;|$)')[2].split("\\054").join(",").slice(1, -1).split("'").join('"'))
