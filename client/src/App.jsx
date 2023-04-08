import { useState } from 'react'
import ImageUploader from './components/ImageUploader.jsx';
import ExtractedText from './components/ExtractedText.jsx';
import Summary from './components/Summary.jsx';
import './App.css'


function App() {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [extractedText, setExtractedText] = useState("");
  return (
    <div className="App">
      <div className="card">
      <ImageUploader setUploadedImage={setUploadedImage} setExtractedText={setExtractedText} />
      {uploadedImage && <img src={uploadedImage} alt="Uploaded" />}
      <ExtractedText extractedText={extractedText} />
      <Summary text={extractedText} />
      </div>
    </div>
  )
}

export default App
