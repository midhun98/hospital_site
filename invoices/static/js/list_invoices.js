$(document).ready(function () {
    // Initialize DataTable
    let invoicesTable = $('#invoices-table').DataTable({
        "processing": true,
        "serverSide": true,
        "searching": false, // Hide the search bar
        "ajax": {
            "url": "/api/invoices/",
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
            {"data": "total_amount", title: 'Total Amount', defaultContent: ''},
            {
                "data": "is_paid",
                "title": 'Payment Status',
                "defaultContent": '',
                "render": function(data, type, row, meta) {
                    if (type === 'display') {
                        if (data === true) {
                            return "Paid";
                        } else {
                            return "Not Paid";
                        }
                    }
                    return data;
                }
            },
            {
                "data": "invoice_date",
                "title": "Invoice Date",
                "defaultContent": "-",
                "render": function (data) {
                    if (data) {
                        return new Date(data).toLocaleString();
                    } else {
                        return "-";
                    }
                }
            },
            {
                "data": "due_date",
                "title": "Due date",
                "defaultContent": "-",
                "render": function (data) {
                    if (data) {
                        return new Date(data).toLocaleString();
                    } else {
                        return "-";
                    }
                }
            },
            {
                "data": "patient_visit",
                "title": 'Patient Visit',
                "defaultContent": '',
                "render": function(data, type, row, meta) {
                    if (type === 'display') {
                        var visitId = row.patient_visit; // Assuming the visit ID is in the data
                        var link = '<a href="/patient-visit/' + visitId + '/" target="_blank">' + data + '</a>';
                        return link;
                    }
                    return data;
                }
            },
            {
                "data": null,
                "title": "Actions",
                "defaultContent": '<button class="btn btn-primary btn-sm btn-view">Detail View/Edit</button> ' +
                                   '<button class="btn btn-light btn-sm btn-visit">Add Visit</button>'
            },
        ],
    });

    // Handle search input changes
    $('#search-input-phone, #search-input-inpatient, #search-input-outpatient').on('keyup', function () {
        invoicesTable.ajax.reload();
    });

    $('#invoices-table').on('click', '.btn-view', function () {
        var rowIndex = $(this).closest('tr').index();
        var rowData = invoicesTable.row(rowIndex).data();

        if (rowData) {
            var patientId = rowData.id;
            // Redirect to the detailed view/edit page for the patient
            window.location.href = '/patient/' + patientId + '/';
        }
    });

    $('#invoices-table').on('click', '.btn-visit', function () {
        var rowIndex = $(this).closest('tr').index();
        var rowData = invoicesTable.row(rowIndex).data();

        if (rowData) {
            var patientId = rowData.id;
            // Redirect to the add visit for the patient
            window.location.href = '/patient-visit/' + patientId + '/';
        }
    });

});
