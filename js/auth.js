const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");



/* =========================
   SIGN UP
========================= */

if (signupForm) {

    signupForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value;

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("message");


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        const oldUser =
            await window.electronAPI.getUser();


        if (oldUser !== null) {

            message.textContent =
                "An account already exists.";

            return;
        }


        const user = {

            name: name,

            email: email,

            password: password

        };


        await window.electronAPI.saveUser(user);


        message.textContent =
            "Account created successfully!";


        setTimeout(function() {

            window.location.href =
                "login.html";

        }, 1000);

    });

}



/* =========================
   LOGIN
========================= */

if (loginForm) {

    loginForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("message");


        const user =
            await window.electronAPI.getUser();


        if (user === null) {

            message.textContent =
                "No account found. Please sign up first.";

            return;
        }


        if (
            email === user.email &&
            password === user.password
        ) {

            localStorage.setItem(
                "loggedIn",
                "true"
            );


            localStorage.setItem(
                "userName",
                user.name
            );


            window.location.href =
                "dashboard.html";

        } else {

            message.textContent =
                "Wrong email or password.";

        }

    });

}



/* =========================
   DASHBOARD
========================= */

const welcomeName =
    document.getElementById("welcomeName");


if (welcomeName) {

    const name =
        localStorage.getItem("userName");


    if (name) {

        welcomeName.textContent =
            "Welcome, " + name + "!";

    }

}



/* =========================
   LOGOUT
========================= */

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        localStorage.removeItem("loggedIn");

        localStorage.removeItem("userName");

        window.location.href =
            "login.html";

    });

}