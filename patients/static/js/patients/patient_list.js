$(document).ready(function () {
    // Initialize DataTable
    let patientTable = $('#patient-table').DataTable({
        "processing": true,
        "serverSide": true,
        "searching": false, // Hide the search bar
        "ajax": {
            "url": "/api/patients/",
            "data": function (data) {
                let customData = {
                    page: (data.start / data.length) + 1,
                    page_size: data.length,
                    ordering: data.order[0].dir, // Add ordering if needed
                    phone_number: $('#search-input-phone').val(),
                    inpatient_number: $('#search-input-inpatient').val(),
                    outpatient_number: $('#search-input-outpatient').val()
                };
                return customData;
            },
            "dataSrc": function (json) {
                json.recordsTotal = json.count;
                json.recordsFiltered = json.count;
                return json.results;
            } // Specify the key in the API response containing the data array
        },
        "columns": [
            {"data": "id", title: 'ID', defaultContent: ''},
            {"data": "profile.first_name", title: 'First Name', defaultContent: ''},
            {"data": "profile.last_name", title: 'Last Name', defaultContent: ''},
            {"data": "profile.phone_number", title: 'Phone', defaultContent: ''},
            {"data": "profile.email", title: 'Email', defaultContent: ''},
            {"data": "inpatient_number", title: 'IP Number', defaultContent: ''},
            {"data": "outpatient_number", title: 'OP Number', defaultContent: ''},
        ]
    });

    // Handle search input changes
    $('#search-input-phone, #search-input-inpatient, #search-input-outpatient').on('keyup', function () {
        patientTable.ajax.reload();
    });
});
