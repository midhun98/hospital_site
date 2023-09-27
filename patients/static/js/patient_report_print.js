$(document).ready(function () {
    $.ajax({
        url: `/api/patients/${patientId}/`,
        method: "GET",
        success: function (data) {
            // Populate the table cells with data from the API response
            $("#patient_name").text(data.profile.first_name + " " + data.profile.last_name);
            $("#patient_address").text(data.address);
            $("#patient_email").text(data.profile.email === null ? '' : data.profile.email);
            $("#patient_phone").text(data.profile.phone_number);
            fileName = data.profile.first_name + " " + data.profile.last_name
        },
        error: function () {
            console.log("Error fetching data from the API.");
        }
    });
});

console.log('scan_id', scan_id);
console.log('patientId', patientId);

$(document).ready(function () {

    // Fetch data from the API using AJAX
    $.ajax({
        url: `/api/scanreport/${patientId}/${scan_id}/`,
        method: "GET",
        success: function (data) {
            $("#report_no").text('#' + data.id);
            $('#report_date').text(new Date(data.report_date).toLocaleString());

            // Assuming findings is the table data
            $('#tableContainer').html(data.findings);  // Inject table data into a container

            ClassicEditor
                .create( document.querySelector( '#tableContainer' ), {
                    toolbar: [],  // Set an empty array to hide the toolbar
                })
                .then( editor => {
                    editor.enableReadOnlyMode('lock1'); // Enable read-only mode
                })
                .catch( error => {
                    console.error( error );
                });


            // Update the invoice name and report summary
            $('#invoice_name').text(data.scan_type);  // Replace with actual invoice name
        },
        error: function (error) {
            console.error("Error fetching data:", error);
        }
    });
});

window.onload = function () {
    document.getElementById("download")
    .addEventListener("click", () => {
        const invoice = this.document.getElementById("invoice");
        console.log(invoice);
        console.log(window);
        let opt = {
            margin: 0.1,
            filename: fileName,
            image: {type: 'jpeg', quality: 1},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
        };
        html2pdf().from(invoice).set(opt).save();
    })
}