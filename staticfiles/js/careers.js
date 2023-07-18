/* jshint esversion: 6 */
// Submit the career form

$('#career-form').submit(function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    $.ajax({
        url: "/api/careers/",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function () {
            swal.fire("Details Sent!");
            let alert = document.getElementById("career-errors");
            alert.style.display = "none";
            e.target.reset();
        },
        error: function (xhr) {
            let response = xhr.responseJSON;
            if (response.hasOwnProperty('errors')) {
                let errors = response.errors;
                let message = "Error submitting the details:<br>";
                for (let field in errors) {
                    if (errors.hasOwnProperty(field)) {
                        message += field + ": " + errors[field][0] + "<br>";
                    }
                }
                let alert = document.getElementById("career-errors");
                alert.innerHTML = message;
                alert.style.display = "block";
            } else {
                swal.fire("Error uploading details");
            }
        }
    });
});
