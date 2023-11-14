$(document).ready(function () {
    // Initialize DataTable
    let invoicesTable = $('#invoices-table').DataTable({
        "processing": true,
        "serverSide": true,
        "searching": false, // Hide the search bar
        "ajax": {
            "url": "/api/invoices/invoice-list/",
            "data": function (data) {
                return {
                    page: (data.start / data.length) + 1,
                    page_size: data.length,
                    ordering: data.order[0].dir, // Add ordering if needed
                    id: $('#search-id').val(),
                    paid: $('#search-input-paid').is(':checked'),
                    unpaid: $('#search-input-unpaid').is(':checked'),
                    all: $('#search-input-all').is(':checked'),
                    filter_date_range: $('#filter_date_range').val(),

                };
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
                "render": function(data, type) {
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
                "data": "patient_id",
                "title": 'Patient ID',
                "defaultContent": '',
                "render": function(data, type, row) {
                    if (type === 'display') {
                        let patientId = row.patient_id; // Assuming the visit ID is in the data
                        return '<a href="/patient-visit/' + patientId + '/" target="_blank">' + data + '</a>';
                    }
                    return data;
                }
            },
        ],
    });

    // Handle search input changes
    $('#search-id').on('keyup', function () {
        invoicesTable.ajax.reload();
    });

    // Handle payment status changes
    $('#search-input-paid, #search-input-unpaid, #search-input-all').on('change', function () {
        invoicesTable.ajax.reload();
    });

    // Handle filter_date_range changes
    $('#filter_date_range').on('change', function () {
        invoicesTable.ajax.reload();
    });
});
