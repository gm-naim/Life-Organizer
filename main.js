const { app, BrowserWindow } = require("electron");
const path = require("path");
function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(path.join(__dirname, "pages", "login.html"));
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const dataFolder = path.join(__dirname, "data");
const dataFile = path.join(dataFolder, "data.json");


function createDataFile() {

    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
    }

    if (!fs.existsSync(dataFile)) {

        const defaultData = {
            user: null,
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


function readData() {

    const data = fs.readFileSync(
        dataFile,
        "utf-8"
    );

    return JSON.parse(data);
}


function saveData(data) {

    fs.writeFileSync(
        dataFile,
        JSON.stringify(data, null, 4)
    );
}


function createWindow() {

    const win = new BrowserWindow({

        width: 1200,
        height: 800,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    win.loadFile(
        path.join(__dirname, "pages", "login.html")
    );
}


app.whenReady().then(() => {

    createDataFile();

    createWindow();


    app.on("activate", () => {

        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }

    });

});


app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});


/* Get user data */

ipcMain.handle("get-user", () => {

    const data = readData();

    return data.user;

});


/* Save user data */

ipcMain.handle("save-user", (event, user) => {

    const data = readData();

    data.user = user;

    saveData(data);

    return true;
});