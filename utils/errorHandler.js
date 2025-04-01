const errorHandler = (err, req, res, next) => {
    console.error(err.message);
    if (err.message.includes("validation")) {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Server Error" });
  };
  
  module.exports = errorHandler;
  