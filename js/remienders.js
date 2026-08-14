let reminders = [];

let currentUser = null;


// =================================
// LOAD
// =================================

async function loadReminders() {

    currentUser =
        await getCurrentUser();


    if (!currentUser) {
        return;
    }


    reminders =
        currentUser.reminders || [];


    showSmartReminders();

    showReminders();

}


// =================================
// SMART REMINDERS
// =================================

function showSmartReminders() {

    const box =
        document.getElementById(
            "smartReminders"
        );


    box.innerHTML = "";


    // ==============================
    // DOCUMENT EXPIRY
    // ==============================

    const documents =
        currentUser.documents || [];


    documents.forEach(
        function(item) {

            if (!item.expiry) {
                return;
            }


            const days =
                getDaysLeft(
                    item.expiry
                );


            if (
                days >= 0 &&
                days <= 30
            ) {

                addSmartCard(
                    box,
                    "⚠️",
                    `Document "${item.name}" expires in ${days} days.`
                );

            }

        }
    );


    // ==============================
    // WARRANTY
    // ==============================

    const warranties =
        currentUser.warranties || [];


    warranties.forEach(
        function(item) {

            if (!item.warrantyEnd) {
                return;
            }


            const days =
                getDaysLeft(
                    item.warrantyEnd
                );


            if (
                days >= 0 &&
                days <= 30
            ) {

                addSmartCard(
                    box,
                    "🧾",
                    `Warranty of "${item.productName}" expires in ${days} days.`
                );

            }

        }
    );


    // ==============================
    // BORROW
    // ==============================

    const borrowItems =
        currentUser.borrowItems || [];


    borrowItems.forEach(
        function(item) {

            if (
                item.status ===
                "Pending"
            ) {

                addSmartCard(
                    box,
                    "🤝",
                    `${item.name} is still with ${item.borrowedTo}.`
                );

            }

        }
    );


    if (box.innerHTML === "") {

        box.innerHTML =
            `<div class="card">
                ✅ No urgent reminders.
            </div>`;

    }

}


// =================================
// SMART CARD
// =================================

function addSmartCard(
    box,
    icon,
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.className =
        "card";


    div.innerHTML = `

        <h3>
            ${icon} ${text}
        </h3>

    `;


    box.appendChild(div);

}


// =================================
// DAYS LEFT
// =================================

function getDaysLeft(
    dateString
) {

    const today =
        new Date();


    const date =
        new Date(dateString);


    const difference =
        date - today;


    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );

}


// =================================
// NORMAL REMINDERS
// =================================

function showReminders() {

    const list =
        document.getElementById(
            "reminderList"
        );


    list.innerHTML = "";


    if (reminders.length === 0) {

        list.innerHTML =
            "<p>No personal reminders.</p>";

        return;
    }


    reminders.forEach(
        function(item, index) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "card";


            div.innerHTML = `

                <h3>
                    🔔 ${item.title}
                </h3>

                <p>
                    Date:
                    ${item.date}
                </p>

                <button
                    onclick="deleteReminder(${index})"
                >
                    🗑 Delete
                </button>

            `;


            list.appendChild(div);

        }
    );

}


// =================================
// ADD REMINDER
// =================================

async function addReminder() {

    const title =
        document.getElementById(
            "reminderTitle"
        ).value.trim();


    const date =
        document.getElementById(
            "reminderDate"
        ).value;


    if (!title || !date) {

        alert(
            "Please enter reminder title and date."
        );

        return;
    }


    reminders.push({

        id: Date.now(),

        title,

        date

    });


    await saveField(
        "reminders",
        reminders
    );


    document.getElementById(
        "reminderTitle"
    ).value = "";


    document.getElementById(
        "reminderDate"
    ).value = "";


    showReminders();

}


// =================================
// DELETE
// =================================

async function deleteReminder(index) {

    reminders.splice(
        index,
        1
    );


    await saveField(
        "reminders",
        reminders
    );


    showReminders();

}


// =================================
// DASHBOARD
// =================================

function goDashboard() {

    window.location.href =
        "dashboard.html";
}


loadReminders();