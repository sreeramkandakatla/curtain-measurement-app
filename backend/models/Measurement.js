import mongoose from 'mongoose';

const measurementSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Measurement = mongoose.model('Measurement', measurementSchema);

export default Measurement;
