window.onload = function () {
  document.getElementById("patient-visit-create-form").reset();
};
const csrfToken = $('#patient-visit-create-form input[name="csrfmiddlewaretoken"]').val();
$(document).ready(function () {
    $("#patient-visit-create-form").submit(function (event) {
        event.preventDefault();

        let formData = {
            admission_date: $("#admission_date").val(),
            discharge_date: $("#discharge_date").val(),
            visit_date: $("#visit_date").val(),
            follow_up_appointments: $("#follow_up_appointments").val(),
            reason_for_visit: $("#reason_for_visit").val(),
            diagnosis: $("#diagnosis").val(),
            treatment_notes: $("#treatment_notes").val(),
        };

        $.ajax({
            type: "POST",
            url: `/api/patients/${patientId}/patient-visits/`,
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
                console.error(xhr.responseJSON);  // Print the detailed error response
                if (xhr.status === 400) {
                    displayFieldErrors(xhr.responseJSON);
                } else {
                    alert("Error creating patient: " + xhr.responseText);
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