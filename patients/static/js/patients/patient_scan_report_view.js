$(document).ready(function () {
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
    }

    $.ajax({
        url: `/api/scanreport/${patientId}/${scanReportId}/`,
        method: 'GET',
        success: function (data) {
            scanReportDetails  = data;
            console.log('Fetched scan report details:', scanReportDetails);
            populateForm();
        },
        error: function (error) {
            console.error('Error fetching patient details:', error);
        }
    });
});
