/* jshint esversion: 6 */
/*global moment*/
/*global console*/
/*global DataTable*/
/*global swal*/
/*global csrftoken*/

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
            {
                data: 'documents',
                render: function (data) {
                    if (data.length > 0) {
                        let files = data.map(function (document) {
                            let fileName = document.file.split('/').pop();
                            return '<a href="' + document.file + '" target="_blank">' + fileName + '</a>';
                        });
                        return files.join('<br>');
                    }
                    return '';
                }
            },
            {
                data: null,
                render: function (data) {
                    return '<a href="#" class="btn btn-danger btn-sm delete-career"  data-id="' + data.id + '">Delete</a>';
                }
            }
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

    $(document).on("click", ".delete-career", function () {
        let careerId = $(this).data("id");
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
                    url: "/api/careers/" + careerId + "/",
                    headers: {
                        'Content-type': 'application/json',
                        'X-CSRFToken': csrftoken,
                    },
                    success: function () {
                        swal.fire(
                            'Deleted!',
                            'Item deleted.',
                            'success'
                        );
                        //removing the row
                        row.remove();
                    },
                    error: function () {
                        swal.fire(
                            'Error!',
                            'An error occurred while deleting the item.',
                            'error'
                        );
                    }
                });
            }
        });
    });
});
