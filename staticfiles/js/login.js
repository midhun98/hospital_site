/* jshint esversion: 6 */
function getCookie(name) {
    'use strict';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

$(document).on("click", ".submit-login", function () {
    'use strict';
    let username = $('#inputName').val();
    let password = $('#inputPassword').val();
    $.ajax({
        type: "POST",
        url: "/api/login/",
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': csrftoken,
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
