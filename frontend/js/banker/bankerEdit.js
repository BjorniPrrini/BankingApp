$(document).ready(() => {
    const urlID = new URLSearchParams(window.location.search);
    const id = parseInt(urlID.get('id'));


    $.ajax({
        url: `http://localhost:5104/api/banker/editClient/get/${id}`,
        type: "GET",
        dataType: "json",
        success: function(response){
            $('#name').val(response.name);
            $('#surname').val(response.surname);
            $('#balance').val(response.balance);
            $('#generatedID').val(response.clientID);
            $('#generatedIBAN').val(response.accountNumber);
            $('#email').val(response.email);
            $('#generatedPassword').val(response.password);
        },
        error: function(error){
            let message = error.responseJSON?.message || 'An error occurred';

            $('#alert-box').removeClass('success info').addClass('show danger').text(message);

            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
        }
    });
    $('#editButton').on('click', function (e) {
        e.preventDefault();

        let name = $('#name').val().trim();
        let surname = $('#surname').val().trim();
        let balance = $('#balance').val().trim();
        let email = $('#email').val().trim();


        if(!name || !surname || !balance || !email){
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');

            setTimeout(() => $('#alert-box').removeClass('show'), 3000);

            return;
        }

        $.ajax({
            url: "http://localhost:5104/api/banker/editClient/edit",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                id: id,
                name: name,
                surname: surname,
                balance: parseFloat(balance),
                email: email
            }),
            success: function(response){
                $('#name').val(response.name);
                $('#surname').val(response.surname);
                $('#balance').val(response.balance);
                $('#generatedID').val(response.clientID);
                $('#generatedIBAN').val(response.clientIBAN);
                $('#email').val(response.email);
                $('#generatedPassword').val(response.password);

                $('#alert-box').removeClass('danger info').addClass('show success').text('Client edited successfully');

                setTimeout(() => $('#alert-box').removeClass('show'), 5000);
            },

            error: function(error){
                let message = error.responseJSON?.message || 'Client could not be added';

                $('#alert-box').removeClass('success info').addClass('show danger').text(message);

                setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            }
        });
    });


    $('#goBack').on('click', function (){
        window.location.href = '/frontend/pages/banker/bankerHome.html';
    });
});