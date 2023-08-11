const dataTable = CustomDataTable({
    targetTable: '#all-patients-table',
    targetName: 'Patients',
    searchInput: '#search-input',
    sortOrder: [[0, 'asc']], // Default sorting by the first column in ascending order
    searchPlaceholderText: 'Search patients...',
    apiURL: '/api/patients/',
    tableColumns: [
        { data: 'id', title: 'ID' },
        { data: 'profile.first_name', title: 'First Name' },
        { data: 'profile.last_name', title: 'Last Name' },
        { data: 'profile.email', title: 'Email', defaultContent: '' },    ],
    columnDefinitions: [],
});


