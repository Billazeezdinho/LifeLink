const Hospital = require('../model/hospitalModel');


exports.searchForDonors = async (req, res) => {
  try {
    if (req.user.role !== 'HOSPITAL') {
      return res.status(403).json({ message: 'Access denied. Only hospitals can search for donors.' });
    }
    if (!req.user.isKYCVerified) {
      return res.status(400).json({ message: 'You are yet to complete your KYC, check your email and complete it.' });
    }
    
    const donors = await Donor.find(); // Assuming donor data exists
    res.status(200).json(donors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
