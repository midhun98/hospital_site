/* jshint esversion: 6 */
/*global moment*/
/*global console*/
/*global DataTable*/
/*global swal*/

const careerData = $.ajax({
    url: "/api/careers/",
});

careerData.done(function (data) {
    'use strict';

    // Initialize the datatable
    $('#careers-table').DataTable({
        data: data,
        columns: [
            {data: 'name'},
            {data: 'email'},
            {data: 'phone'},
            {
                data: 'date',
                render: function (data) {
                    return moment(data).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                data: 'message',
                render: function (data) {
                    if (data.length > 50) {
                        let shortenedMessage = data.substring(0, 50) + '...';
                        let viewMessageButton = '<button class="btn btn-primary btn-sm view-message-btn" data-toggle="modal" data-target="#message-modal" data-message="' + data + '">View Message</button>';
                        return shortenedMessage + viewMessageButton;
                    }
                    return data;
                }
            },
            // {
            //     data: null,
            //     render: function (data) {
            //         // Customize the actions column as needed
            //         let viewLink = '<a href="#" class="btn btn-primary btn-sm">View</a>';
            //         let editLink = '<a href="#" class="btn btn-secondary btn-sm">Edit</a>';
            //         let deleteLink = '<a href="#" class="btn btn-danger btn-sm">Delete</a>';
            //         return viewLink + ' ' + editLink + ' ' + deleteLink;
            //     }
            // }
        ]
    });

    $(document).on("click", ".view-message-btn", function () {
        let message = $(this).attr("data-message");
        swal.fire({
            title: 'Message',
            text: message,
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
        });
    });

});
