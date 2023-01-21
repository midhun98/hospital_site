/* jshint esversion: 6 */
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
            $("#appointment-table tbody").append(
                "<tr>" +
                "<td>" + item.name + "</td>" +
                "<td>" + item.email + "</td>" +
                "<td>" + item.phone + "</td>" +
                "<td>" + formattedDate + "</td>" +
                "<td>" + (item.doctor ? item.doctor : "-") + "</td>" +
                "<td>" + messageButton + "</td>" +
                "</tr>"
            );
        });
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
