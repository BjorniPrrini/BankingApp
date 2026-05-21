$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    let currentBalance = 0;

    $.ajax({
        url: `http://localhost:5104/api/banker/home/client/${id}`,
        type: "GET",
        dataType: "json",
        success: function (client) {
            $('#clientName').text(`${client.name} ${client.surname}`);
            $('#clientMeta').text(`ID #${client.clientID} · ${client.accountNumber}`);
            currentBalance = parseFloat(client.balance);
            $('#balanceDisplay').text('$' + currentBalance.toFixed(2));
        },
        error: function (error) {
            let message = error.responseJSON?.message || 'Failed to load client data';
            $('#alert-box').removeClass('success info').addClass('show danger').text(message);
            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
        }
    });

    $('#addBtn').on('click', function (e) {
        e.preventDefault();

        let amount = $('#amountInput').val().trim();

        if (!amount) {
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');
            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            return;
        }

        if (parseFloat(amount) <= 0) {
            $('#alert-box').removeClass('success info').addClass('show danger').text('Amount must be greater than 0');
            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            return;
        }

        const newBalance = currentBalance + parseFloat(amount);

        $.ajax({
            url: 'http://localhost:5104/api/banker/editClient/balance',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: id,
                balance: newBalance
            }),
            success: function (response) {
                currentBalance = newBalance;
                $('#balanceDisplay').text('$' + currentBalance.toFixed(2));
                $('#amountInput').val('');
                $('#alert-box').removeClass('danger info').addClass('show success').text('Balance updated successfully');
                setTimeout(() => $('#alert-box').removeClass('show'), 5000);
            },
            error: function (error) {
                let message = error.responseJSON?.message || 'Something went wrong';
                $('#alert-box').removeClass('success info').addClass('show danger').text(message);
                setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            }
        });
    });

    $('#subtractBtn').on('click', function (e) {
        e.preventDefault();

        let amount = $('#amountInput').val().trim();

        if (!amount) {
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');
            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            return;
        }

        if (parseFloat(amount) <= 0) {
            $('#alert-box').removeClass('success info').addClass('show danger').text('Amount must be greater than 0');
            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            return;
        }

        if (parseFloat(amount) > currentBalance) {
            $('#alert-box').removeClass('success info').addClass('show danger').text('Insufficient balance');
            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            return;
        }

        const newBalance = currentBalance - parseFloat(amount);

        $.ajax({
            url: 'http://localhost:5104/api/banker/editClient/balance',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: id,
                balance: newBalance
            }),
            success: function (response) {
                currentBalance = newBalance;
                $('#balanceDisplay').text('$' + currentBalance.toFixed(2));
                $('#amountInput').val('');
                $('#alert-box').removeClass('danger info').addClass('show success').text('Balance updated successfully');
                setTimeout(() => $('#alert-box').removeClass('show'), 5000);
            },
            error: function (error) {
                let message = error.responseJSON?.message || 'Something went wrong';
                $('#alert-box').removeClass('success info').addClass('show danger').text(message);
                setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            }
        });
    });

    $('#goBack').on('click', function () {
        window.location.href = '/frontend/pages/banker/bankerHome.html';
    });
});
