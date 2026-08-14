// =================================
// GET CURRENT EMAIL
// =================================

function getCurrentEmail() {

    return localStorage.getItem(
        "userEmail"
    );
}


// =================================
// GET CURRENT USER
// =================================

async function getCurrentUser() {

    const email =
        getCurrentEmail();

    if (!email) {
        return null;
    }

    return await window.electronAPI.getUser(
        email
    );
}


// =================================
// SAVE USER FIELD
// =================================

async function saveField(
    field,
    value
) {

    const email =
        getCurrentEmail();

    return await window.electronAPI.saveUserData(
        email,
        field,
        value
    );
}


// =================================
// LOGOUT
// =================================

function logout() {

    localStorage.removeItem(
        "loggedIn"
    );

    localStorage.removeItem(
        "userName"
    );

    localStorage.removeItem(
        "userEmail"
    );

    window.location.href =
        "login.html";
}