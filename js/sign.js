const surname = document.getElementById("surname")
const password = document.getElementById("password")
const school = document.getElementById("schools")
const req = new XMLHttpRequest();

function toast() {
    Swal.fire({
        title: "Неверные ЛОГИН или ПАРОЛЬ!",
        icon: 'error',
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top"
    })
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("enter_button").onclick = function () {
        if (surname.value && password.value) {
            req.open("GET", "enter/" + surname.value + "/" + password.value + "/" + school.value, false);
            req.send(null);

            const answer = req.responseText.substr(1, req.responseText.length - 2);
            if (answer === 'Student') {
                window.location.href = "student_main.html";
            } else {
                if (answer === 'Teacher') {
                    window.location.href = "teacher_main.html";
                } else {
                    if (answer === 'Admin') {
                        window.location.href = "admin_main.html";
                    } else {
                        toast()
                    }
                }
            }
        } else {
            toast()
        }
    };
});