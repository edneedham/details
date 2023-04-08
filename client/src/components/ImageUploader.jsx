import {Configuration, OpenAIApi} from "openai";
import { useRef, useState } from "react";
import Tesseract from "tesseract.js";

const ImageUploader = ({ setUploadedImage, setExtractedText }) => {
  const inputFile = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Perform OCR on the image
      const { data } = await Tesseract.recognize(file, "eng", { logger: (m) => console.log(m) });
      setExtractedText(data.text);
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center mt-10">
      <input
        ref={inputFile}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <button
        onClick={() => inputFile.current.click()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Upload Image
      </button>
        {isLoading && (
          <div className="mt-5">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-3">Analyzing image...</p>
          </div>
       )}
    </div>
  );
};

export default ImageUploader;

