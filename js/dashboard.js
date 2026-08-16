async function loadDashboard() {
    checkLogin();

    const data = await getProjectData();
    const email = getCurrentUser();

    const documents = data.documents.filter(function (item) {
        return item.userEmail === email;
    });

    const borrowItems = data.borrowItems.filter(function (item) {
        return item.userEmail === email;
    });

    const warranties = data.warranties.filter(function (item) {
        return item.userEmail === email;
    });

    const reminders = data.reminders.filter(function (item) {
        return item.userEmail === email;
    });

    document.getElementById("documentCount").textContent = documents.length;
    document.getElementById("borrowCount").textContent = borrowItems.length;
    document.getElementById("pendingCount").textContent =
        borrowItems.filter(function (item) {
            return item.status === "Pending";
        }).length;

    document.getElementById("productCount").textContent = warranties.length;
    document.getElementById("reminderCount").textContent = reminders.length;

    document.getElementById("welcome").textContent =
        "Welcome, " + localStorage.getItem("userName");
}

loadDashboard();