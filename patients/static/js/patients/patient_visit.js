$(document).ready(function () {
    let patientId = window.location.pathname.split('/').slice(-2, -1)[0];

    $.ajax({
        url: '/api/patients/' + patientId + '/',
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
            "url": "http://127.0.0.1:8000/api/patients/32/patient-visits/",
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
            {"data": "admission_date", title: 'Admission Date', defaultContent: '-'},
            {"data": "discharge_date", title: 'Discharge Date', defaultContent: '-'},
            {"data": "visit_date", title: 'Visit Date', defaultContent: '-'},
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
            },]
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
