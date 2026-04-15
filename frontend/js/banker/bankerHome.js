$(document).ready(function () {
    function loadTable() {
        const clients = JSON.parse(localStorage.getItem('clientList') || '[]');
        const tbody = $('tbody');

        tbody.empty();

        if(clients.length === 0){
            tbody.append('<tr><td colspan="4" style="text-align:center; color: var(--text-dim); padding: 30px;">No clients found.</td></tr>');

            return;
        }

        $.each(clients, function(_, cli){
            const initials = cli.name.charAt(0) + cli.surname.charAt(0);

            const row = `
                <tr data-id="${cli.ID}">
                    <td><span class="id-badge">#${cli.ID}</span></td>
                    <td>
                        <div class="name-cell">
                            <div class="avatar">${initials}</div>
                            ${cli.name} ${cli.surname}
                        </div>
                    </td>
                    <td><span class="balance">$${cli.balance}</span></td>
                    <td>
                        <button class="action-edit" data-id="${cli.ID}">Edit</button>
                        <button class="action-delete" data-id="${cli.ID}">Delete</button>
                    </td>
                </tr>`;

            tbody.append(row);
        });
    }

    loadTable();

    $(document).on('click', '.action-delete', function (){
        const id = $(this).data('id');

        window.location.href = '/frontend/pages/banker/bankerDelete.html?id=' + id;
    });

    $(document).on('click', '.action-edit', function (){
        const id = $(this).data('id');

        window.location.href = '/frontend/pages/banker/bankerEdit.html?id=' + id;
    });

    $('.add-btn').on('click', function (){
        window.location.href = '/frontend/pages/banker/bankerAdd.html';
    });

    $('.logout-btn').on('click', function (){
        window.location.href = '../../login.html';
    });
});