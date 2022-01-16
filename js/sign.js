var surname = document.getElementById("surname")
var password = document.getElementById("password")
var school = document.getElementById("schools")
var req = new XMLHttpRequest();

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("enter_button").onclick = function() {
    if (surname.value != "" && password.value != "") {
        req.open("GET", "enter/" + surname.value + "/" + password.value + "/" + school.value, false);
        req.send(null);

        var str = req.responseText.substr(1, req.responseText.length-2)
        if (str === 'Ученик') window.location.href = "main.html";
        if (str === 'Учитель') window.location.href = "main_for_teachers.html";
        if (str === 'Админ') window.location.href = "main_for_admins.html";

        Swal.fire({
            title: "Неверные ЛОГИН или ПАРОЛЬ!",
            icon: 'error',
            timer: 2500,
            timerProgressBar: true,
            showConfirmButton: false,
            toast: true,
            position: "top"
        })
    }
  };
});
