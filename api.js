module.exports = async (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Portal APS API',
    version: '1.0.0'
  });
};