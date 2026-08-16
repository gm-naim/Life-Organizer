async function signup() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    if (name === "" || email === "" || password === "") {
        message.textContent = "Please fill in all fields.";
        return;
    }

    const user = {
        name: name,
        email: email.toLowerCase(),
        password: password
    };

    const result = await window.lifeOrganizer.createUser(user);

    message.textContent = result.message;

    if (result.success) {
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        setTimeout(function () {
            window.location.href = "login.html";
        }, 800);
    }
}

async function login() {
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    const users = await window.lifeOrganizer.getUsers();

    const user = users.find(function (item) {
        return item.email.toLowerCase() === email &&
               item.password === password;
    });

    if (!user) {
        message.textContent = "Email or password is incorrect.";
        return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("userName", user.name);
    localStorage.setItem("userEmail", user.email);

    window.location.href = "dashboard.html";
}