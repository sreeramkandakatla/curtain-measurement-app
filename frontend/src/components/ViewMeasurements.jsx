import { useEffect, useState } from 'react';
import axios from 'axios';

const ViewMeasurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [area, setArea] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ customerName: '', area: '' });
  const [downloadingIds, setDownloadingIds] = useState([]);

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/measurements', {
        params: { customerName, area },
      });
      setMeasurements(res.data);
    } catch (err) {
      console.error('Error fetching measurements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
    // eslint-disable-next-line
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchMeasurements();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this measurement?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/measurements/${id}`);
      setMeasurements((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting measurement:', err);
      alert('Failed to delete. Try again.');
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({ customerName: item.customerName, area: item.area });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/measurements/${id}`, editForm);
      fetchMeasurements();
      setEditingId(null);
    } catch (err) {
      console.error('Error updating measurement:', err);
      alert('Failed to update. Try again.');
    }
  };

  const handleDownload = async (url, filename, id) => {
    try {
      setDownloadingIds((prev) => [...prev, id]);
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download image.');
    } finally {
      setDownloadingIds((prev) => prev.filter((dId) => dId !== id));
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleFilter}
        className="flex flex-col sm:flex-row gap-3 items-center justify-center bg-white p-4 rounded-md shadow"
      >
        <input
          type="text"
          placeholder="Search by customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="px-3 py-2 border rounded w-full sm:w-64"
        />
        <input
          type="text"
          placeholder="Filter by area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="px-3 py-2 border rounded w-full sm:w-64"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          Apply Filters
        </button>
      </form>

      {loading ? (
        <p className="text-center text-gray-600">Loading measurements...</p>
      ) : measurements.length === 0 ? (
        <p className="text-center text-gray-500">No measurements found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {measurements.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <img
                src={item.imageUrl}
                alt="Measurement"
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-1">
                <p className="text-md font-semibold text-blue-700">
                  {new Date(item.uploadedAt).toLocaleDateString()} •{' '}
                  {new Date(item.uploadedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                {editingId === item._id ? (
                  <>
                    <input
                      type="text"
                      name="customerName"
                      value={editForm.customerName}
                      onChange={handleEditChange}
                      className="border px-2 py-1 w-full text-sm rounded"
                      placeholder="Customer Name"
                    />
                    <input
                      type="text"
                      name="area"
                      value={editForm.area}
                      onChange={handleEditChange}
                      className="border px-2 py-1 w-full text-sm rounded"
                      placeholder="Area"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditSubmit(item._id)}
                        className="bg-green-600 text-white px-3 py-1 text-sm rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 text-sm rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-500">Area: {item.area}</p>
                    <p className="text-xs text-gray-400">Name: {item.customerName}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          handleDownload(
                            item.imageUrl,
                            `measurement_${item.customerName}_${item.area}.jpg`,
                            item._id
                          )
                        }
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        disabled={downloadingIds.includes(item._id)}
                      >
                        {downloadingIds.includes(item._id) ? 'Downloading...' : 'Download'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMeasurements;
