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
