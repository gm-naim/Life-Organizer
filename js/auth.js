const signupForm =
    document.getElementById("signupForm");

const loginForm =
    document.getElementById("loginForm");


// =================================
// SIGN UP
// =================================

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const confirmPassword =
                document.getElementById(
                    "confirmPassword"
                ).value;

            const message =
                document.getElementById("message");


            // Check password

            if (password !== confirmPassword) {

                message.textContent =
                    "Passwords do not match.";

                return;
            }


            // Get all users

            const users =
                await window.electronAPI.getUsers();


            // Check if email already exists

            const emailExists =
                users.some(function(user) {

                    return user.email.toLowerCase()
                        === email.toLowerCase();

                });


            if (emailExists) {

                message.textContent =
                    "This email is already registered.";

                return;
            }


            // Create new user

            const newUser = {

                name: name,

                email: email,

                password: password

            };


            // Save new user

            await window.electronAPI.saveUser(
                newUser
            );


            message.style.color = "green";

            message.textContent =
                "Account created successfully!";


            // Go to login page

            setTimeout(function() {

                window.location.href =
                    "login.html";

            }, 1000);

        }
    );

}


// =================================
// LOGIN
// =================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;

            const message =
                document.getElementById("message");


            // Get all users

            const users =
                await window.electronAPI.getUsers();


            // Find matching user

            const user =
                users.find(function(user) {

                    return (
                        user.email.toLowerCase()
                        === email.toLowerCase()
                        &&
                        user.password === password
                    );

                });


            // Login successful

            if (user) {

                localStorage.setItem(
                    "loggedIn",
                    "true"
                );


                localStorage.setItem(
                    "userName",
                    user.name
                );


                localStorage.setItem(
                    "userEmail",
                    user.email
                );


                window.location.href =
                    "dashboard.html";

            }

            else {

                message.textContent =
                    "Wrong email or password.";

            }

        }
    );

}