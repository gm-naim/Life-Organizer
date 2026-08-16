checkLogin();

let userName = localStorage.getItem("userName");
let userEmail = localStorage.getItem("userEmail");

document.getElementById("profileName").textContent = userName;
document.getElementById("profileEmail").textContent = userEmail;
document.getElementById("nameText").textContent = userName;
document.getElementById("emailText").textContent = userEmail;

async function editProfile() {
    const newName = prompt("Enter your new name:", userName);
    if (newName === null || newName.trim() === "") {
        return;
    }

    const newEmail = prompt("Enter your new email:", userEmail);
    if (newEmail === null || newEmail.trim() === "") {
        return;
    }

    const users = await window.lifeOrganizer.getUsers();

    const currentUser = users.find(function (user) {
        return user.email.toLowerCase() === userEmail.toLowerCase();
    });

    if (!currentUser) {
        alert("User not found.");
        return;
    }

    const emailUsed = users.some(function (user) {
        return user.email.toLowerCase() === newEmail.trim().toLowerCase() &&
               user.email.toLowerCase() !== userEmail.toLowerCase();
    });

    if (emailUsed) {
        alert("This email is already used.");
        return;
    }

    const updatedUser = {
        name: newName.trim(),
        email: newEmail.trim().toLowerCase(),
        password: currentUser.password
    };

    const success = await window.lifeOrganizer.updateUser(
        userEmail,
        updatedUser
    );

    if (success) {
        localStorage.setItem("userName", updatedUser.name);
        localStorage.setItem("userEmail", updatedUser.email);

        userName = updatedUser.name;
        userEmail = updatedUser.email;

        document.getElementById("profileName").textContent = userName;
        document.getElementById("profileEmail").textContent = userEmail;
        document.getElementById("nameText").textContent = userName;
        document.getElementById("emailText").textContent = userEmail;

        alert("Profile updated successfully.");
    }
}

async function changePassword() {
    const oldPassword = prompt("Enter your current password:");
    if (oldPassword === null) return;

    const newPassword = prompt("Enter your new password:");
    if (newPassword === null || newPassword === "") return;

    const confirmPassword = prompt("Confirm your new password:");
    if (confirmPassword === null) return;

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    const users = await window.lifeOrganizer.getUsers();

    const currentUser = users.find(function (user) {
        return user.email.toLowerCase() === userEmail.toLowerCase();
    });

    if (!currentUser) {
        alert("User not found.");
        return;
    }

    if (currentUser.password !== oldPassword) {
        alert("Current password is incorrect.");
        return;
    }

    currentUser.password = newPassword;

    const success = await window.lifeOrganizer.updateUser(
        userEmail,
        currentUser
    );

    if (success) {
        alert("Password changed successfully.");
    } else {
        alert("Password change failed.");
    }
}