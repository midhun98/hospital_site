let fileName;

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
            $("#patient_ip_no").text("IP No. "+data.inpatient_number);
            $("#patient_op_no").text("OP No. "+data.outpatient_number);
            fileName = data.profile.first_name + " " + data.profile.last_name;
            claimNo = data.policy_number;
            if(claimNo){
                $("#policy_no").text("Claim no: "+claimNo);
            }
        },
        error: function () {
            console.log("Error fetching data from the API.");
        }
    });
});

$(document).ready(function () {
    // Fetch data from the API using AJAX
    $.ajax({
        url: `/api/invoices/${invoiceId}/`,
        method: "GET",
        success: function (data) {
            patientVisit = data.patient_visit;
            $.ajax({
                url: `/api/patients/${patientId}/patient-visits/${patientVisit}/`,
                method: "GET",
                success: function (visitData) {

                    const admissionDateTime = new Date(visitData.admission_date).toLocaleString();
                    const dischargeDateTime = new Date(visitData.discharge_date).toLocaleString();

                    if (admissionDateTime){
                        $("#admission_date").text("Admission Date: " + admissionDateTime);
                    }
                    if (dischargeDateTime){
                        $("#discharge_date").text("Discharge Date: " + dischargeDateTime);
                    }
                },
                error: function (error) {
                    console.error("Error fetching patient visit data:", error);
                }
            });

            let items = data.items;
            let totalAmount = parseFloat(data.total_amount);
            $("#invoice_no").text('#' + data.id);
            $('#invoice_date').text(new Date(data.invoice_date).toLocaleString());
            $('#invoice_name').text(data.invoice_name);

            let tbodyHTML = "";

            // Loop through items and add rows to the tbodyHTML
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                let subTotal = parseFloat(item.unit_price) * item.quantity;

                tbodyHTML += `
                    <tr>
                        <th scope="row">${i + 1}</th>
                        <td>
                            <div>
                                <h5 class="text-truncate font-size-14 mb-1">${item.description}</h5>
                            </div>
                        </td>
                        <td>₹ ${parseFloat(item.unit_price).toFixed(2)}</td>
                        <td>${item.quantity}</td>
                        <td class="text-end">₹ ${subTotal.toFixed(2)}</td>
                    </tr>
                `;
            }

            // Add the total row
            tbodyHTML += `
                <tr>
                    <th scope="row" colspan="4" class="text-end">Total</th>
                    <td class="text-end">₹ ${totalAmount.toFixed(2)}</td>
                </tr>
            `;

            // Insert the constructed tbodyHTML into the table body
            $("#table-container tbody").html(tbodyHTML);
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