# Details: The important bits.

This project takes an image containing text, performs Optical Character 
Recognition (OCR) using the Tesseract library, and then uses the OpenAI API 
to provide a summary of the extracted text. It's designed to help users 
distill documents and jargon down into manageable snippets.

*This is only a minimal working example.*

---
## TODOs
- Add a proxy-middleware to get around CORS.
- Move the client codebase to TypeScript.
- Add tests.
- Authorization and authentication.
- Store the summaries with their respective images as a gallery for
each user.
- Add functionality to work as a Progressive Web App (PWA), allowing users
to upload directly from device camera.
---

## Features
- Upload an image containing text
- Extract text from the image using the Tesseract OCR library
- Send the extracted text to the OpenAI API for summarization
- Display the summary on the web page

## Prerequisites
- Node.js
- Rust (for the backend server)
- Tesseract.js library
- OpenAI API key

## Installation
1. Create a new target directory:
```bash
mkdir details
```
2. Change to the new target directory:
```bash
cd details 
```
3. Clone the repository:
```bash
git clone https://github.com/edneedham/details.git .
```
3. Install the dependencies for the React app:
```bash
cd client
npm install
```
4. Install the dependencies for the Rust backend server:
```bash
cd ../server
cargo build
```
## Configuration
1. In the server directory, create a .env file:
```bash
touch .env
```
2. Open the .env file and add your OpenAI API key:
```bash
OPENAI_API_KEY=your_openai_api_key
```
**Make sure to replace `your_openai_api_key` with your actual OpenAI API key.**

## Running the Application
1. Start the Rust backend server:
```bash
cd server
cargo run 
```
The server will start on http://localhost:3030 or the specified port.

2. Start the React development server:
```bash
cd client
npm run dev 
```
The React app will open in your browser at http://localhost:5173.

## Usage
1. Upload an image containing text.
2. The app will perform OCR on the image and display the extracted text.
3. Click the "Get Summary" button to send the text to the OpenAI API for summarization.
4. The summary will be displayed on the web page.

