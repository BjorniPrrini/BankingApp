$(document).ready(function () {
    function loadClients() {
        $.ajax({
            url: "http://localhost:5104/api/banker/home/client",
            type: "GET",
            dataType: "json",
            success: function(clients){
                const tbody = $("tbody");
                tbody.empty();

                if(!clients || clients.length === 0){
                    tbody.append(`
                        <tr>
                            <td colspan="4" style="text-align:center;">
                                No clients found
                            </td>
                        </tr>
                    `);
                    return;
                }

                clients.forEach(cli => {
                    const row = `
                        <tr data-id="${cli.id}">

                            <td>
                                <span class="id-badge">#${cli.clientId}</span>
                            </td>

                            <td>${cli.name} ${cli.surname}</td>

                            <td>$${cli.balance}</td>

                            <td>
                                <button class="action-edit" data-id="${cli.id}">Edit</button>
                                <button class="action-delete" data-id="${cli.id}">Delete</button>
                                <button class="action-balance" data-id="${cli.id}">Balance</button>
                            </td>

                        </tr>
                    `;

                    tbody.append(row);
                });
            },

            error: function () {
                $("tbody").html(`
                    <tr>
                        <td colspan="4" style="text-align:center; color:red;">
                            Failed to load clients
                        </td>
                    </tr>
                `);
            }
        });
    }

    loadClients();

    $(document).on("click", ".action-edit", function () {
        const id = $(this).data("id");
        window.location.href = `/frontend/pages/banker/bankerEdit.html?id=${id}`;
    });

    $(document).on("click", ".changePassword-btn", function () {
        window.location.href = "/frontend/components/html/change-password.html";
    });

    $(document).on("click", ".action-delete", function () {
        const id = $(this).data("id");
        window.location.href = `/frontend/pages/banker/bankerDelete.html?id=${id}`;
    });

    $(document).on("click", ".action-balance", function () {
        const id = $(this).data("id");
        window.location.href = `/frontend/pages/banker/bankerBalance.html?id=${id}`;
    });

    $(document).on("click", ".add-btn", function () {
        window.location.href = "/frontend/pages/banker/bankerAdd.html";
    });

    $(document).on("click", ".logout-btn", function () {
        window.location.href = "../../login.html";
    });
});