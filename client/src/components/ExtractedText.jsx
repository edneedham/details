const ExtractedText = ({ extractedText }) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Extracted Text:</h2>
      <p className="text-lg">{extractedText ? extractedText : "No text detected."}</p>
    </div>
  );
};

export default ExtractedText;

