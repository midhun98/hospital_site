/* jshint esversion: 6 */
// Submit the appointment form
$('#appointment-form').submit(function (e) {
    "use strict";
    const formData = new FormData(e.target);
    e.preventDefault();
    $.ajax({
        url: "api/appointments/",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
    }).done(function () {
        swal.fire("Created an appointment!");
        // remove the alert if it's a success
        let alert = document.querySelector(".alert");
        alert.remove();
    }).fail(function (jqXHR) {
        let errors = JSON.parse(jqXHR.responseText);
        let message = "Error creating appointment:<br>";
        for (let field in errors) {
            if (errors.hasOwnProperty(field)) {
                message += field + ": " + errors[field][0] + "<br>";
            }
        }
        const alert = document.querySelector(".alert");
        alert.innerHTML = message;
        alert.style.display = "block";
        swal.fire("Error creating appointment");
    });
});


window.addEventListener('load', function () {
    "use strict";
    $('#appointment-form')[0].reset();
});