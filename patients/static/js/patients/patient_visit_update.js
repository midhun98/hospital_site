$(document).ready(function () {

    // Initialize an empty object to hold patient details
    let patientDetails = {};

    // Function to populate the form fields with patient details
    function populateForm() {
        if (patientDetails.admission_date) {
            $('#admission_date').val(new Date(patientDetails.admission_date).toLocaleString());
        } else {
            $('#admission_date').val('');
        }

        if (patientDetails.discharge_date) {
            $('#discharge_date').val(new Date(patientDetails.discharge_date).toLocaleString());
        } else {
            $('#discharge_date').val('');
        }

        if (patientDetails.follow_up_appointments) {
            $('#follow_up_appointments').val(new Date(patientDetails.follow_up_appointments).toLocaleString());
        } else {
            $('#follow_up_appointments').val('');
        }

        if (patientDetails.visit_date) {
            $('#visit_date').val(new Date(patientDetails.visit_date).toLocaleString());
        } else {
            $('#visit_date').val('');
        }
        $('#reason_for_visit').val(patientDetails.reason_for_visit);
        $('#diagnosis').val(patientDetails.diagnosis);
        $('#treatment_notes').val(patientDetails.treatment_notes);
    }


    // Fetch patient details using AJAX
    $.ajax({
        url: '/api/patients/' + patientId + '/patient-visits/' + visitId + "/",
        method: 'GET',
        success: function (data) {
            patientDetails = data;
            populateForm();
        },
        error: function (error) {
            console.error('Error fetching patient visit details:', error);
        }
    });


    // Function to update patient details
    function updatePatientDetails() {
        clearFieldErrors();
        // Collect updated data from form fields

        let updatedData = {
            admission_date: moment($('#admission_date').val(), ["D/M/YYYY, h:mm:ss a", "YYYY-MM-DD HH:mm"]).toDate(),
            discharge_date: moment($('#discharge_date').val(), ["D/M/YYYY, h:mm:ss a", "YYYY-MM-DD HH:mm"]).toDate(),
            follow_up_appointments: moment($('#follow_up_appointments').val(), ["D/M/YYYY, h:mm:ss a", "YYYY-MM-DD HH:mm"]).toDate(),
            visit_date: moment($('#visit_date').val(), ["D/M/YYYY, h:mm:ss a", "YYYY-MM-DD HH:mm"]).toDate(),
            reason_for_visit: $('#reason_for_visit').val(),
            diagnosis: $('#diagnosis').val(),
            treatment_notes: $('#treatment_notes').val(),
        };
        console.log("updatedData", updatedData)
        // Get the CSRF token from the HTML form
        let csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

        // Perform AJAX request to update patient details
        $.ajax({
            url: '/api/patients/' + patientId + '/patient-visits/' + visitId + "/",
            method: 'PATCH',
            data: JSON.stringify(updatedData),
            dataType: 'json', // Expect JSON response
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': csrfToken,
            },
            success: function () {
                swal.fire({
                    title: "Success",
                    text: "Patient Updated successfully!",
                    icon: "success",
                    confirmButtonText: "OK"
                });

                // Handle success, e.g., show a success message or redirect
                console.log('Patient Visit details updated successfully');
            },
            error: function (xhr) {
                displayFieldErrors(xhr.responseJSON);
                swal.fire({
                    title: "Error",
                    text: "There were some errors while updating",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            }
        });
    }

    // Attach a click event handler to the "Update Patient" button
    $('#update-patient-button').on('click', function () {
        console.log('Updating patient details...'); // Add this line to check if the function is being called

        updatePatientDetails();
    });

});

function clearFieldErrors() {
    $(".error-message").remove(); // Remove existing error messages
    $(".input-error").removeClass("input-error"); // Remove error styling
}

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
