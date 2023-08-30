$(document).ready(function () {
    $.ajax({
        url: `/api/patients/${patientId}/`,
        method: "GET",
        success: function (data) {
            // Populate the table cells with data from the API response
            $("#patient_name").text(data.profile.first_name + " " + data.profile.last_name);
            $("#patient_email").text(data.profile.email);
            $("#patient_phone").text(data.profile.phone_number);
        },
        error: function () {
            console.log("Error fetching data from the API.");
        }
    });
});
$(document).ready(function() {
    // Fetch data from the API using AJAX
    $.ajax({
        url: `/api/invoices/${invoiceId}/`,
        method: "GET",
        success: function(data) {
            var items = data.items;
            var totalAmount = parseFloat(data.total_amount);
            $("#invoice_no").text('#'+ data.id);
            $('#invoice_date').text(new Date(data.invoice_date).toLocaleString());

            var tbodyHTML = "";

            // Loop through items and add rows to the tbodyHTML
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var subTotal = parseFloat(item.unit_price) * item.quantity;

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
        error: function(error) {
            console.error("Error fetching data:", error);
        }
    });
});
