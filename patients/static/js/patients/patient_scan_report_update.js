$(document).ready(function () {
    $('#scan_files').val('');
    initializeSelect2WithPagination({
        apiUrl: `/api/patients/${patientId}/patient-visits/`,
        elementSelector: '#patient_visit',
        textProperty: 'visit_date',
        placeholder: 'Select a visit to add the report',
        multiple: false, // Disable multiselect for this instance
        formatDateTime: true,  // Apply date-time formatting
    });

    let scanReportDetails = {};

    function populateForm() {
        if (scanReportDetails.report_date) {
            $('#report_date').val(new Date(scanReportDetails.report_date).toLocaleString());
        } else {
            $('#report_date').val('');
        }

        $('#scan_type').val(scanReportDetails.scan_type);
        $('#findings').val(scanReportDetails.findings);
        $('#conclusion').val(scanReportDetails.conclusion);
        $('#current_patient_visit').val(scanReportDetails.patient_visit);

        // Initialize Froala Editor after populating the form
        var editor = new FroalaEditor('#findings');
        // Populate scan images
        const scanImages = scanReportDetails.scan_images;
        const galleryDiv = $('.gallery');

        for (const image of scanImages) {
            const imageUrl = image.image_file;
            const fileName = getFileName(imageUrl);
            const fileExtension = getFileExtension(imageUrl);
            let fileContent;

            if (imageIsPDF(fileExtension)) {
                fileContent = `<iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(imageUrl)}&embedded=true" frameborder="0" style="width:100%; height:100%;"></iframe>`;
            } else if (imageIsImage(fileExtension)) {
                fileContent = `<a href="${imageUrl}">
                                <figure><img class="img-fluid img-thumbnail" src="${imageUrl}" alt="Scan Image"></figure>
                            </a>`;
            } else {
                fileContent = `<a href="${imageUrl}" target="_blank">${fileName}</a>`;
            }

            const fileTag = `<div class="col-lg-3 col-md-4 col-xs-6 thumb">${fileContent}</div>`;
            galleryDiv.append(fileTag);
        }
    }

    function getFileName(filepath) {
        return filepath.split('/').pop();
    }

    function getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    function imageIsPDF(extension) {
        return extension === 'pdf';
    }

    function imageIsImage(extension) {
        return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
    }

    $.ajax({
        url: `/api/scanreport/${patientId}/${scanReportId}/`,
        method: 'GET',
        success: function (data) {
            scanReportDetails = data;
            populateForm();
        },
        error: function (error) {
            console.error('Error fetching patient details:', error);
        }
    });

    $("#patient-report-create-form").submit(function (event) {
        event.preventDefault();
        let formData = new FormData();  // Create FormData object
        var inputDate = $('#report_date').val();

        // parsing with the first format string
        var parsedDate = moment(inputDate, ["D/M/YYYY, h:mm:ss a", "YYYY-MM-DD HH:mm"]);

        if (parsedDate.isValid()) {
            formData.append('report_date', parsedDate.toISOString());  // Convert to ISO 8601 format for API
        } else {
            console.error('Invalid date format');
        }
        let selectedPatientVisit = $("#patient_visit").select2('data')[0].id;
        console.log('selectedPatientVisit', selectedPatientVisit)
        formData.append('scan_type', $("#scan_type").val());
        formData.append('findings', $("#findings").val());
        formData.append('conclusion', $("#conclusion").val());
        formData.append('patient_visit', selectedPatientVisit);

        let filesInput = document.getElementById('scan_files');
        for (let i = 0; i < filesInput.files.length; i++) {
            formData.append('scan_files', filesInput.files[i]);
        }

        console.log(formData)
        $.ajax({
            url: `/api/scanreport/${patientId}/${scanReportId}/`,
            method: 'PATCH',
            data: formData,  // Use FormData object
            contentType: false, // Important: Set to false for multipart/form-data
            processData: false, // Important: Set to false for multipart/form-data
            headers: {
                'X-CSRFToken': csrfToken,
            },
            success: function (response) {
                swal.fire({
                    title: "Success",
                    text: "Report updated successfully!",
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