$(document).ready(function () {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    if (!id) {
        window.location.href = '/frontend/pages/banker/bankerHome.html';
        return;
    }

    $.ajax({
        url: `http://localhost:5104/api/banker/home/client/${id}`,
        type: 'GET',
        dataType: 'json',
        success: function (cli) {
            $('#cliID').val('#' + cli.id);
            $('#cliName').val(cli.name + ' ' + cli.surname);
            $('#cliBalance').val('$' + cli.balance);
            $('#cliEmail').val(cli.email);
        },
        error: function () {
            alert('Client not found.');
            window.location.href = '/frontend/pages/banker/bankerHome.html';
        }
    });

    $('#confirmDelete').on('click', function () {
        $.ajax({
            url: `http://localhost:5104/api/banker/home/client/${id}`,
            type: 'DELETE',
            success: function () {
                window.location.href = '/frontend/pages/banker/bankerHome.html';
            },
            error: function () {
                alert('Failed to delete client. Please try again.');
            }
        });
    });

    $('#cancelDelete').on('click', function () {
        window.location.href = '/frontend/pages/banker/bankerHome.html';
    });
});