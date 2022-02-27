exports.deconstructFullName = (fullName) => {
    const deconstructedName = fullName.split(' ');
    const firstName = deconstructedName
        .map((name, index, array) => (index < Math.ceil(array.length / 2) ? name : ''))
        .join(' ')
        .trim();
    const lastName = deconstructedName
        .map((name, index, array) => (index >= Math.ceil(array.length / 2) ? name : ''))
        .join(' ')
        .trim();

    return {
        firstName,
        lastName
    };
};

exports.calculatePagination = (pageSize, currentPage, totals) => {
    const previousPage = currentPage === 1 ? 0 : currentPage - 1;
    const lastPage = Math.ceil(totals / pageSize);
    const nextPage = currentPage === lastPage ? 0 : currentPage + 1;

    return {
        currentPage,
        firstPage: 1,
        lastPage,
        nextPage,
        pageSize,
        previousPage
    };
};

exports.calculateSkips = (pageSize, currentPage) => {
    const skips = pageSize * (currentPage - 1);
    return skips;
};
