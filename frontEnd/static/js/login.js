/* jshint esversion: 6 */
// Get the CSRF token from the HTML form
const csrfToken = $('#loginForm input[name="csrfmiddlewaretoken"]').val();

$(document).on("click", ".submit-login", function () {
    'use strict';
    let username = $('#inputName').val();
    let password = $('#inputPassword').val();

    $.ajax({
        type: "POST",
        url: "/api/login/",
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        contentType: "application/json",
        data: JSON.stringify({username: username, password: password}),
        success: function (data) {
            if (data.status === 'success') {
                swal.fire({
                    icon: 'success',
                    title: 'Login Success',
                    showConfirmButton: false,
                    timer: 1500
                });
                setTimeout(function () {
                    window.location = '/dashboard/';
                }, 1500);
            } else {
                // login failed
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Invalid Credentials!',
                });
            }
        }
    });
});

function otpless(otplessUser) {
    $.ajax({
        type: "POST",
        url: "/api/otplesslogin/",
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        data: JSON.stringify(otplessUser),
        contentType: "application/json",
        success: function (response) {
            swal.fire({
                icon: 'success',
                title: 'Login Success',
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(function () {
                window.location = '/dashboard/';
            }, 1500);
            console.log("API Response:", response);
        },
        error: function (error) {
            console.error("API Error:", error);
        },
    });
    console.log(JSON.stringify(otplessUser));
}

