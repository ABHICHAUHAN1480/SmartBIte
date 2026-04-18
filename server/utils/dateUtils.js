const calculateDaysLeft = (expireDate) => {
  const expiryDate = new Date(expireDate);
  const timeDifference = expiryDate - new Date();
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
};

module.exports = { calculateDaysLeft };
