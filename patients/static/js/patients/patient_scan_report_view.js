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


    let scanReportDetails = {};

    function populateForm() {
        $('#report_date').val(scanReportDetails.report_date).prop('disabled', true);
        $('#scan_type').val(scanReportDetails.scan_type).prop('disabled', true);
        $('#findings').val(scanReportDetails.findings);
        $('#conclusion').val(scanReportDetails.conclusion).prop('disabled', true);
        $('#patient_visit').val(scanReportDetails.patient_visit).prop('disabled', true);

        // Initialize Froala Editor after populating the form
        var editor = new FroalaEditor('#findings', {
            toolbarButtons: ['fullscreen', 'print'],
        });
        // Populate scan images
        const scanImages = scanReportDetails.scan_images;
        const galleryDiv = $('.gallery');

        for (const image of scanImages) {
            const imageUrl = image.image_file;
            const fileName = getFileName(imageUrl);
            const fileExtension = getFileExtension(imageUrl);
            let fileContent;

            if (imageIsPDF(fileExtension)) {
                fileContent = `
                    <div class="image-container">
                        <label>
                            <iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(imageUrl)}&embedded=true" frameborder="0" style="width:100%; height:100%;"></iframe>
                        </label>                            
                    </div>`;
            } else if (imageIsImage(fileExtension)) {
                fileContent = `
                     <div class="image-container">
                    <label>
                        <a href="${imageUrl}" target="_blank">
                            <figure><img class="img-fluid img-thumbnail" src="${imageUrl}" alt="Scan Image" style="width: 200px; height: 200px"></figure>${fileName}
                        </a>
                    </label>                            
                    </div>`;
            } else {
                fileContent = `
                <div class="image-container">
                    <label>
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
});
