$(document).ready(function (){
    const client =
        JSON.parse(localStorage.getItem("loggedInClient") || "null");

    if (!client) {
        window.location.href = "../../login.html";

        return;
    }

    $.ajax({
        url:
            "http://localhost:5104/api/client/home/" +
            client.id,
        type: "GET",
        success: function(data){
            const initials = data.name.charAt(0) + data.surname.charAt(0);

            $("#clientAvatar").text(initials);

            $("#clientName").text(data.name + " " + data.surname);

            $("#clientId").text(data.iban);

            $("#clientBalance").text("ALL " + parseFloat(data.balance).toLocaleString(
                "en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})
            );

            const now = new Date();

            $("#balanceDate").text(
                "as of " +
                now.toLocaleDateString("en-US",{year: "numeric", month: "short",day: "numeric"})
            );
        },

        error: function (){
            window.location.href = "../../login.html";
        }
    });

    renderTransactions();

    $(".btn-transfer").on("click", function (){
        window.location.href = "ClientTransferMoney.html";
    });

    $(".logout-btn").on("click", function (){

        localStorage.removeItem("loggedInClient");

        window.location.href =
            "../../login.html";
    });

    function renderTransactions(){
        const allTx = JSON.parse(localStorage.getItem("transactionList") || "[]");
        const myTx = allTx.filter(tx => tx.senderId === client.id || tx.recipientId === client.id);

        const tbody  = $("#txTableBody");

        tbody.empty();

        if(myTx.length === 0){
            tbody.append('<tr class="empty-row"><td colspan="6">No transactions yet.</td></tr>');

            $("#txCount").text("0 transactions");

            return;
        }

        myTx.sort((a, b) => new Date(b.date) - new Date(a.date));

        $.each(myTx, function (_, tx){
            const isSender   = tx.senderId === client.id;
            const typeLabel  = isSender ? "Send" : "Receive";
            const typeClass  = isSender ? "tx-type tx-send" : "tx-type tx-recv";
            const typeDot    = '<span class="dot"></span>';
            const counterparty = isSender ? tx.recipientId : tx.senderId;
            const amountClass  = isSender ? "amount-out" : "amount-in";
            const amountSign   = isSender ? "−" : "+";

            const amount = parseFloat(tx.amount).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            const row = `
                <tr>
                    <td><span class="id-badge">#${tx.txId}</span></td>
                    <td><span class="${typeClass}">${typeDot} ${typeLabel}</span></td>
                    <td><span class="id-badge">${counterparty}</span></td>
                    <td>${tx.description || "—"}</td>
                    <td class="date-cell">${formatDate(tx.date)}</td>
                    <td class="col-right ${amountClass}">${amountSign} ${amount}</td>
                </tr>`;

            tbody.append(row);
        });

        $("#txCount").text(myTx.length + " transaction" + (myTx.length !== 1 ? "s" : ""));
    }

    function formatDate(isoString){
        const d = new Date(isoString);

        return d.toLocaleDateString("en-US", {year:  "numeric", month: "short", day:   "numeric"});
    }

    $(document).on("click", ".changePassword-btn", function () {
        window.location.href = "/frontend/components/html/change-password.html";
    });
});