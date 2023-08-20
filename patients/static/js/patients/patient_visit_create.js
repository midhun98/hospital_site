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
            reason_for_visit: $("#reason_for_visit").val(),
            diagnosis: $("#diagnosis").val(),
        };

        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8000/api/patients/32/patient-visits/",
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
