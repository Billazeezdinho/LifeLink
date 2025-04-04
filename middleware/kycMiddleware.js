const kycMiddleware = (req, res, next) => {
    if (!req.user.isKYCVerified) {
      return res.status(400).json({ message: 'KYC not completed' });
    }
    next();
  };
  
  module.exports = kycMiddleware;
  