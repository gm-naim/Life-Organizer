const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

// ======================================================
// DATA FILE
// ======================================================

const dataFolder = path.join(__dirname, "data");
const dataFile = path.join(dataFolder, "data.json");


// ======================================================
// CREATE DATA FOLDER
// ======================================================

if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
}


// ======================================================
// CREATE DATA FILE
// ======================================================

if (!fs.existsSync(dataFile)) {

    const defaultData = {

        users: [],

        documents: [],

        borrowItems: [],

        warranties: [],

        reminders: [],

        trash: []

    };

    fs.writeFileSync(
        dataFile,
        JSON.stringify(defaultData, null, 2)
    );
}


// ======================================================
// READ DATA
// ======================================================

function readData() {

    try {

        const fileData =
            fs.readFileSync(
                dataFile,
                "utf-8"
            );

        return JSON.parse(fileData);

    } catch (error) {

        console.log(
            "Error reading data:",
            error
        );

        return {

            users: [],

            documents: [],

            borrowItems: [],

            warranties: [],

            reminders: [],

            trash: []

        };

    }

}


// ======================================================
// SAVE DATA
// ======================================================

function saveData(data) {

    try {

        fs.writeFileSync(
            dataFile,
            JSON.stringify(data, null, 2)
        );

        return true;

    } catch (error) {

        console.log(
            "Error saving data:",
            error
        );

        return false;

    }

}


// ======================================================
// CREATE ELECTRON WINDOW
// ======================================================

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


    // ==============================================
    // LOAD LOGIN PAGE
    // ==============================================

    win.loadFile(
        path.join(
            __dirname,
            "pages",
            "login.html"
        )
    );


    // ==============================================
    // OPTIONAL DEVTOOLS
    // ==============================================

    // win.webContents.openDevTools();

}


// ======================================================
// APP READY
// ======================================================

app.whenReady().then(() => {

    createWindow();


    app.on(
        "activate",
        () => {

            if (
                BrowserWindow
                    .getAllWindows()
                    .length === 0
            ) {

                createWindow();

            }

        }
    );

});


// ======================================================
// CLOSE APP
// ======================================================

app.on(
    "window-all-closed",
    () => {

        if (
            process.platform !== "darwin"
        ) {

            app.quit();

        }

    }
);


// ======================================================
// GET ALL USERS
// ======================================================

ipcMain.handle(
    "get-users",
    () => {

        const data = readData();

        return data.users || [];

    }
);


// ======================================================
// SAVE NEW USER
// ======================================================

ipcMain.handle(
    "save-user",
    (event, user) => {

        const data = readData();


        if (!user) {

            return {

                success: false,

                message: "Invalid user data."

            };

        }


        if (
            !user.name ||
            !user.email ||
            !user.password
        ) {

            return {

                success: false,

                message: "All fields are required."

            };

        }


        // ==========================================
        // CHECK DUPLICATE EMAIL
        // ==========================================

        const emailExists =
            data.users.some(
                existingUser =>

                    existingUser.email
                        .toLowerCase()
                    ===
                    user.email
                        .toLowerCase()
            );


        if (emailExists) {

            return {

                success: false,

                message:
                    "This email is already registered."

            };

        }


        // ==========================================
        // ADD USER
        // ==========================================

        data.users.push({

            name:
                user.name.trim(),

            email:
                user.email.trim(),

            password:
                user.password

        });


        saveData(data);


        return {

            success: true,

            message:
                "Account created successfully."

        };

    }
);


// ======================================================
// UPDATE USER
// ======================================================

ipcMain.handle(
    "update-user",
    (event, oldEmail, updatedUser) => {

        const data = readData();


        if (
            !oldEmail ||
            !updatedUser
        ) {

            return false;

        }


        // ==========================================
        // FIND USER
        // ==========================================

        const userIndex =
            data.users.findIndex(
                user =>

                    user.email
                        .toLowerCase()
                    ===
                    oldEmail
                        .toLowerCase()
            );


        if (userIndex === -1) {

            return false;

        }


        // ==========================================
        // CHECK NEW EMAIL
        // ==========================================

        const emailAlreadyUsed =
            data.users.some(
                (user, index) => {

                    return (

                        index !== userIndex

                        &&

                        user.email
                            .toLowerCase()
                        ===
                        updatedUser.email
                            .toLowerCase()

                    );

                }
            );


        if (emailAlreadyUsed) {

            return false;

        }


        // ==========================================
        // UPDATE USER
        // ==========================================

        data.users[userIndex] = {

            name:
                updatedUser.name,

            email:
                updatedUser.email,

            password:
                updatedUser.password

        };


        saveData(data);


        return true;

    }
);


// ======================================================
// GET ALL DATA
// ======================================================

ipcMain.handle(
    "get-data",
    () => {

        return readData();

    }
);


// ======================================================
// SAVE ALL DATA
// ======================================================

ipcMain.handle(
    "save-data",
    (event, newData) => {

        if (!newData) {

            return false;

        }


        return saveData(newData);

    }
);


// ======================================================
// ADD DOCUMENT
// ======================================================

ipcMain.handle(
    "add-document",
    (event, document) => {

        const data = readData();


        if (!data.documents) {

            data.documents = [];

        }


        data.documents.push(document);


        saveData(data);


        return true;

    }
);


// ======================================================
// ADD BORROW ITEM
// ======================================================

ipcMain.handle(
    "add-borrow-item",
    (event, item) => {

        const data = readData();


        if (!data.borrowItems) {

            data.borrowItems = [];

        }


        data.borrowItems.push(item);


        saveData(data);


        return true;

    }
);


// ======================================================
// ADD WARRANTY
// ======================================================

ipcMain.handle(
    "add-warranty",
    (event, warranty) => {

        const data = readData();


        if (!data.warranties) {

            data.warranties = [];

        }


        data.warranties.push(warranty);


        saveData(data);


        return true;

    }
);


// ======================================================
// ADD REMINDER
// ======================================================

ipcMain.handle(
    "add-reminder",
    (event, reminder) => {

        const data = readData();


        if (!data.reminders) {

            data.reminders = [];

        }


        data.reminders.push(reminder);


        saveData(data);


        return true;

    }
);


// ======================================================
// DELETE DOCUMENT
// ======================================================

ipcMain.handle(
    "delete-document",
    (event, id) => {

        const data = readData();


        const document =
            data.documents.find(
                item => item.id === id
            );


        if (document) {

            if (!data.trash) {

                data.trash = [];

            }


            data.trash.push({

                type: "document",

                item: document

            });

        }


        data.documents =
            data.documents.filter(
                item => item.id !== id
            );


        saveData(data);


        return true;

    }
);


// ======================================================
// DELETE BORROW ITEM
// ======================================================

ipcMain.handle(
    "delete-borrow-item",
    (event, id) => {

        const data = readData();


        const item =
            data.borrowItems.find(
                item => item.id === id
            );


        if (item) {

            if (!data.trash) {

                data.trash = [];

            }


            data.trash.push({

                type: "borrow",

                item: item

            });

        }


        data.borrowItems =
            data.borrowItems.filter(
                item => item.id !== id
            );


        saveData(data);


        return true;

    }
);


// ======================================================
// DELETE WARRANTY
// ======================================================

ipcMain.handle(
    "delete-warranty",
    (event, id) => {

        const data = readData();


        const warranty =
            data.warranties.find(
                item => item.id === id
            );


        if (warranty) {

            if (!data.trash) {

                data.trash = [];

            }


            data.trash.push({

                type: "warranty",

                item: warranty

            });

        }


        data.warranties =
            data.warranties.filter(
                item => item.id !== id
            );


        saveData(data);


        return true;

    }
);


// ======================================================
// DELETE REMINDER
// ======================================================

ipcMain.handle(
    "delete-reminder",
    (event, id) => {

        const data = readData();


        const reminder =
            data.reminders.find(
                item => item.id === id
            );


        if (reminder) {

            if (!data.trash) {

                data.trash = [];

            }


            data.trash.push({

                type: "reminder",

                item: reminder

            });

        }


        data.reminders =
            data.reminders.filter(
                item => item.id !== id
            );


        saveData(data);


        return true;

    }
);


// ======================================================
// UPDATE GENERAL DATA
// ======================================================

ipcMain.handle(
    "update-data",
    (event, newData) => {

        return saveData(newData);

    }
);


// ======================================================
// FINISHED
// ======================================================

console.log(
    "Life Organizer is running..."
);