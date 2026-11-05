const API = "http://localhost:5000";

// Register
async function register() {
    let res = await fetch(API + "/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            password: password.value
        })
    });
    alert(await res.text());
}

// Login
async function login() {
    let res = await fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    });

    if (!res.ok) return alert(await res.text());

    let data = await res.json();
    sessionStorage.setItem("token", data.token);
    location.href = "dashboard.html";
}

// Profile and Courses
async function load() {
    let token = sessionStorage.getItem("token");
    if (!token) return location.href = "index.html";

    let headers = {Authorization: "Bearer " + token};

    let p = await fetch(API + "/profile", {headers});
    if (!p.ok) return logout();

    let s = await p.json();
    document.getElementById("profile").innerText =
        s.name + " - " + s.email;

    let c = await fetch(API + "/courses", {headers});
    let list = await c.json();

    list.forEach(x => {
        document.getElementById("courses").innerHTML +=
            `<li>${x}</li>`;
    });
}

// Logout
function logout() {
    sessionStorage.removeItem("token");
    location.href = "index.html";
}

if (location.pathname.endsWith("dashboard.html")) load();