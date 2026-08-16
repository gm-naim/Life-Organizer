checkLogin();

async function loadReminders() {
    const data = await getProjectData();
    const email = getCurrentUser();

    const items = data.reminders.filter(function (item) {
        return item.userEmail === email;
    });

    const area = document.getElementById("reminderList");
    area.innerHTML = "";

    if (items.length === 0) {
        area.innerHTML = "<p>No reminders yet.</p>";
        return;
    }

    items.forEach(function (item) {
        area.innerHTML += `
            <div class="item">
                <h3>${escapeText(item.title)}</h3>
                <p>Date: ${escapeText(item.date)}</p>
                <p>${escapeText(item.note)}</p>
                <button onclick="deleteReminder('${item.id}')">Delete</button>
            </div>
        `;
    });
}

async function addReminder() {
    const title = document.getElementById("title").value.trim();
    const date = document.getElementById("date").value;
    const note = document.getElementById("note").value.trim();

    if (title === "") {
        alert("Enter reminder title.");
        return;
    }

    const data = await getProjectData();

    data.reminders.push({
        id: makeId(),
        userEmail: getCurrentUser(),
        title: title,
        date: date,
        note: note
    });

    await saveProjectData(data);

    document.getElementById("title").value = "";
    document.getElementById("date").value = "";
    document.getElementById("note").value = "";

    loadReminders();
}

async function deleteReminder(id) {
    const data = await getProjectData();
    const email = getCurrentUser();

    const index = data.reminders.findIndex(function (item) {
        return item.id === id && item.userEmail === email;
    });

    if (index === -1) return;

    const item = data.reminders.splice(index, 1)[0];

    data.trash.push({
        type: "Reminder",
        userEmail: email,
        item: item
    });

    await saveProjectData(data);
    loadReminders();
}

loadReminders();