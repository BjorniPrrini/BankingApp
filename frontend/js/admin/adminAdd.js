$(document).ready(() => {

    $('#login-btn').on('click', function(e){

        e.preventDefault();

        let selectedRole =
            $('.role-btn.active').data('role');

        let email =
            $('#email').val().trim();

        let password =
            $('#password').val();

        let empid =
            $('#empid').val().trim();

        if(!email || !password){

            $('#alert-box')
                .removeClass('success info')
                .addClass('show danger')
                .text('Empty fields');

            setTimeout(() => {

                $('#alert-box')
                    .removeClass('show');

            }, 3000);

            return;
        }

        if(
            (selectedRole === 'banker' ||
                selectedRole === 'admin') &&
            !empid
        ){

            $('#alert-box')
                .removeClass('success info')
                .addClass('show danger')
                .text('Employee ID is required');

            setTimeout(() => {

                $('#alert-box')
                    .removeClass('show');

            }, 3000);

            return;
        }

        $.ajax({

            url: 'http://localhost:5104/api/auth/login',

            method: 'POST',

            contentType: 'application/json',

            data: JSON.stringify({
                email: email,
                password: password
            }),

            success: function(response){

                let backendRole =
                    response.role.toLowerCase();

                if(backendRole !== selectedRole){

                    $('#alert-box')
                        .removeClass('success info')
                        .addClass('show danger')
                        .text('Incorrect role selected');

                    setTimeout(() => {

                        $('#alert-box')
                            .removeClass('show');

                    }, 3000);

                    return;
                }

                localStorage.removeItem(
                    'loggedInAdmin'
                );

                localStorage.removeItem(
                    'loggedInBanker'
                );

                localStorage.removeItem(
                    'loggedInClient'
                );

                if(backendRole === 'admin'){

                    localStorage.setItem(
                        'loggedInAdmin',
                        JSON.stringify(response)
                    );

                    $('#alert-box')
                        .removeClass('danger info')
                        .addClass('show success')
                        .text('Login successful');

                    setTimeout(() => {

                        window.location.href =
                            '/frontend/pages/admin/adminHome.html';

                    }, 800);

                    return;
                }

                if(backendRole === 'banker'){

                    localStorage.setItem(
                        'loggedInBanker',
                        JSON.stringify(response)
                    );

                    $('#alert-box')
                        .removeClass('danger info')
                        .addClass('show success')
                        .text('Login successful');

                    setTimeout(() => {

                        window.location.href =
                            '/frontend/pages/banker/bankerHome.html';

                    }, 800);

                    return;
                }

                if(backendRole === 'client'){

                    localStorage.setItem(
                        'loggedInClient',
                        JSON.stringify(response)
                    );

                    $('#alert-box')
                        .removeClass('danger info')
                        .addClass('show success')
                        .text('Login successful');

                    setTimeout(() => {

                        window.location.href =
                            '/frontend/pages/client/clientHome.html';

                    }, 800);

                    return;
                }
            },

            error: function(error){

                let message =
                    error.responseJSON?.message
                    || 'Invalid email or password';

                $('#alert-box')
                    .removeClass('success info')
                    .addClass('show danger')
                    .text(message);

                setTimeout(() => {

                    $('#alert-box')
                        .removeClass('show');

                }, 3000);
            }
        });
    });

    $('.eye-btn').on('click', function(){

        let pwdInput = $('#password');

        if(pwdInput.attr('type') === 'password'){

            pwdInput.attr('type', 'text');

            $(this).text('🙈');

        }else{

            pwdInput.attr('type', 'password');

            $(this).text('👁');
        }
    });

    $('.role-btn').on('click', function(){

        $('.role-btn').removeClass('active');

        $(this).addClass('active');

        let role =
            $(this).data('role');

        if(role === 'banker' ||
            role === 'admin'){

            $('#empid-group').show();

        }else{

            $('#empid-group').hide();
        }
    });
});