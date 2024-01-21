module.exports = async (req, res, next) => {
    console.log("This is the global middleware");
    next();
};