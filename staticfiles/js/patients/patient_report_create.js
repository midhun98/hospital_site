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
        // let selectedPatientVisit = $("#patient_visit").select2('data')[0].id;
        let formData = new FormData();  // Create FormData object

        formData.append('report_date', $("#report_date").val());
        formData.append('scan_type', $("#scan_type").val());
        formData.append('findings', $("#findings").val());
        formData.append('conclusion', $("#conclusion").val());
        formData.append('patient_visit', visitId);

        let filesInput = document.getElementById('scan_files');
        for (let i = 0; i < filesInput.files.length; i++) {
            formData.append('scan_files', filesInput.files[i]);
        }

        $.ajax({
            type: "POST",
            url: `/api/scanreport/${patientId}/`,
            data: formData,  // Use FormData object
            contentType: false, // Important: Set to false for multipart/form-data
            processData: false, // Important: Set to false for multipart/form-data
            headers: {
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
                console.error(xhr.responseJSON);
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