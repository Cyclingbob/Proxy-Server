function login(e){
    e.preventDefault()
    fetch("/panel/login", {
        method: "POST",
        body: JSON.stringify({
            password: e.target[0].value
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(data => data.text()).then(data => {
        if(data === "ok") window.location = "/panel"
    })
}

document.getElementById("login-form").addEventListener("submit", login)
