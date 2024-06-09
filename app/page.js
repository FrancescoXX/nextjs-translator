"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaMicrophone, FaStop, FaSpinner, FaSun, FaMoon } from "react-icons/fa";

const TranslatePage = () => {
  const [translation, setTranslation] = useState("");
  const [status, setStatus] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const recognitionRef = useRef(null);

  const sourceLangRef = useRef(null);
  const targetLangRef = useRef(null);
  const toneRef = useRef(null);

  const handleTranslate = async (speechText) => {
    try {
      const sourceLang = sourceLangRef.current.value;
      const targetLang = targetLangRef.current.value;
      const tone = toneRef.current.value;
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

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognitionRef.current = recognition;

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
        setIsStopping(false);
      };

      recognition.onend = () => {
        console.log("Recognition ended");
        setIsRecording(false);
        setIsStopping(false);
        setRecognizedText("");
        setTranslation("");

        if (isRecording) {
          console.log("Restarting recognition...");
          recognition.start(); // Restart recognition if still recording
        }
      };
    } else {
      setStatus("Speech recognition not supported in this browser.");
    }
  }, [isRecording]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const startRecognition = () => {
    console.log("Starting recognition...");
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.lang = getLanguageCode(sourceLangRef.current.value);
      recognitionRef.current.start();
    }
  };

  const stopRecognition = () => {
    console.log("Stopping recognition...");
    if (recognitionRef.current && isRecording) {
      setIsStopping(true);
      recognitionRef.current.stop();
    }
  };

  const getLanguageCode = (language) => {
    const languageCodes = {
      Italian: "it-IT",
      English: "en-US",
      Spanish: "es-ES",
      French: "fr-FR",
      Tagalog: "tl-PH",
      Hebrew: "he-IL",
      Japanese: "ja-JP",
      Hindi: "hi-IN",
    };
    return languageCodes[language] || "en-US";
  };

  const languageOptions = [
    { value: "Italian", label: "Italian", flag: "🇮🇹" },
    { value: "English", label: "English", flag: "🇺🇸" },
    { value: "Spanish", label: "Spanish", flag: "🇪🇸" },
    { value: "French", label: "French", flag: "🇫🇷" },
    { value: "Tagalog", label: "Tagalog", flag: "🇵🇭" },
    { value: "Hebrew", label: "Hebrew", flag: "🇮🇱" },
    { value: "Japanese", label: "Japanese", flag: "🇯🇵" },
    { value: "Hindi", label: "Hindi", flag: "🇮🇳" },
  ];

  const toneOptions = [
    { value: "formal", label: "Formal 🎩" },
    { value: "informal", label: "Informal 🧢" },
    { value: "professional", label: "Professional 💼" },
    { value: "friendly", label: "Friendly 😊" },
  ];

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center py-6 relative ${darkMode ? 'dark' : ''}`}>
      {isRecording && (
        <div className="absolute top-4 right-4 flex items-center">
          <div className="w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
          <span className="ml-2 text-red-600 font-semibold">Translating...</span>
        </div>
      )}
      {isStopping && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="flex items-center space-x-2">
            <FaSpinner className="w-4 h-4 text-white animate-spin" />
            <span className="text-white font-semibold">Stopping...</span>
          </div>
        </div>
      )}
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
      <div className="max-w-md w-full sm:max-w-lg p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Live Translation APP</h1>
        <div className="mb-4 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-full">
            <label
              htmlFor="sourceLang"
              className="block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              Translate from...
            </label>
            <select
              id="sourceLang"
              ref={sourceLangRef}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              disabled={isRecording}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.flag} {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label
              htmlFor="targetLang"
              className="block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              To...
            </label>
            <select
              id="targetLang"
              ref={targetLangRef}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              disabled={isRecording}
              defaultValue="English"
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.flag} {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="tone"
            className="block text-xs font-medium text-gray-700 dark:text-gray-300"
          >
            Tone
          </label>
          <select
            id="tone"
            ref={toneRef}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            disabled={isRecording}
          >
            {toneOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={startRecognition}
            className={`w-full py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isRecording
                ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500"
            }`}
            disabled={isRecording || isStopping}
          >
            <span className="flex items-center justify-center">
              <FaMicrophone className="mr-2" />
              {isRecording ? "...translating..." : "Start"}
            </span>
          </button>
          <button
            onClick={stopRecognition}
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            disabled={!isRecording || isStopping}
          >
            <span className="flex items-center justify-center">
              <FaStop className="mr-2" />
              Stop
            </span>
          </button>
        </div>

        <p id="status" className="mt-4 text-gray-700 dark:text-gray-300">{status}</p>
        <p id="recognized-text" className="mt-2 text-sm text-gray-500">{recognizedText}</p>
        <p id="result" className="mt-2 text-lg font-semibold text-center text-gray-700 dark:text-gray-300">{translation}</p>
      </div>
    </div>
  );
};

export default TranslatePage;
