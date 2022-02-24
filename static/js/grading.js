function getDate() {
    let yourDate = new Date();
    yourDate = new Date(yourDate.getTime() - (yourDate.getTimezoneOffset() * 60000))
    return yourDate.toISOString().split('T')[0]
}

export function runGrading() {
    const weekControl = document.querySelector('input[type="date"]');
    weekControl.value = getDate()

    document.getElementById("save").onclick = function () {
        Swal.fire({
            title: "Сохранено!",
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top"
        })
    }
}
