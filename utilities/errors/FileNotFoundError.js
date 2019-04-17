class FileNotFoundError extends Error {
    constructor() {
        super('[404] Not found');
    }
}
module.exports = FileNotFoundError;
