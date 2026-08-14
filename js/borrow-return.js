let borrowItems = [];


// =================================
// LOAD
// =================================

async function loadBorrowItems() {

    const user =
        await getCurrentUser();

    if (!user) {
        return;
    }

    borrowItems =
        user.borrowItems || [];

    showBorrowItems();
}


// =================================
// SHOW
// =================================

function showBorrowItems() {

    const list =
        document.getElementById(
            "borrowList"
        );

    list.innerHTML = "";


    if (borrowItems.length === 0) {

        list.innerHTML =
            "<p>No borrowed items.</p>";

        return;
    }


    borrowItems.forEach(
        function(item, index) {

            const div =
                document.createElement(
                    "div"
                );


            div.className = "card";


            div.innerHTML = `

                <h3>🤝 ${item.name}</h3>

                <p>
                    Borrowed To:
                    ${item.borrowedTo}
                </p>

                <p>
                    Borrow Date:
                    ${item.borrowDate}
                </p>

                <p>
                    Return Date:
                    ${item.returnDate || "Not set"}
                </p>

                <p>
                    Status:
                    <strong>
                        ${item.status}
                    </strong>
                </p>

                ${
                    item.status === "Pending"

                    ?

                    `<button
                        onclick="markReturned(${index})"
                    >
                        ✓ Returned
                    </button>`

                    :

                    ""
                }

                <button
                    onclick="deleteBorrowItem(${index})"
                >
                    🗑 Delete
                </button>

            `;


            list.appendChild(div);

        }
    );
}


// =================================
// ADD
// =================================

async function addBorrowItem() {

    const name =
        document.getElementById(
            "itemName"
        ).value.trim();


    const borrowedTo =
        document.getElementById(
            "borrowedTo"
        ).value.trim();


    const borrowDate =
        document.getElementById(
            "borrowDate"
        ).value;


    const returnDate =
        document.getElementById(
            "returnDate"
        ).value;


    if (!name || !borrowedTo) {

        alert(
            "Please enter item and person name."
        );

        return;
    }


    borrowItems.push({

        id: Date.now(),

        name,

        borrowedTo,

        borrowDate,

        returnDate,

        status: "Pending"

    });


    await saveField(
        "borrowItems",
        borrowItems
    );


    showBorrowItems();

}


// =================================
// MARK RETURNED
// =================================

async function markReturned(index) {

    borrowItems[index].status =
        "Returned";


    await saveField(
        "borrowItems",
        borrowItems
    );


    showBorrowItems();

}


// =================================
// DELETE
// =================================

async function deleteBorrowItem(index) {

    borrowItems.splice(
        index,
        1
    );


    await saveField(
        "borrowItems",
        borrowItems
    );


    showBorrowItems();

}


// =================================
// DASHBOARD
// =================================

function goDashboard() {

    window.location.href =
        "dashboard.html";
}


loadBorrowItems();