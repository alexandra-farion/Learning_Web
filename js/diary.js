import {deserialize, getWeekNumber, niceDate, req, json} from './base.js';

var character = deserialize(json.Character)

var weekControl = document.querySelector('input[type="week"]');
weekControl.value = niceDate(new Date())

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("back").onclick = function() {
        if (character === 'Учитель') window.location.href = "main_for_teachers.html";
        if (character === 'Админ') window.location.href = "main_for_admins.html";
    }
});
