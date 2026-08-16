checkLogin();

let allDocuments = [];

async function loadDocuments() {
    const data = await getProjectData();
    const email = getCurrentUser();

    allDocuments = data.documents.filter(function (item) {
        return item.userEmail === email;
    });

    showDocuments(allDocuments);
}

function showDocuments(list) {
    const area = document.getElementById("documentList");
    area.innerHTML = "";

    if (list.length === 0) {
        area.innerHTML = "<p>No documents added yet.</p>";
        return;
    }

    list.forEach(function (item) {
        area.innerHTML += `
            <div class="item">
                <h3>${escapeText(item.name)}</h3>
                <p>Category: ${escapeText(item.category)}</p>
                <p>Location: ${escapeText(item.location)}</p>
                <p>Expiry: ${escapeText(item.expiry)}</p>
                <button onclick="deleteDocument('${item.id}')">Delete</button>
            </div>
        `;
    });
}

async function addDocument() {
    const name = document.getElementById("docName").value.trim();
    const category = document.getElementById("docCategory").value.trim();
    const location = document.getElementById("docLocation").value.trim();
    const expiry = document.getElementById("docExpiry").value;

    if (name === "") {
        alert("Enter document name.");
        return;
    }

    const data = await getProjectData();

    data.documents.push({
        id: makeId(),
        userEmail: getCurrentUser(),
        name: name,
        category: category,
        location: location,
        expiry: expiry
    });

    await saveProjectData(data);

    document.getElementById("docName").value = "";
    document.getElementById("docCategory").value = "";
    document.getElementById("docLocation").value = "";
    document.getElementById("docExpiry").value = "";

    loadDocuments();
}

async function deleteDocument(id) {
    const data = await getProjectData();
    const email = getCurrentUser();

    const index = data.documents.findIndex(function (item) {
        return item.id === id && item.userEmail === email;
    });

    if (index === -1) return;

    const item = data.documents.splice(index, 1)[0];

    data.trash.push({
        type: "Document",
        userEmail: email,
        item: item
    });

    await saveProjectData(data);
    loadDocuments();
}

function searchDocuments() {
    const text = document.getElementById("search").value.toLowerCase();

    const result = allDocuments.filter(function (item) {
        return item.name.toLowerCase().includes(text) ||
               item.category.toLowerCase().includes(text);
    });

    showDocuments(result);
}

loadDocuments();