/* istanbul ignore next */
module.exports.debug = (msg) => {
    // debug log wrapper so we can have console.log events in 
    // aws lambda but supress when testing:
    if(!process.env.TEST)
        console.log(msg);
}