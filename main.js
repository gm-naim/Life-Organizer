const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const dataFolder = path.join(__dirname, "data");
const dataFile = path.join(dataFolder, "data.json");

function makeDataFile() {
    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder);
    }

    if (!fs.existsSync(dataFile)) {
        const data = {
            users: [],
            documents: [],
            borrowItems: [],
            warranties: [],
            reminders: [],
            trash: [],
            settings: {
                darkMode: false
            }
        };

        fs.writeFileSync(dataFile, JSON.stringify(data, null, 4));
    }
}

function readData() {
    makeDataFile();

    try {
        return JSON.parse(fs.readFileSync(dataFile, "utf8"));
    } catch (error) {
        return {
            users: [],
            documents: [],
            borrowItems: [],
            warranties: [],
            reminders: [],
            trash: [],
            settings: {
                darkMode: false
            }
        };
    }
}

function saveData(data) {
    makeDataFile();
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 4));
    return true;
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

    win.loadFile(path.join(__dirname, "pages", "login.html"));
}

ipcMain.handle("get-data", function () {
    return readData();
});

ipcMain.handle("save-data", function (event, data) {
    return saveData(data);
});

ipcMain.handle("get-users", function () {
    return readData().users;
});

ipcMain.handle("create-user", function (event, user) {
    const data = readData();

    const email = user.email.trim().toLowerCase();

    const exists = data.users.some(function (item) {
        return item.email.toLowerCase() === email;
    });

    if (exists) {
        return {
            success: false,
            message: "This email is already registered."
        };
    }

    user.email = email;
    data.users.push(user);
    saveData(data);

    return {
        success: true,
        message: "Account created successfully."
    };
});

ipcMain.handle("update-user", function (event, oldEmail, newUser) {
    const data = readData();

    const index = data.users.findIndex(function (user) {
        return user.email.toLowerCase() === oldEmail.toLowerCase();
    });

    if (index === -1) {
        return false;
    }

    const anotherUser = data.users.some(function (user, i) {
        return i !== index &&
            user.email.toLowerCase() === newUser.email.toLowerCase();
    });

    if (anotherUser) {
        return false;
    }

    data.users[index] = newUser;
    saveData(data);

    return true;
});

app.whenReady().then(function () {
    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
        app.quit();
    }
});