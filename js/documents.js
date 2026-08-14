let documents = [];


// =================================
// LOAD DOCUMENTS
// =================================

async function loadDocuments() {

    const user =
        await getCurrentUser();

    if (!user) {
        return;
    }

    documents =
        user.documents || [];

    showDocuments();
}


// =================================
// SHOW DOCUMENTS
// =================================

function showDocuments() {

    const list =
        document.getElementById(
            "documentList"
        );

    list.innerHTML = "";


    if (documents.length === 0) {

        list.innerHTML =
            "<p>No documents added yet.</p>";

        return;
    }


    documents.forEach(
        function(document, index) {

            const div =
                document.createElement(
                    "div"
                );

            div.className = "card";


            div.innerHTML = `

                <h3>📄 ${document.name}</h3>

                <p>
                    Category:
                    ${document.category}
                </p>

                <p>
                    Location:
                    ${document.location}
                </p>

                <p>
                    Expiry:
                    ${document.expiry || "No expiry"}
                </p>

                <button
                    onclick="deleteDocument(${index})"
                >
                    🗑 Delete
                </button>

            `;


            list.appendChild(div);

        }
    );
}


// =================================
// ADD DOCUMENT
// =================================

async function addDocument() {

    const name =
        document.getElementById(
            "documentName"
        ).value.trim();


    const category =
        document.getElementById(
            "documentCategory"
        ).value.trim();


    const location =
        document.getElementById(
            "documentLocation"
        ).value.trim();


    const expiry =
        document.getElementById(
            "documentExpiry"
        ).value;


    if (!name) {

        alert(
            "Please enter document name."
        );

        return;
    }


    documents.push({

        id: Date.now(),

        name,

        category,

        location,

        expiry

    });


    await saveField(
        "documents",
        documents
    );


    document.getElementById(
        "documentName"
    ).value = "";


    document.getElementById(
        "documentCategory"
    ).value = "";


    document.getElementById(
        "documentLocation"
    ).value = "";


    document.getElementById(
        "documentExpiry"
    ).value = "";


    showDocuments();

}


// =================================
// DELETE DOCUMENT
// =================================

async function deleteDocument(index) {

    const item =
        documents.splice(
            index,
            1
        )[0];


    const user =
        await getCurrentUser();


    user.trash =
        user.trash || [];


    user.trash.push({

        type: "document",

        data: item

    });


    await saveField(
        "documents",
        documents
    );


    await saveField(
        "trash",
        user.trash
    );


    showDocuments();

}


// =================================
// DASHBOARD
// =================================

function goDashboard() {

    window.location.href =
        "dashboard.html";
}


loadDocuments();