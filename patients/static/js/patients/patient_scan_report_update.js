$(document).ready(function () {
        let scanTable = $('#scanReportDocumentsTable').DataTable({
        "ajax": {
            url: `/api/scanreport/${patientId}/${scanReportId}/`,
            dataSrc: "scan_images"
        },
        "columns": [
            {"data": "id", "title": "ID", "defaultContent": ""},
            {
                "data": "uploaded_at",
                "title": "Creation Date",
                "defaultContent": "-",
                "render": function (data) {
                    if (data) {
                        return new Date(data).toLocaleString();
                    } else {
                        return "-";
                    }
                }
            },
            {
                "data": "image_file",
                "title": "Document link",
                "defaultContent": "-",
                "render": function (data) {
                    if (data) {
                        return `<a href="${data}" target="_blank">${getFileName(data)}</a>`;
                    } else {
                        return "-";
                    }
                }
            },
            {
                "data": "image_file",
                "title": "File Name",
                "defaultContent": "-",
                "render": function (data) {
                    if (data) {
                        return getFileName(data);
                    } else {
                        return "-";
                    }
                }
            }
        ]
    });

    document.getElementById('scan_files').addEventListener('change', function () {
        const selectedFilesContainer = document.getElementById('selected-files');
        selectedFilesContainer.innerHTML = ''; // Clear previous selections

        const filesInput = this;
        for (let i = 0; i < filesInput.files.length; i++) {
            const file = filesInput.files[i];
            const fileNameElement = document.createElement('p');
            fileNameElement.textContent = file.name;
            selectedFilesContainer.appendChild(fileNameElement);
        }
    });

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
            const imageId = image.id;  // Get the image ID
            const imageUrl = image.image_file;
            const fileName = getFileName(imageUrl);
            const fileExtension = getFileExtension(imageUrl);
            let fileContent;

            if (imageIsPDF(fileExtension)) {
                fileContent = `
                    <div class="image-container">
                        <label>
                            <input type="checkbox" class="image-checkbox" data-image-id="${imageId}">
                            <iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(imageUrl)}&embedded=true" frameborder="0" style="width:100%; height:100%;"></iframe>
                        </label>                            
                    </div>`;
            } else if (imageIsImage(fileExtension)) {
                fileContent = `
                     <div class="image-container">
                    <label>
                        <input type="checkbox" class="image-checkbox" data-image-id="${imageId}">
                        <a href="${imageUrl}" target="_blank">
                            <figure><img class="img-fluid img-thumbnail" src="${imageUrl}" alt="Scan Image" style="width: 200px; height: 200px"></figure>${fileName}
                        </a>
                    </label>                            
                    </div>`;
            } else {
                fileContent = `
                <div class="image-container">
                    <label>
                        <input type="checkbox" class="image-checkbox" data-image-id="${imageId}">
                        <a href="${imageUrl}" target="_blank">
                            <figure><img class="img-fluid img-thumbnail" src="https://res.cloudinary.com/dbzcqkvnj/image/upload/v1692944606/rodeo.jpg" style="width: 200px; height: 200px"></figure>${fileName}
                        </a>
                    </label>                            
                </div>`;
            }

            const fileTag = `<div class="col-lg-3 col-md-4 col-xs-6 thumb">${fileContent}</div>`;
            galleryDiv.append(fileTag);
        }
    }

    $('#delete-selected-images').on('click', function () {
        const selectedImageIds = [];

        $('.image-checkbox:checked').each(function () {
            const imageId = $(this).data('image-id');
            selectedImageIds.push(imageId);
        });

        if (selectedImageIds.length === 0) {
            swal.fire({
                text: "Select atleast one image to delete!",
                icon: "info",
                confirmButtonText: "OK"
            });
            return;
        }
        console.log('selectedImageIds', selectedImageIds);
        // Show SweetAlert confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                // Make an API call to delete the selected images using the selectedImageIds
                $.ajax({
                    url: `/api/scanreport/${patientId}/${scanReportId}/`,
                    method: 'PATCH',
                    data: JSON.stringify({image_ids_to_delete: selectedImageIds}),
                    contentType: 'application/json',
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
                        // Handle success (e.g., remove the selected image containers from the gallery)
                        for (const imageId of selectedImageIds) {
                            $(`.image-checkbox[data-image-id="${imageId}"]`).closest('.image-container').remove();
                        }
                        // Refresh the DataTable after successful deletion
                        scanTable.ajax.reload();
                    },
                    error: function (error) {
                        console.error('Error deleting images:', error);
                    }
                });
            }
        });
    });


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

    function fetchScanReportDetails() {
        $.ajax({
            url: `/api/scanreport/${patientId}/${scanReportId}/`,
            method: 'GET',
            success: function (data) {
                scanReportDetails = data;
                populateForm();
            },
            error: function (error) {
                console.error('Error fetching scan report details:', error);
            }
        });
    }

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
        let selectedData = $("#patient_visit").select2('data');

        if (selectedData && selectedData.length > 0) {
            selectedPatientVisit = selectedData[0].id;
            formData.append('patient_visit', selectedPatientVisit);
        }

        formData.append('scan_type', $("#scan_type").val());
        formData.append('findings', $("#findings").val());
        formData.append('conclusion', $("#conclusion").val());

        let filesInput = document.getElementById('scan_files');
        for (let i = 0; i < filesInput.files.length; i++) {
            formData.append('scan_files', filesInput.files[i]);
        }

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
                // Refresh the DataTable after success
                scanTable.ajax.reload();
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
    fetchScanReportDetails();
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