import {deserialize, json} from './base.js';

function getDate() {
    var yourDate = new Date()
    var offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    return yourDate.toISOString().split('T')[0]
}

var character = deserialize(json.Character)

var weekControl = document.querySelector('input[type="date"]');
weekControl.value = getDate()

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("back").onclick = function() {
        if (character === 'Учитель') window.location.href = "main_for_teachers.html";
        if (character === 'Админ') window.location.href = "main_for_admins.html";
    }

    document.getElementById("save").onclick = function() {
        Swal.fire({
            title: "Сохранено!",
            icon: 'success',
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: "top"
        })
    }
});
