window.onload = function () {
  document.getElementById("create-patient-form").reset();
};
const csrfToken = $('#create-patient-form input[name="csrfmiddlewaretoken"]').val();
$(document).ready(function () {
    $("#create-patient-form").submit(function (event) {
        event.preventDefault();

        // Clear existing error messages and styling
        clearFieldErrors();
        let phoneNumber = $("#phone_number").val();

        // Validate phone number length
        if (phoneNumber.length !== 10) {
            displayError($("#phone_number"), "Phone number must have exactly 10 digits.");
            return; // Stop form submission
        }

        // Validate phone number format using regular expression
        let phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            displayError($("#phone_number"), "Invalid phone number format.");
            return; // Stop form submission
        }

        let formData = {
            first_name: $("#first_name").val(),
            last_name: $("#last_name").val(),
            phone_number: phoneNumber,
            email: $("#email").val(),
            inpatient_number: $("#inpatient_number").val(),
            outpatient_number: $("#outpatient_number").val(),
            medical_history: $("#medical_history").val(),
            allergies: $("#allergies").val(),
            current_medications: $("#current_medications").val(),
            additional_info: $("#additional_info").val(),
        };

        $.ajax({
            type: "POST",
            url: "/api/patients/",
            data: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            success: function (response) {
                swal.fire({
                    title: "Success",
                    text: "Patient created successfully!",
                    icon: "success",
                    confirmButtonText: "OK"
                });
            },
            error: function (xhr) {
                if (xhr.status === 400) {
                    displayFieldErrors(xhr.responseJSON);
                } else {
                    alert("Error creating patient: " + xhr.responseText);
                }
            }
        });
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