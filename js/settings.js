checkLogin();

async function loadSettings() {
    const data = await getProjectData();

    document.getElementById("darkMode").checked =
        data.settings.darkMode === true;
}

async function saveSettings() {
    const data = await getProjectData();

    data.settings.darkMode =
        document.getElementById("darkMode").checked;

    await saveProjectData(data);

    if (data.settings.darkMode) {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }

    alert("Settings saved.");
}

loadSettings();