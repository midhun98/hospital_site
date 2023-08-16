$(document).ready(function () {
    // Get the patient ID from the URL
    let patientId = window.location.pathname.split('/').slice(-2, -1)[0];

    // Initialize an empty object to hold patient details
    let patientDetails = {};

    // Function to populate the form fields with patient details
    function populateForm() {
        $('#first_name').val(patientDetails.profile.first_name);
        $('#last_name').val(patientDetails.profile.last_name);
        $('#phone_number').val(patientDetails.profile.phone_number);
        $('#email').val(patientDetails.profile.email);
        $('#inpatient_number').val(patientDetails.inpatient_number);
        $('#outpatient_number').val(patientDetails.outpatient_number);
        $('#medical_history').val(patientDetails.medical_history);
        $('#allergies').val(patientDetails.allergies);
        $('#current_medications').val(patientDetails.current_medications);
        $('#additional_info').val(patientDetails.additional_info);
    }

    // Fetch patient details using AJAX
    $.ajax({
        url: '/api/patients/' + patientId + '/',
        method: 'GET',
        success: function (data) {
            patientDetails = data;
            populateForm();
        },
        error: function (error) {
            console.error('Error fetching patient details:', error);
        }
    });


    // Function to update patient details
    function updatePatientDetails() {
        clearFieldErrors();
        let phoneNumber = $("#phone_number").val();

        // Validate phone number length
        if (phoneNumber.length !== 10) {
            displayError($("#phone_number"), "Phone number must have exactly 10 digits.");
            return; // Stop form submission
        }

        // Collect updated data from form fields
        let updatedData = {
            first_name: $('#first_name').val(),
            last_name: $('#last_name').val(),
            phone_number: $('#phone_number').val(),
            email: $('#email').val(),
            inpatient_number: $('#inpatient_number').val(),
            outpatient_number: $('#outpatient_number').val(),
            medical_history: $('#medical_history').val(),
            allergies: $('#allergies').val(),
            current_medications: $('#current_medications').val(),
            additional_info: $('#additional_info').val()
        };
        // Get the CSRF token from the HTML form
        let csrfToken = $('input[name="csrfmiddlewaretoken"]').val();

        // Perform AJAX request to update patient details
        $.ajax({
            url: '/api/patients/' + patientId + '/',
            method: 'PATCH', // Use the appropriate HTTP method for updating
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
                console.log('Patient details updated successfully');
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
