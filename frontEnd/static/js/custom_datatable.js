const CustomDataTable = function ({
    targetTable,
    targetName,
    searchInput,
    sortOrder,
    searchPlaceholderText,
    apiURL,
    tableColumns,
    columnDefinitions,
    getFilters,
    enableSearch = true,
    enableInfo = true,
    enablePaging = true,
    isServerSide = true,
    rowsPerPage = 10,
    enableResponsive = true,
    availablePageLengths = [
        [10, 25, 50, 100, 500, 1000],
        [10, 25, 50, 100, 500, 1000],
    ],
    enableProcessing = true,
    useTraditional = false,
    languageConfig = {
        filteredInfo: '',
        infoText: `Displaying _START_ to _END_ of _TOTAL_ ${targetName}`,
        searchPlaceholder: searchPlaceholderText,
        searchLabel: 'Search',
        pagination: {
            nextLabel: '<i class="fas fa-chevron-right"></i>',
            prevLabel: '<i class="fas fa-chevron-left"></i>',
        },
        loadingIndicator:
            '<div class="d-flex align-items-center justify-content-center"> <div class="loader">Loading...</div></div> ',
    },
    fetchData = function (requestData, dataCallback) {
        let pageNumber = 1;
        let pageSize = requestData.length;
        let sortOrdering;
        if (requestData.start && pageSize !== -1) {
            pageNumber = requestData.start / pageSize + 1;
        }
        if (pageSize === -1) {
            pageSize = 'max';
        }
        if (requestData.order && requestData.order.length) {
            sortOrdering = requestData.columns[requestData.order[0].column].name;
            if (requestData.order[0].dir === 'desc') {
                sortOrdering = '-' + sortOrdering;
            }
        }
        let filtersData = {};
        if (getFilters) {
            filtersData = getFilters();
        }
        let requestDataObj = {
            page: pageNumber,
            page_size: pageSize,
            ordering: sortOrdering,
            ...filtersData,
        };
        if (requestData.search.value) {
            requestDataObj.search = requestData.search.value;
        }
        $.ajax({
            url: apiURL,
            traditional: useTraditional,
            type: 'GET',
            data: requestDataObj,
            success: function (data) {
                dataCallback({
                    data: data.results,
                    recordsTotal: data.count,
                    recordsFiltered: data.count,
                });
            },
        });
    },
}) {
    const customDataTable = $(targetTable).DataTable({
        dom:
            "<'row'<'col-sm-12 col-md-12 'i>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'p>>",
        searching: enableSearch,
        info: enableInfo,
        paging: enablePaging,
        serverSide: isServerSide,
        pageLength: rowsPerPage,
        responsive: enableResponsive,
        order: sortOrder,
        lengthMenu: availablePageLengths,
        language: languageConfig,
        processing: enableProcessing,
        ajax: fetchData,
        columns: tableColumns,
        columnDefs: columnDefinitions,
    });

    if (searchInput) {
        $(searchInput).on('keyup', function () {
            customDataTable.search(this.value).draw();
        });
    }
    return customDataTable;
};