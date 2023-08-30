function calculateSubtotal() {
    // Iterate through all rows to calculate subtotals
    $('#invoice-items tbody tr').each(function() {
        let row = this;
        let quantity = parseFloat($(row).find('[name="quantity[]"]').val());
        let unitPrice = parseFloat($(row).find('[name="unit_price[]"]').val());
        let subtotal = (quantity * unitPrice).toFixed(2);

        $(row).find('.subtotal').text('₹' + subtotal);
    });

    // Recalculate the total when a change is made
    updateTotal();
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

$(document).ready(function() {
    // Attach event listeners to quantity and unit_price inputs for changes
    $('#invoice-items tbody').on('input', '[name="quantity[]"], [name="unit_price[]"]', function() {
        calculateSubtotal();
    });

    // Fetch the invoice data from the API

    $.ajax({
        url: `/api/invoices/${invoiceId}/`,
        method: 'GET',
        success: function(response) {
            // Populate the form fields and invoice items
            $('#due_date').val(response.due_date);

            response.items.forEach(function(item) {
                let newRow = $('<tr>');
                newRow.attr('data-item-id', item.id); // Store item ID as custom attribute
                newRow.append(`<td><input type="text" name="description[]" value="${item.description}" required></td>`);
                newRow.append(`<td><input type="number" name="quantity[]" value="${item.quantity}" min="1" required></td>`);
                newRow.append(`<td><input type="number" name="unit_price[]" value="${item.unit_price}" step="0.01" required></td>`);
                newRow.append(`<td class="subtotal"></td>`);
                newRow.append(`<td><button type="button" class="btn btn-outline-danger" onclick="deleteInvoiceItem(${item.id})">Remove</button></td>`);

                $('#invoice-items tbody').append(newRow);
            });

            // Calculate subtotals and total
            calculateSubtotal();
        },
        error: function(error) {
            console.log('Error fetching invoice data:', error);
        }
    });
});


function addInvoiceItem() {
    let itemContainer = document.getElementById('invoice-items').getElementsByTagName('tbody')[0];
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
                <td><input type="text" name="description[]" required></td>
                <td><input type="number" name="quantity[]" min="1" required oninput="calculateSubtotal(this.parentElement.parentElement)"></td>
                <td><input type="number" name="unit_price[]" step="0.01" required oninput="calculateSubtotal(this.parentElement.parentElement)"></td>
                <td class="subtotal"></td>
                <td><button type="button" class="btn btn-outline-danger delete-row">Remove</button></td>

            `;
    itemContainer.appendChild(newRow);
    // Attach event listener to delete button for the new row
    let deleteButton = newRow.querySelector('.delete-row');
    deleteButton.addEventListener('click', function () {
        deleteRow(newRow);
    });
}


function createInvoice(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    let totalAmountElement = document.getElementById('total-amount').textContent;
    let totalAmountValue = parseFloat(totalAmountElement.replace('₹', '').trim());

    let invoiceData = {
        due_date: $("#due_date").val(),
        total_amount: totalAmountValue,
    };
    let invoiceItems = [];
    let rows = document.querySelectorAll('#invoice-items tbody tr');
    rows.forEach(function (row) {
        let itemId = row.getAttribute('data-item-id'); // Get the item ID from the custom attribute
        let description = row.querySelector('[name="description[]"]').value;
        let quantity = parseInt(row.querySelector('[name="quantity[]"]').value);
        let unitPrice = parseFloat(row.querySelector('[name="unit_price[]"]').value);
        console.log('Row Data:', description, quantity, unitPrice);

        // Check if the row contains non-empty values
        if (description.trim() !== '' && !isNaN(quantity) && !isNaN(unitPrice)) {
            invoiceItems.push({
                id: itemId, // Use the item id
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
        type: 'PATCH',
        url: `/api/invoices/${invoiceId}/`,

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

            window.location.reload();
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

function deleteRow(row) {
    row.remove();
    updateTotal();
}

document.addEventListener('DOMContentLoaded', function () {
    // Attach event listeners to existing rows for deletion
    let existingRows = document.querySelectorAll('#invoice-items tbody tr');
    existingRows.forEach(function (row) {
        let deleteButton = row.querySelector('.delete-row');
        deleteButton.addEventListener('click', function () {
            deleteRow(row);
        });
    });
});

function deleteInvoiceItem(itemId) {
    // Show a confirmation dialog using SweetAlert
    swal.fire({
        title: 'Confirm Delete',
        text: 'Are you sure you want to delete this invoice item this action cannot be reverted?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // If confirmed, send DELETE request to API
            $.ajax({
                type: 'DELETE',
                url: `/api/invoice-item/${itemId}/`,  // Change to your API endpoint
                headers: {
                    'X-CSRFToken': csrfToken,
                },
                success: function(response) {
                    swal.fire({
                        title: "Success",
                        text: "Invoice Item deleted successfully!",
                        icon: "success",
                        confirmButtonText: "OK"
                    });

                    // Remove the row from the table
                    $(`tr[data-item-id="${itemId}"]`).remove();

                    // Recalculate subtotals and total
                    calculateSubtotal();

                    // Update the total amount in the API
                    updateTotalAmount();
                },
                error: function(xhr, status, error) {
                    console.log('Error deleting invoice item:', error);
                }
            });
        }
    });
}

function updateTotalAmount() {
    let totalAmountElement = document.getElementById('total-amount').textContent;
    let totalAmountValue = parseFloat(totalAmountElement.replace('₹', '').trim());

    // Send PATCH request to update total amount in the API
    $.ajax({
        type: 'PATCH',
        url: `/api/invoices/${invoiceId}/`,
        data: JSON.stringify({ total_amount: totalAmountValue }),
        contentType: 'application/json',
        headers: {
            'X-CSRFToken': csrfToken,
        },
        success: function(response) {
            console.log('Total amount updated successfully:', response);
        },
        error: function(xhr, status, error) {
            console.log('Error updating total amount:', error);
        }
    });
}