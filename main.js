const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");


// =============================
// Data File
// =============================

const dataFolder = path.join(__dirname, "data");
const dataFile = path.join(dataFolder, "data.json");


// =============================
// Create Data File
// =============================

function createDataFile() {

    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
    }

    if (!fs.existsSync(dataFile)) {

        const defaultData = {
            users: [],
            documents: [],
            borrowedItems: [],
            warranties: [],
            reminders: [],
            trash: []
        };

        fs.writeFileSync(
            dataFile,
            JSON.stringify(defaultData, null, 4)
        );
    }
}


// =============================
// Read Data
// =============================

function readData() {

    const data = fs.readFileSync(
        dataFile,
        "utf-8"
    );

    return JSON.parse(data);
}


// =============================
// Save Data
// =============================

function saveData(data) {

    fs.writeFileSync(
        dataFile,
        JSON.stringify(data, null, 4)
    );
}


// =============================
// Create Window
// =============================

function createWindow() {

    const win = new BrowserWindow({

        width: 1200,
        height: 800,

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
            "Pages(html)",
            "login.html"
        )
    );
}


// =============================
// Start Application
// =============================

app.whenReady().then(() => {

    createDataFile();

    createWindow();

});


// =============================
// Close Application
// =============================

app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});


// =============================
// GET ALL USERS
// =============================

ipcMain.handle(
    "get-users",
    () => {

        const data = readData();

        return data.users;

    }
);


// =============================
// SAVE NEW USER
// =============================

ipcMain.handle(
    "save-user",
    (event, user) => {

        const data = readData();

        data.users.push(user);

        saveData(data);

        return true;

    }
);