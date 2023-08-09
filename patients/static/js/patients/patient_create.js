const csrfToken = $('#create-patient-form input[name="csrfmiddlewaretoken"]').val();
$(document).ready(function () {
    $("#create-patient-form").submit(function (event) {
        event.preventDefault();

        var formData = {
            first_name: $("#first_name").val(),
            last_name: $("#last_name").val(),
            phone_number: $("#phone_number").val(),
            email: $("#email").val(),
            inpatient_number: $("#inpatient_number").val(),
            outpatient_number: $("#outpatient_number").val(),
            medical_history: $("#medical_history").val(),
            allergies: $("#allergies").val(),
            current_medications: $("#current_medications").val(),
        };

        $.ajax({
            type: "POST",
            url: "/api/patients/",  // Replace with your API endpoint URL
            data: JSON.stringify(formData),
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            success: function (response) {
                alert("Patient created successfully!");
                // You can redirect or perform any other action here
            },
            error: function (error) {
                alert("Error creating patient: " + error.responseText);
            }
        });
    });
});
