"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const TranslatePage = () => {
  const [sourceLang, setSourceLang] = useState("Italian");
  const [tone, setTone] = useState("formal");
  const [translation, setTranslation] = useState("");
  const [status, setStatus] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const targetLangRef = useRef(null); // Ref for target language dropdown

  const handleTranslate = async (speechText) => {
    try {
      const targetLang = targetLangRef.current.value; // Get target language value directly from dropdown
      const response = await axios.post("/api/translate", {
        text: speechText,
        source_lang: sourceLang,
        target_lang: targetLang,
        tone,
      });
      setTranslation(response.data.translation);
    } catch (error) {
      console.error("Error:", error);
      setTranslation("Translation failed");
    }
  };

  const handlePreparedRequest = async () => {
    try {
      const response = await axios.post("/api/translate", {
        text: "ciao mondo",
        source_lang: "Italian",
        target_lang: "Greek",
        tone: "formal",
      });
      setTranslation(response.data.translation);
    } catch (error) {
      console.error("Error:", error);
      setTranslation("Translation failed");
    }
  };

  const handleDummyRequest = async () => {
    try {
      const response = await axios.get("/api/dummy");
      alert(JSON.stringify(response.data));
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get response");
    }
  };

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognitionRef.current = recognition;

      recognition.lang = getLanguageCode(sourceLang);
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log("Recognition started");
        setIsRecording(true);
      };

      recognition.onresult = async (event) => {
        const speechText = event.results[event.resultIndex][0].transcript;
        console.log("Recognized text:", speechText);
        setRecognizedText(speechText);
        await handleTranslate(speechText);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        console.log("Recognition ended");
        setIsRecording(false);
        if (isRecording) {
          recognition.start(); // Restart recognition if still recording
        }
      };
    } else {
      setStatus("Speech recognition not supported in this browser.");
    }
  }, [sourceLang, isRecording]);

  const startRecognition = () => {
    console.log("Starting recognition...");
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
    }
  };

  const stopRecognition = () => {
    console.log("Stopping recognition...");
    if (recognitionRef.current) {
      recognitionRef.current.abort(); // Use abort to immediately stop the recognition
      setIsRecording(false);
    }
  };

  const getLanguageCode = (language) => {
    const languageCodes = {
      Italian: "it-IT",
      English: "en-US",
      Spanish: "es-ES",
      French: "fr-FR",
      Tagalog: "tl-PH",
    };
    return languageCodes[language] || "en-US";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Translate Text</h1>
        <div className="mb-4">
          <label
            htmlFor="sourceLang"
            className="block text-sm font-medium text-gray-700"
          >
            Source Language
          </label>
          <select
            id="sourceLang"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            disabled={isRecording} // Disable dropdown while recording
          >
            <option value="Italian">Italian</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Tagalog">Tagalog</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="targetLang"
            className="block text-sm font-medium text-gray-700"
          >
            Target Language
          </label>
          <select
            id="targetLang"
            ref={targetLangRef} // Assign ref to the target language dropdown
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            disabled={isRecording} // Disable dropdown while recording
          >
            <option value="Greek">Greek</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Tagalog">Tagalog</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="tone"
            className="block text-sm font-medium text-gray-700"
          >
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>

        <button
          onClick={startRecognition}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Record
        </button>
        <button
          onClick={stopRecognition}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mt-4"
        >
          Stop
        </button>
        <button
          onClick={handlePreparedRequest}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mt-4"
        >
          Send Prepared Request
        </button>
        <button
          onClick={handleDummyRequest}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4"
        >
          Send Dummy Request
        </button>
        <p id="status" className="mt-4 text-gray-700">{status}</p>
        <p id="recognized-text" className="mt-2 text-gray-700">{recognizedText}</p>
        <p id="result" className="mt-2 text-lg font-semibold text-gray-700">{translation}</p>
      </div>
    </div>
  );
};

export default TranslatePage;
