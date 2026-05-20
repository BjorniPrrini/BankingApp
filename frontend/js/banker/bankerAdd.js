$(document).ready(() => {
    $('#addButton').on('click', function(e){
        e.preventDefault();

        let name = $('#name').val().trim();
        let surname = $('#surname').val().trim();
        let balance = $('#balance').val().trim();
        let email = $('#email').val().trim();


        if(!name || !surname || !balance || !email){
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');

            setTimeout(() => {
                $('#alert-box').removeClass('show');
            }, 3000);

            return;
        }
        $.ajax({
            url: 'http://localhost:5104/api/banker/addClient/add',
            method : 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                surname: surname,
                balance: balance,
                email: email
            }),
            success: function(response){
                $('#generatedID').val(response.clientID);
                $('#generatedIBAN').val(response.clientIBAN);
                $('#generatedPassword').val(response.password);
                $('#alert-box').removeClass('danger info').addClass('show success').text('Client added successfully');

                setTimeout(() => $('#alert-box').removeClass('show'), 5000);
            },
            error: function(error){
                let message = error.responseJSON?.message || 'Something went wrong';

                $('#alert-box').removeClass('success info').addClass('show danger').text(message);

                setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            }
        });
    });

    $('#goBack').on('click', function(){
        window.location.href = '/frontend/pages/banker/bankerHome.html';
    })
});