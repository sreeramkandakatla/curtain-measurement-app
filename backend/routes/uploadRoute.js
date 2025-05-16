import express from 'express';
import upload from '../middleware/multer.js';
import Measurement from '../models/Measurement.js';

const router = express.Router();

// POST: Upload image and data
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    const { customerName, area } = req.body;

    if (!customerName || !area) {
      return res.status(400).json({ message: 'customerName and area are required' });
    }

    const imageUrl = req.file.path;
    const uploadedAt = new Date();

    const measurement = new Measurement({
      customerName,
      area,
      imageUrl,
      uploadedAt,
    });

    await measurement.save();

    return res.status(200).json({
      message: 'Image and data uploaded successfully',
      data: measurement,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Upload failed', error });
  }
});

// GET: Retrieve uploaded measurements with optional filters
router.get('/measurements', async (req, res) => {
  try {
    const { customerName, area, sort } = req.query;

    const query = {};
    if (customerName) query.customerName = { $regex: customerName, $options: 'i' };
    if (area) query.area = { $regex: area, $options: 'i' };

    const sortOption = sort === 'asc' ? 1 : -1;

    const measurements = await Measurement.find(query).sort({ uploadedAt: sortOption });

    return res.status(200).json(measurements);
  } catch (error) {
    console.error('Fetch error:', error);
    return res.status(500).json({ message: 'Failed to fetch measurements', error });
  }
});

// PUT: Edit measurement data
router.put('/measurements/:id', async (req, res) => {
  try {
    const { customerName, area } = req.body;

    const updated = await Measurement.findByIdAndUpdate(
      req.params.id,
      { customerName, area },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'Measurement not found' });

    return res.status(200).json({ message: 'Measurement updated', data: updated });
  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({ message: 'Update failed', error });
  }
});

// DELETE: Remove a measurement
router.delete('/measurements/:id', async (req, res) => {
  try {
    const deleted = await Measurement.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ message: 'Measurement not found' });

    return res.status(200).json({ message: 'Measurement deleted', data: deleted });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ message: 'Delete failed', error });
  }
});

export default router;
