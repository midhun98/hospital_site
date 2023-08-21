window.onload = function () {
    document.getElementById("patient-report-create-form").reset();
};
const csrfToken = $('#patient-report-create-form input[name="csrfmiddlewaretoken"]').val();
$(document).ready(function () {
    initializeSelect2WithPagination({
        apiUrl: `/api/patients/${patientId}/patient-visits/`,
        elementSelector: '#patient_visit',
        textProperty: 'visit_date',
        placeholder: 'Select a visit to add the report',
        multiple: false, // Disable multiselect for this instance
        formatDateTime: true,  // Apply date-time formatting
    });
    $("#patient-report-create-form").submit(function (event) {
        event.preventDefault();
        let selectedPatientVisit = $("#patient_visit").select2('data')[0].id;
        let formData = {
            report_date: $("#report_date").val(),
            scan_type: $("#scan_type").val(),
            findings: $("#findings").val(),
            conclusion: $("#conclusion").val(),
            patient_visit: selectedPatientVisit,
        };

        $.ajax({
            type: "POST",
            url: `/api/scanreport/${patientId}/`,
            data: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            success: function (response) {
                swal.fire({
                    title: "Success",
                    text: "Report created successfully!",
                    icon: "success",
                    confirmButtonText: "OK"
                });
            },
            error: function (xhr) {
                console.error(xhr.responseJSON);  // Print the detailed error response
                if (xhr.status === 400) {
                    displayFieldErrors(xhr.responseJSON);
                } else {
                    alert("Error creating report: " + xhr.responseText);
                }
            }
        });
    });

});

function displayFieldErrors(errors) {
    for (let field in errors) {
        if (errors.hasOwnProperty(field)) {
            let inputElement = $("#" + field);
            let errorMessage = errors[field][0];
            displayError(inputElement, errorMessage);
        }
    }
}

function displayError(inputElement, errorMessage) {
    let errorElement = $("<div class='error-message'></div>").text(errorMessage);
    inputElement.addClass("input-error");
    inputElement.after(errorElement);
}