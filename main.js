const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");


// =====================================================
// DATA FILE
// =====================================================

const dataFolder = path.join(__dirname, "data");
const dataFile = path.join(dataFolder, "data.json");


// =====================================================
// CREATE DATA FOLDER
// =====================================================

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}


// =====================================================
// DEFAULT DATA
// =====================================================

const defaultData = {
    users: []
};


// =====================================================
// CREATE DATA FILE
// =====================================================

if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(defaultData, null, 2)
    );
}


// =====================================================
// READ DATA
// =====================================================

function readData() {

    try {

        const text = fs.readFileSync(
            dataFile,
            "utf-8"
        );

        const data = JSON.parse(text);

        if (!data.users) {
            data.users = [];
        }

        return data;

    } catch (error) {

        console.log("Data read error:", error);

        return {
            users: []
        };
    }
}


// =====================================================
// SAVE DATA
// =====================================================

function saveData(data) {

    try {

        fs.writeFileSync(
            dataFile,
            JSON.stringify(data, null, 2)
        );

        return true;

    } catch (error) {

        console.log("Data save error:", error);

        return false;
    }
}


// =====================================================
// CREATE WINDOW
// =====================================================

function createWindow() {

    const win = new BrowserWindow({

        width: 1200,
        height: 800,

        minWidth: 900,
        minHeight: 600,

        webPreferences: {

            preload: path.join(
                __dirname,
                "preload.js"
            ),

            contextIsolation: true,
            nodeIntegration: false
        }
    });


    win.loadFile(
        path.join(
            __dirname,
            "pages",
            "login.html"
        )
    );
}


// =====================================================
// APP READY
// =====================================================

app.whenReady().then(() => {

    createWindow();

    app.on("activate", () => {

        if (
            BrowserWindow.getAllWindows().length === 0
        ) {

            createWindow();
        }
    });
});


// =====================================================
// CLOSE APP
// =====================================================

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }
});


// =====================================================
// GET ALL USERS
// =====================================================

ipcMain.handle(
    "get-users",
    () => {

        const data = readData();

        return data.users;
    }
);


// =====================================================
// CREATE USER
// =====================================================

ipcMain.handle(
    "create-user",
    (event, user) => {

        return createUser(user);
    }
);


// =====================================================
// SAVE USER
// =====================================================

ipcMain.handle(
    "save-user",
    (event, user) => {

        return createUser(user);
    }
);


// =====================================================
// CREATE USER FUNCTION
// =====================================================

function createUser(user) {

    const data = readData();


    if (!user) {

        return {
            success: false,
            message: "Invalid user data."
        };
    }


    const name =
        String(user.name || "").trim();

    const email =
        String(user.email || "").trim();

    const password =
        String(user.password || "");


    if (!name || !email || !password) {

        return {
            success: false,
            message: "All fields are required."
        };
    }


    // ================================================
    // CHECK DUPLICATE EMAIL
    // ================================================

    const exists = data.users.some(
        existingUser =>

            String(existingUser.email)
                .toLowerCase()
            ===
            email.toLowerCase()
    );


    if (exists) {

        return {
            success: false,
            message:
                "This email is already registered."
        };
    }


    // ================================================
    // CREATE USER
    // ================================================

    const newUser = {

        name: name,

        email: email,

        password: password,

        documents: [],

        borrowItems: [],

        warranties: [],

        reminders: [],

        trash: []
    };


    data.users.push(newUser);


    const saved = saveData(data);


    if (!saved) {

        return {
            success: false,
            message: "Could not save account."
        };
    }


    return {
        success: true,
        message: "Account created successfully."
    };
}


// =====================================================
// GET ONE USER
// =====================================================

ipcMain.handle(
    "get-user",
    (event, email) => {

        const data = readData();


        if (!email) {
            return null;
        }


        const user = data.users.find(
            item =>

                String(item.email)
                    .toLowerCase()
                ===
                String(email)
                    .toLowerCase()
        );


        if (!user) {
            return null;
        }


        // Make sure old accounts also have these

        if (!user.documents) {
            user.documents = [];
        }

        if (!user.borrowItems) {
            user.borrowItems = [];
        }

        if (!user.warranties) {
            user.warranties = [];
        }

        if (!user.reminders) {
            user.reminders = [];
        }

        if (!user.trash) {
            user.trash = [];
        }


        return user;
    }
);


// =====================================================
// SAVE USER FIELD
// =====================================================

ipcMain.handle(
    "save-user-data",
    (event, email, field, value) => {

        const data = readData();


        const userIndex = data.users.findIndex(
            user =>

                String(user.email)
                    .toLowerCase()
                ===
                String(email)
                    .toLowerCase()
        );


        if (userIndex === -1) {
            return false;
        }


        const allowedFields = [

            "documents",
            "borrowItems",
            "warranties",
            "reminders",
            "trash"

        ];


        if (!allowedFields.includes(field)) {
            return false;
        }


        data.users[userIndex][field] = value;


        return saveData(data);
    }
);


// =====================================================
// UPDATE USER
// =====================================================

ipcMain.handle(
    "update-user",
    (event, oldEmail, updatedUser) => {

        const data = readData();


        const userIndex = data.users.findIndex(
            user =>

                String(user.email)
                    .toLowerCase()
                ===
                String(oldEmail)
                    .toLowerCase()
        );


        if (userIndex === -1) {
            return false;
        }


        // ==============================================
        // CHECK EMAIL DUPLICATE
        // ==============================================

        const duplicateEmail =
            data.users.some(
                (user, index) => {

                    return (

                        index !== userIndex

                        &&

                        String(user.email)
                            .toLowerCase()
                        ===
                        String(updatedUser.email)
                            .toLowerCase()

                    );
                }
            );


        if (duplicateEmail) {
            return false;
        }


        // ==============================================
        // KEEP EXISTING FEATURE DATA
        // ==============================================

        const oldUser =
            data.users[userIndex];


        data.users[userIndex] = {

            name:
                updatedUser.name,

            email:
                updatedUser.email,

            password:
                updatedUser.password,

            documents:
                oldUser.documents || [],

            borrowItems:
                oldUser.borrowItems || [],

            warranties:
                oldUser.warranties || [],

            reminders:
                oldUser.reminders || [],

            trash:
                oldUser.trash || []
        };


        return saveData(data);
    }
);


// =====================================================
// DELETE USER
// =====================================================

ipcMain.handle(
    "delete-user",
    (event, email) => {

        const data = readData();


        const oldLength =
            data.users.length;


        data.users =
            data.users.filter(
                user =>

                    String(user.email)
                        .toLowerCase()
                    !==
                    String(email)
                        .toLowerCase()
            );


        if (
            data.users.length === oldLength
        ) {

            return false;
        }


        return saveData(data);
    }
);


// =====================================================
// GET COMPLETE DATA
// =====================================================

ipcMain.handle(
    "get-data",
    () => {

        return readData();
    }
);


// =====================================================
// SAVE COMPLETE DATA
// =====================================================

ipcMain.handle(
    "save-data",
    (event, data) => {

        return saveData(data);
    }
);


console.log(
    "Life Organizer started successfully."
);