import {json} from './base.js';

function deserialize(string) {
    string = string.split(" ")
    var arr = string.map(s => parseInt(s))
    var str = ""
    for (var i = 0; i < arr.length;i++) {
        str += String.fromCharCode(arr[i])
    }
    return str
}

var character = deserialize(json.Character)

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("back").onclick = function() {
        if (character === 'Ученик') window.location.href = "main.html";
        if (character === 'Учитель') window.location.href = "main_for_teachers.html";
        if (character === 'Админ') window.location.href = "main_for_admins.html";
    }
});
