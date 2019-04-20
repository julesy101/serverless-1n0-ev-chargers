/* istanbul ignore next */
module.exports.debug = msg => {
    // debug log wrapper so we can have console.log events in
    // aws lambda but supress when testing:
    // eslint-disable-next-line no-console
    if (!process.env.TEST) console.log(msg);
};
