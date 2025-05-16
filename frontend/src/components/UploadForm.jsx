import { useState } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const UploadForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [area, setArea] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !area || !image) {
      setMessage('Please fill in all fields and upload an image.');
      setMessageType('error');
      return;
    }

    const formData = new FormData();
    formData.append('customerName', customerName);
    formData.append('area', area);
    formData.append('image', image);

    try {
      setIsUploading(true);
      setMessage('');
      await axios.post(`${BASE_URL}/api/upload`, formData);
      setMessage('Upload successful!');
      setMessageType('success');
      setCustomerName('');
      setArea('');
      setImage(null);
    } catch (error) {
      console.error(error);
      setMessage('Upload failed.');
      setMessageType('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">Upload Measurement</h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block w-full">
          <span className="block text-gray-700 mb-1 font-medium">Upload Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 cursor-pointer file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0 file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 rounded-lg transition duration-300 ${
            isUploading
              ? 'bg-blue-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>

        {message && (
          <p
            className={`text-center text-sm mt-2 ${
              messageType === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadForm;
