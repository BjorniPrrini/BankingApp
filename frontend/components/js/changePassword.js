$(document).ready(() => {
    function getLoggedInUser() {
        const admin  = localStorage.getItem('loggedInAdmin');
        const banker = localStorage.getItem('loggedInBanker');
        const client = localStorage.getItem('loggedInClient');

        if(admin){
            return JSON.parse(admin);
        }

        if(banker){
            return JSON.parse(banker);
        }

        if(client){
            return JSON.parse(client);
        }

        return null;
    }

    const user = getLoggedInUser();

    if(!user){
        window.location.href = '/frontend/index.html';

        return;
    }

    const userRole = user.role.toLowerCase();

    $('#clientID').val(user.id);

    $('#changeButton').on('click', function(e){
        e.preventDefault();

        let clientID    = $('#clientID').val().trim();
        let oldPassword = $('#oldPassword').val().trim();
        let newPassword = $('#newPassword').val().trim();

        if (!clientID || !oldPassword || !newPassword) {
            $('#alert-box').removeClass('success info').addClass('show danger').text('Empty fields');
            setTimeout(() => $('#alert-box').removeClass('show'), 3000);
            return;
        }

        $.ajax({
            url: 'http://localhost:5104/api/changePassword/change',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                id: clientID,
                oldPassword: oldPassword,
                newPassword: newPassword
            }),
            success: function(){
                $('#oldPassword').val('');
                $('#newPassword').val('');

                $('#alert-box').removeClass('danger info').addClass('show success').text('Password changed successfully');

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
        window.location.href = `/frontend/pages/${userRole}/${userRole}Home.html`;
    });
});