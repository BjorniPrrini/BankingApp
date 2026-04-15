$(document).ready(function (){
    const client = JSON.parse(localStorage.getItem("loggedInClient") || "null");

    if(!client){
        window.location.href = "../../login.html";

        return;
    }

    const initials = client.name.charAt(0) + client.surname.charAt(0);
    $("#clientAvatar").text(initials);
    $("#clientName").text(client.name + " " + client.surname);
    $("#clientId").text(client.ID);

    refreshBalance();

    renderTransactions();

    $(".btn-transfer").on("click", function (){
        window.location.href = "ClientTransferMoney.html";
    });

    $(".logout-btn").on("click", function (){
        localStorage.removeItem("loggedInClient");

        window.location.href = "../../login.html";
    });

    function refreshBalance(){
        const clientList = JSON.parse(localStorage.getItem("clientList") || "[]");
        const fresh = clientList.find(c => c.ID === client.ID);
        const balance = fresh ? parseFloat(fresh.balance) : parseFloat(client.balance);

        $("#clientBalance").text("ALL " + balance.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2}));

        const now = new Date();

        $("#balanceDate").text(
            "as of " +
            now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) +
            " " +
            now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
        );

        if(fresh){
            localStorage.setItem("loggedInClient", JSON.stringify(fresh));
        }
    }

    function renderTransactions(){
        const allTx = JSON.parse(localStorage.getItem("transactionList") || "[]");
        const myTx = allTx.filter(tx => tx.senderId === client.ID || tx.recipientId === client.ID);

        const tbody  = $("#txTableBody");

        tbody.empty();

        if(myTx.length === 0){
            tbody.append('<tr class="empty-row"><td colspan="6">No transactions yet.</td></tr>');

            $("#txCount").text("0 transactions");

            return;
        }

        myTx.sort((a, b) => new Date(b.date) - new Date(a.date));

        $.each(myTx, function (_, tx){
            const isSender   = tx.senderId === client.ID;
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
});