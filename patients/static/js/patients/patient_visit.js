$(document).ready(function () {
    $.ajax({
        url: `/api/patients/${patientId}/`,
        method: "GET",
        success: function (data) {
            // Populate the table cells with data from the API response
            $("#name").text(data.profile.first_name + " " + data.profile.last_name);
            $("#ipno").text(data.inpatient_number);
            $("#opno").text(data.outpatient_number);
            $("#address").text(data.profile.address);
            $("#phone").text(data.profile.phone_number);
            $("#email").text(data.profile.email);
        },
        error: function () {
            console.log("Error fetching data from the API.");
        }
    });
});

$(document).ready(function () {
    let patientTable = $('#visitTable').DataTable({
        "processing": true,
        "serverSide": true,
        "searching": false,
        "ajax": {
            url: `/api/patients/${patientId}/patient-visits/`,
            "data": function (data) {
                let customData = {
                    page: (data.start / data.length) + 1,
                    page_size: data.length,
                    ordering: data.order[0].dir,
                };
                return customData;
            },
            "dataSrc": function (json) {
                json.recordsTotal = json.count;
                json.recordsFiltered = json.count;
                return json.results;
            }
        },
        "columns": [
            {"data": "id", title: 'ID', defaultContent: ''},
            {
                "data": "admission_date",
                "title": "Admission Date",
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
                "data": "discharge_date",
                "title": "Discharge Date",
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
                "data": "visit_date",
                "title": "Visit Date",
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
                "data": "follow_up_appointments",
                "title": "Follow Up Date",
                "defaultContent": "-",
                "render": function (data) {
                    if (data) {
                        return new Date(data).toLocaleString();
                    } else {
                        return "-";
                    }
                }
            },
            {"data": "reason_for_visit", title: 'Reason for Visit', defaultContent: '-'},
            {
                "data": null,
                "title": "Diagnosis",
                "render": function (data) {
                    if (data.diagnosis.length > 30) {
                        return '<button class="btn btn-link btn-diagnosis" data-diagnosis="' + data.diagnosis + '">View Diagnosis</button>';
                    } else {
                        return data.diagnosis;
                    }
                }
            },
            {
                "data": null,
                "title": "Treatment Notes",
                "render": function (data) {
                    if (data.treatment_notes.length > 30) {
                        return '<button class="btn btn-link btn-treatment" data-content="' + data.treatment_notes + '">View Treatment</button>';
                    } else {
                        return data.treatment_notes;
                    }
                }
            },
            {
                data: null,
                "title": "Actions",
                render: function (data) {
                    let visitId = data.id;
                    let url = "/patient-report/" + patientId + "/create/" + visitId + "/";
                    let editUrl = "/patient/" + patientId + "/patient-visit/" + visitId + "/update/";
                    let createInvoiceUrl=  "/patient-invoice/" + patientId + "/create/" + visitId + "/";
                    return '<a href="' + url + '" class="btn btn-primary btn-sm" data-id="' + data.id + '">Add Report</a> ' +
                        ' <a href="' + editUrl + '" class="btn btn-secondary btn-sm" data-id="' + data.id + '">Edit</a>'+
                        ' <a href="' + createInvoiceUrl + '" class="btn btn-primary btn-sm" data-id="' + data.id + '">Add Invoice</a>';
                }
            }

        ]
    });

    let scanTable = $('#scanReportTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: `/api/scanreport/${patientId}/`,
            "data": function (data) {
                let customData = {
                    page: (data.start / data.length) + 1,
                    page_size: data.length,
                    ordering: data.order[0].dir,
                };
                return customData;
            },
            "dataSrc": function (json) {
                json.recordsTotal = json.count;
                json.recordsFiltered = json.count;
                return json.results;
            }
        },
        "columns": [
            {"data": "id", title: 'ID', defaultContent: ''},
            {
                "data": "report_date",
                "title": "Report Date",
                "defaultContent": "-",
                "render": function (data) {
                    if (data) {
                        return new Date(data).toLocaleString();
                    } else {
                        return "-";
                    }
                }
            },
            {"data": "scan_type", title: 'Scan Type', defaultContent: ''},
            {"data": "patient_visit", title: 'Patient Visit', defaultContent: ''},
            {
                "data": "doctor",
                "title": "Doctor",
                "render": function (data) {
                    if (data) {
                        return data.first_name + ' ' + data.last_name;
                    }
                    return '-';
                }
            },
            {
                "data": "technician",
                "title": "technician",
                "render": function (data) {
                    if (data) {
                        return data.first_name + ' ' + data.last_name;
                    }
                    return '-';
                }
            },
            {
                data: null,
                "title": "Actions",
                render: function (data) {
                    var scanReportId = data.id;
                    var url = "/patient/" + patientId + "/scan-report/" + scanReportId + "/view/";
                    var editURL = "/patient/" + patientId + "/scan-report/" + scanReportId + "/update/";
                    return '<a href="' + url + '" class="btn btn-primary btn-sm" data-id="' + data.id + '" target="_blank">View</a>' +
                        ' <a href="' + editURL + '" class="btn btn-secondary btn-sm" data-id="' + data.id + '" target="_blank">Update</a>';
                }
            }
        ]
    });

    let invoiceTable = $('#invoiceTable').DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: `/api/invoices/${patientId}/invoice-patient/`,
            "data": function (data) {
                let customData = {
                    page: (data.start / data.length) + 1,
                    page_size: data.length,
                    ordering: data.order[0].dir,
                };
                return customData;
            },
            "dataSrc": function (json) {
                json.recordsTotal = json.count;
                json.recordsFiltered = json.count;
                return json.results;
            }
        },
        "columns": [
            {"data": "id", title: 'ID', defaultContent: ''},
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
                "title": "Due Date",
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
                "data": "payment_date",
                "title": "Payment Date",
                "defaultContent": "-",
                "render": function (data) {
                    if (data) {
                        return new Date(data).toLocaleString();
                    } else {
                        return "-";
                    }
                }
            },
            {"data": "total_amount", title: 'Total amount', defaultContent: ''},
            {"data": "is_paid", title: 'Paid', defaultContent: ''},
            {
                data: null,
                "title": "Actions",
                render: function (data) {
                    var invoiceId = data.id;
                    var viewUrl = "/patient/" + patientId + "/patient-invoice/" + invoiceId + "/view/";
                    return '<a href="' + viewUrl + '" class="btn btn-primary btn-sm" data-id="' + data.id + '" target="_blank">View</a>';
                }
            }

        ]
    });

    // Open SweetAlert when clicking the "View Diagnosis" button
    $('#visitTable tbody').on('click', '.btn-diagnosis', function () {
        let diagnosis = $(this).data('diagnosis');

        Swal.fire({
            title: 'Diagnosis',
            html: diagnosis,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Close'
        });
    });

    $('#visitTable tbody').on('click', '.btn-treatment', function () {
        let content = $(this).data('content');

        Swal.fire({
            title: 'Treatment Notes',
            html: content,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'Close'
        });
    });
});
