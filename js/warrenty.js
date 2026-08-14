let warranties = [];


// =================================
// LOAD
// =================================

async function loadWarranties() {

    const user =
        await getCurrentUser();

    if (!user) {
        return;
    }

    warranties =
        user.warranties || [];

    showWarranties();
}


// =================================
// SHOW
// =================================

function showWarranties() {

    const list =
        document.getElementById(
            "warrantyList"
        );

    list.innerHTML = "";


    if (warranties.length === 0) {

        list.innerHTML =
            "<p>No warranty records.</p>";

        return;
    }


    warranties.forEach(
        function(item, index) {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "card";


            const days =
                getDaysLeft(
                    item.warrantyEnd
                );


            div.innerHTML = `

                <h3>🧾 ${item.productName}</h3>

                <p>
                    Purchase Date:
                    ${item.purchaseDate}
                </p>

                <p>
                    Warranty End:
                    ${item.warrantyEnd}
                </p>

                <p>
                    ${
                        days >= 0
                        ?
                        days + " days left"
                        :
                        "Warranty expired"
                    }
                </p>

                <p>
                    Receipt:
                    ${item.receiptLocation || "Not added"}
                </p>

                <button
                    onclick="deleteWarranty(${index})"
                >
                    🗑 Delete
                </button>

            `;


            list.appendChild(div);

        }
    );
}


// =================================
// DAYS LEFT
// =================================

function getDaysLeft(dateString) {

    if (!dateString) {
        return 0;
    }


    const today =
        new Date();


    const endDate =
        new Date(dateString);


    const difference =
        endDate - today;


    return Math.ceil(
        difference /
        (1000 * 60 * 60 * 24)
    );

}


// =================================
// ADD
// =================================

async function addWarranty() {

    const productName =
        document.getElementById(
            "productName"
        ).value.trim();


    const purchaseDate =
        document.getElementById(
            "purchaseDate"
        ).value;


    const warrantyEnd =
        document.getElementById(
            "warrantyEnd"
        ).value;


    const receiptLocation =
        document.getElementById(
            "receiptLocation"
        ).value.trim();


    if (!productName) {

        alert(
            "Please enter product name."
        );

        return;
    }


    warranties.push({

        id: Date.now(),

        productName,

        purchaseDate,

        warrantyEnd,

        receiptLocation

    });


    await saveField(
        "warranties",
        warranties
    );


    showWarranties();

}


// =================================
// DELETE
// =================================

async function deleteWarranty(index) {

    warranties.splice(
        index,
        1
    );


    await saveField(
        "warranties",
        warranties
    );


    showWarranties();

}


// =================================
// DASHBOARD
// =================================

function goDashboard() {

    window.location.href =
        "dashboard.html";
}


loadWarranties();