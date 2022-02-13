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
            req.open("POST", "enter", true);
            req.onload = function () {
                if (req.status === 200) {
                    sessionStorage.setItem("user", req.responseText)
                    window.location.href = "diary";
                } else {
                    console.log(req.response)
                    toast()
                }
            }
            req.send(JSON.stringify({"school": school.value, "surname": surname.value, "password": password.value}));
        } else {
            toast()
        }
    };
});
