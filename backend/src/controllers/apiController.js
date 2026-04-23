const Api = require('../models/Api');
const ApiKey = require('../models/ApiKey');

const createApi = async (req, res, next) => {
  try {
    const { name, description, baseUrl } = req.body;
    if (!name || !baseUrl)
      return res.status(400).json({ message: 'Name and baseUrl are required' });
    const api = new Api({ userId: req.user.userId, name, description, baseUrl });
    await api.save();
    res.status(201).json({ message: 'API created successfully', api });
  } catch (err) { next(err); }
};

const getApis = async (req, res, next) => {
  try {
    const apis = await Api.find({ userId: req.user.userId, isActive: true });
    res.json({ apis });
  } catch (err) { next(err); }
};

const deleteApi = async (req, res, next) => {
  try {
    const api = await Api.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isActive: false }, { new: true }
    );
    if (!api) return res.status(404).json({ message: 'API not found' });
    res.json({ message: 'API deleted successfully' });
  } catch (err) { next(err); }
};

const generateKey = async (req, res, next) => {
  try {
    const api = await Api.findById(req.params.id);
    if (!api) return res.status(404).json({ message: 'API not found' });
    const apiKey = new ApiKey({ apiId: api._id, userId: req.user.userId });
    await apiKey.save();
    res.status(201).json({ message: 'API key generated', apiKey });
  } catch (err) { next(err); }
};

const getKeys = async (req, res, next) => {
  try {
    const keys = await ApiKey.find({ apiId: req.params.id });
    res.json({ keys });
  } catch (err) { next(err); }
};

const revokeKey = async (req, res, next) => {
  try {
    const key = await ApiKey.findOneAndUpdate(
      { _id: req.params.keyId },
      { status: 'revoked' }, { new: true }
    );
    if (!key) return res.status(404).json({ message: 'Key not found' });
    res.json({ message: 'API key revoked successfully' });
  } catch (err) { next(err); }
};

const rotateKey = async (req, res, next) => {
  try {
    const oldKey = await ApiKey.findById(req.params.keyId);
    if (!oldKey) return res.status(404).json({ message: 'Key not found' });

    await ApiKey.findByIdAndUpdate(req.params.keyId, { status: 'revoked' });

    const newKey = new ApiKey({
      apiId: oldKey.apiId,
      userId: oldKey.userId
    });
    await newKey.save();

    res.json({ message: 'Key rotated successfully', newKey });
  } catch (err) { next(err); }
};

module.exports = { createApi, getApis, deleteApi, generateKey, getKeys, revokeKey, rotateKey };