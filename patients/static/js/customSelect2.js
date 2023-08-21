const initializeSelect2WithPagination = function ({apiUrl, elementSelector, placeholder, textProperty, multiple=True, formatDateTime = false}) {
    // Initialize Select2
    $(elementSelector).select2({
        placeholder: placeholder,
        multiple: multiple,
        closeOnSelect: false, // Prevent the Select2 from closing on selection
        ajax: {
            url: apiUrl,
            dataType: 'json',
            delay: 250,
            data: function (params) {
                return {
                    page: params.page,
                    search: params.term // Include the search term in the API request
                };
            },
            processResults: function (data, params) {
                params.page = params.page || 1;
                return {
                    results: data.results.map(function (item) {
                        return {
                            id: item.id,
                            text: formatDateTime && item[textProperty].includes('T') ? formatDate(item[textProperty]) : item[textProperty]
                        };
                    }),
                    pagination: {
                        more: data.next !== null
                    }
                };
            },
            cache: true
        },
        escapeMarkup: function (markup) {
            return markup;
        },
        minimumInputLength: 0, // Set to 0 to disable the minimum input length requirement
        templateResult: function (data) {
            // If the item is already selected, don't display it in the dropdown
            if ($(elementSelector).find("option:selected[value='" + data.id + "']").length) {
                return null;
            }
            return data.text;
        },
        templateSelection: function (data) {
            return data.text;
        }
    });
};
// Function to format the date

function formatDate(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
    return dateTime.toLocaleDateString(undefined, options); // Change the format as per your preference
}
