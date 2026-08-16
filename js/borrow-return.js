checkLogin();

async function loadBorrowItems() {
    const data = await getProjectData();
    const email = getCurrentUser();

    const items = data.borrowItems.filter(function (item) {
        return item.userEmail === email;
    });

    const area = document.getElementById("borrowList");
    area.innerHTML = "";

    if (items.length === 0) {
        area.innerHTML = "<p>No borrowed items yet.</p>";
        return;
    }

    items.forEach(function (item) {
        area.innerHTML += `
            <div class="item">
                <h3>${escapeText(item.name)}</h3>
                <p>Borrowed to: ${escapeText(item.person)}</p>
                <p>Borrow Date: ${escapeText(item.borrowDate)}</p>
                <p>Return Date: ${escapeText(item.returnDate)}</p>
                <p>Status: ${escapeText(item.status)}</p>
                ${
                    item.status === "Pending"
                    ? `<button onclick="markReturned('${item.id}')">Returned</button>`
                    : ""
                }
                <button onclick="deleteBorrow('${item.id}')">Delete</button>
            </div>
        `;
    });
}

async function addBorrow() {
    const name = document.getElementById("borrowName").value.trim();
    const person = document.getElementById("person").value.trim();
    const borrowDate = document.getElementById("borrowDate").value;
    const returnDate = document.getElementById("returnDate").value;

    if (name === "" || person === "") {
        alert("Enter item name and person.");
        return;
    }

    const data = await getProjectData();

    data.borrowItems.push({
        id: makeId(),
        userEmail: getCurrentUser(),
        name: name,
        person: person,
        borrowDate: borrowDate,
        returnDate: returnDate,
        status: "Pending"
    });

    await saveProjectData(data);

    document.getElementById("borrowName").value = "";
    document.getElementById("person").value = "";
    document.getElementById("borrowDate").value = "";
    document.getElementById("returnDate").value = "";

    loadBorrowItems();
}

async function markReturned(id) {
    const data = await getProjectData();

    const item = data.borrowItems.find(function (item) {
        return item.id === id && item.userEmail === getCurrentUser();
    });

    if (item) {
        item.status = "Returned";
        await saveProjectData(data);
        loadBorrowItems();
    }
}

async function deleteBorrow(id) {
    const data = await getProjectData();
    const email = getCurrentUser();

    const index = data.borrowItems.findIndex(function (item) {
        return item.id === id && item.userEmail === email;
    });

    if (index === -1) return;

    const item = data.borrowItems.splice(index, 1)[0];

    data.trash.push({
        type: "Borrow Item",
        userEmail: email,
        item: item
    });

    await saveProjectData(data);
    loadBorrowItems();
}

loadBorrowItems();