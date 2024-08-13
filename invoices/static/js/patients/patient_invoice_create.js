function calculateSubtotal(row) {
    let quantityInput = row.querySelector('[name="quantity[]"]');
    let quantityValue = parseFloat(quantityInput.value);

    // Check if quantity is empty or not a number
    if (isNaN(quantityValue) || quantityValue <= 0) {
        quantityInput.value = '1'; // Set quantity to 1 if empty or invalid
        quantityValue = 1;
    }

    let unitPrice = parseFloat(row.querySelector('[name="unit_price[]"]').value);
    let subtotal = (quantityValue * unitPrice).toFixed(2);

    row.querySelector('.subtotal').textContent = '₹' + subtotal;

    // Recalculate the total when a change is made
    updateTotal();
}

function addInvoiceItem() {
    let itemContainer = document.getElementById('invoice-items').getElementsByTagName('tbody')[0];
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
                <td><input type="text" name="description[]" required></td>
                <td><input type="number" name="quantity[]" min="1" required oninput="calculateSubtotal(this.parentElement.parentElement)"></td>
                <td><input type="number" name="unit_price[]" step="0.01" required oninput="calculateSubtotal(this.parentElement.parentElement)"></td>
                <td class="subtotal"></td>
                <td><button type="button" class="btn btn-danger delete-row">Delete</button></td>

            `;
    itemContainer.appendChild(newRow);
    // Attach event listener to delete button for the new row
    let deleteButton = newRow.querySelector('.delete-row');
    deleteButton.addEventListener('click', function () {
        deleteRow(newRow);
    });
}


function updateTotal() {
    let subtotals = document.querySelectorAll('.subtotal');
    let total = 0;

    subtotals.forEach(function (subtotal) {
        let subtotalValue = subtotal.textContent.substring(1); // Remove the '₹' sign
        if (subtotalValue) {
            total += parseFloat(subtotalValue);
        }
    });

    document.getElementById('total-amount').textContent = '₹' + total.toFixed(2);
}

function deleteRow(row) {
    row.remove();
    updateTotal();
}


function createInvoice(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    var totalAmountElement = document.getElementById('total-amount').textContent;
    var totalAmountValue = parseFloat(totalAmountElement.replace('₹', '').trim());
    var paymentModeSelect = document.getElementById("payment_mode");
    var paymentMode = paymentModeSelect.value;
    let invoiceData = {
        patient_visit: visitId,  // Replace with the actual patient visit ID
        due_date: $("#due_date").val(),
        total_amount: totalAmountValue,
        invoice_name: $("#invoice_name").val(),
        payment_mode: paymentMode,
    };
    let invoiceItems = [];
    let rows = document.querySelectorAll('#invoice-items tbody tr');
    rows.forEach(function (row) {
        let description = row.querySelector('[name="description[]"]').value;
        let quantity = parseInt(row.querySelector('[name="quantity[]"]').value);
        let unitPrice = parseFloat(row.querySelector('[name="unit_price[]"]').value);

        // Check if the row contains non-empty values
        if (description.trim() !== '' && !isNaN(quantity) && !isNaN(unitPrice)) {
            invoiceItems.push({
                description: description,
                quantity: quantity,
                unit_price: unitPrice
            });
        }
    });
    console.log('invoiceItems', invoiceItems)


    const errors = [];

    if (invoiceItems.length === 0) {
        errors.push('Invoice items cannot be empty.');
    }

    if ($("#due_date").val() === '') {
        errors.push('Due date cannot be empty.');
    }

    if (errors.length > 0) {
        swal.fire({
            title: "Error",
            text: errors.join('\n'),
            icon: "error",
            confirmButtonText: "OK"
        });

        return;
    }

    invoiceData.items = invoiceItems;
    console.log('invoiceData', invoiceData)
    $.ajax({
        type: 'POST',
        url: '/api/invoices/',  // Change to your API endpoint
        data: JSON.stringify(invoiceData),
        contentType: 'application/json',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        success: function (response) {
            swal.fire({
                title: "Success",
                text: "Invoice created successfully!",
                icon: "success",
                confirmButtonText: "OK"
            });

            console.log('success', response)
        },
        error: function (xhr, status, error) {
            swal.fire({
                title: "Error",
                text: "Error creating Invoice check the fields!",
                icon: "error",
                confirmButtonText: "OK"
            });

            console.log('error', error)
            console.log('xhr', xhr)
        }
    });
}


document.addEventListener('DOMContentLoaded', function () {
    let addInvoiceItemButton = document.getElementById('addInvoiceItemButton');
    addInvoiceItemButton.addEventListener('click', addInvoiceItem);

    // Attach event listeners to existing rows for deletion
    let existingRows = document.querySelectorAll('#invoice-items tbody tr');
    existingRows.forEach(function (row) {
        let deleteButton = row.querySelector('.delete-row');
        deleteButton.addEventListener('click', function () {
            deleteRow(row);
        });
    });
});