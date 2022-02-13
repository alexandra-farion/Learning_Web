const req = new XMLHttpRequest();

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("ads").onclick = function () {
        req.open("POST", "enter", true);
        req.onload = function () {
            if (req.status === 200) {
                document.getElementById('html').innerHTML = req.response
            } else {
                toast()
            }
        }
        req.send(JSON.stringify({"school": school.value, "surname": surname.value, "password": password.value}));
    }
})
