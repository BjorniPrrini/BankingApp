$(document).ready(function () {

    const client = JSON.parse(localStorage.getItem("loggedInClient") || "null");

    if (!client) {
        window.location.href = "../../login.html";
        return;
    }

    $(".btn-confirm-transfer").on("click", function () {
        doTransfer();
    });

    $(".btn-home").on("click", function () {
        window.location.href = "clientHome.html";
    });

    function doTransfer() {
        const recipientIdRaw = $("#recipientIdField").val().trim();
        const amountRaw      = $("#transferAmountField").val().trim();

        if (!recipientIdRaw || !amountRaw) {
            showAlert("Please fill in all fields.", "danger");
            return;
        }

        const recipientId = parseInt(recipientIdRaw, 10);
        const amount      = parseFloat(amountRaw);

        if (isNaN(recipientId)) {
            showAlert("Recipient ID must be a number.", "danger");
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            showAlert("Enter a valid amount greater than zero.", "danger");
            return;
        }

        if (recipientId === client.ID) {
            showAlert("You cannot transfer money to yourself.", "danger");
            return;
        }

        const clientList = JSON.parse(localStorage.getItem("clientList") || "[]");

        const senderIdx    = clientList.findIndex(c => c.ID === client.ID);
        const recipientIdx = clientList.findIndex(c => c.ID === recipientId);

        if (senderIdx === -1) {
            showAlert("Your account could not be found. Please log in again.", "danger");
            return;
        }

        if (recipientIdx === -1) {
            showAlert("Recipient ID not found. Please check and try again.", "danger");
            return;
        }

        const senderBalance = parseFloat(clientList[senderIdx].balance);

        if (amount > senderBalance) {
            showAlert(
                "Insufficient funds. Your balance is ALL " +
                senderBalance.toLocaleString("en-US", { minimumFractionDigits: 2 }) + ".",
                "danger"
            );
            return;
        }

        clientList[senderIdx].balance    = (senderBalance - amount).toFixed(2);
        clientList[recipientIdx].balance = (parseFloat(clientList[recipientIdx].balance) + amount).toFixed(2);

        localStorage.setItem("clientList", JSON.stringify(clientList));

        localStorage.setItem("loggedInClient", JSON.stringify(clientList[senderIdx]));

        const txList = JSON.parse(localStorage.getItem("transactionList") || "[]");

        let newTxId;
        do {
            newTxId = Math.floor(10000 + Math.random() * 900000);
        } while (txList.some(tx => tx.txId === newTxId));

        const transaction = {
            txId:        newTxId,
            senderId:    client.ID,
            recipientId: recipientId,
            amount:      amount.toFixed(2),
            description: "Transfer",
            date:        new Date().toISOString()
        };

        txList.push(transaction);
        localStorage.setItem("transactionList", JSON.stringify(txList));

        showAlert(
            "Transfer of ALL " +
            amount.toLocaleString("en-US", { minimumFractionDigits: 2 }) +
            " to client #" + recipientId + " was successful!",
            "success"
        );

        $("#recipientIdField").val("");
        $("#transferAmountField").val("");

        setTimeout(() => {
            window.location.href = "clientHome.html";
        }, 1800);
    }

    function showAlert(message, type) {
        let $alert = $("#alert-box");

        if ($alert.length === 0) {
            $alert = $('<div id="alert-box"></div>');
            $(".transfer-card").before($alert);
        }

        $alert
            .removeClass("danger success info")
            .addClass("show " + type)
            .text(message);

        if (type !== "success") {
            setTimeout(() => $alert.removeClass("show danger success info"), 3500);
        }
    }
});