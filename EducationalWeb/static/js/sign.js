const nickname = document.getElementById("surname")
const password = document.getElementById("password")
const school = document.getElementById("schools")
const req = new XMLHttpRequest()

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

document.getElementById("enter_button").onclick = function () {
    if (nickname.value && password.value) {
        req.open("POST", "enter", true)
        req.onload = function () {
            if (req.status === 404) {
                console.log(req.response)
                toast()
            }
            if (req.status === 200) {
                console.log(req.responseText)
                sessionStorage.setItem("user", req.responseText)
                window.location.href = "diary"
            }
        }
        req.send(JSON.stringify({"school": school.value, "nickname": nickname.value, "password": password.value}))
    } else {
        toast()
    }
}

sessionStorage.clear()