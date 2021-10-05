function log(req, res , next) {console.log('logging...app.')
next();};



module.exports = log;