const DonationRecord = require('../model/donationRecordModel');

exports.addDonationRecord = async (req, res) => {
  try {
    const { donorName, bloodType, time, date, status } = req.body;
    const hospitalId = req.user._id;

    const newRecord = await DonationRecord.create({
      hospital: hospitalId,
      donorName,
      bloodType,
      time,
      date,
      status: status || 'SUCCESSFUL'
    });

    res.status(201).json({ message: 'Record added', data: newRecord });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getDonationStats = async (req, res) => {
  try {
    const hospitalId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const donations = await DonationRecord.find({
      hospital: hospitalId,
      date: { $gte: startOfMonth }
    });

    const total = donations.length;

    res.status(200).json({ totalDonations: total });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
  }
};

exports.getDonationRecords = async (req, res) => {
  try {
    const hospitalId = req.user._id;

    const records = await DonationRecord.find({ hospital: hospitalId }).sort({ date: -1 });

    res.status(200).json({ records });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching records', error: error.message });
  }
};
