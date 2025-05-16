import { useState } from 'react';
import UploadForm from './components/UploadForm';
import ViewMeasurements from './components/ViewMeasurements';

function App() {
  const [activeTab, setActiveTab] = useState('upload');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Curtain Measurement Manager
      </h1>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-4">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-2 rounded-l-full font-medium transition ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Upload
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-2 rounded-r-full font-medium transition ${
              activeTab === 'view'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            View
          </button>
        </div>

        {activeTab === 'upload' && <UploadForm />}
        {activeTab === 'view' && <ViewMeasurements />}
      </div>
    </div>
  );
}

export default App;
