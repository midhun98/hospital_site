/* jshint esversion: 6 */

// load the table and its contents
$.ajax({
    type: "GET",
    url: "/api/patients/",
    dataType: "json",
    success: function (data) {
        'use strict';
        $.each(data, function (index, item) {
            let date = new Date(item.date);
            let formattedDate = date.toLocaleDateString();
            let id = item.id;
            let deleteButton = `<button class='btn btn btn-info' data-id="${id}">Detail View</button></td>"`;
            $("#all-patients-table tbody").append(
                "<tr>" +
                "<td>" + item.profile.user.first_name + "</td>" +
                "<td>" + item.profile.user.last_name + "</td>" +
                "<td>" + item.profile.mobile + "</td>" +
                "<td>" + item.inpatient_number + "</td>" +
                "<td>" + item.outpatient_number + "</td>" +
                "<td>" + deleteButton + "</td>" +
                "</tr>"
            );
        });
        $('#all-patients-table').DataTable();
    }
})
;