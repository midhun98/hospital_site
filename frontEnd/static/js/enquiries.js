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

$.ajax({
    type: "GET",
    url: "/api/appointments/",
    dataType: "json",
    success: function (data) {
        'use strict';
        // Iterate over the data and add it to the table
        $.each(data, function (index, item) {
            let date = new Date(item.date);
            let formattedDate = date.toLocaleDateString();
            let message = item.message;
            let messageButton = (message && message !== "") ? `<button class="btn btn-primary view-message"
                                                                  data-message="${message}">View Message</button>` : '';
            let id = item.id;
            let deleteButton = `<button class='btn btn-danger delete-appointment' data-id="${id}">Delete</button></td>"`;
            $("#appointment-table tbody").append(
                "<tr>" +
                "<td>" + item.name + "</td>" +
                "<td>" + item.email + "</td>" +
                "<td>" + item.phone + "</td>" +
                "<td>" + formattedDate + "</td>" +
                "<td>" + (item.doctor ? item.doctor : "-") + "</td>" +
                "<td>" + messageButton + "</td>" +
                "<td>" + deleteButton + "</td>" +
                "</tr>"
            );
        });
        $('#appointment-table').DataTable();
    }
});

$(document).on("click", ".view-message", function () {
    'use strict';
    let message = $(this).attr("data-message");
    swal.fire({
        title: 'Message',
        text: message,
        showCancelButton: false,
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK'
    });
});

$(document).on("click", ".delete-appointment", function () {
    'use strict';
    let id = $(this).data("id");
    let row = $(this).closest("tr");
    swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                type: "DELETE",
                url: "/api/appointments/" + id + "/",
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                },
                success: function () {
                    swal.fire(
                        'Deleted!',
                        'Your appointment has been deleted.',
                        'success'
                    );
                    //removing the row
                    row.remove();
                },
                error: function () {
                    swal.fire(
                        'Error!',
                        'An error occurred while deleting the appointment.',
                        'error'
                    );
                }
            });
        }
    });
});
