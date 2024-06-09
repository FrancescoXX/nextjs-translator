"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaMicrophone, FaStop, FaSpinner, FaSun, FaMoon } from "react-icons/fa";
import { languageOptions, toneOptions, getLanguageCode } from "./options";

const TranslatePage = () => {
  const [translation, setTranslation] = useState("");
  const [status, setStatus] = useState("");
  const [recognizedText, setRecognizedText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });
  const recognitionRef = useRef(null);

  const sourceLangRef = useRef(null);
  const targetLangRef = useRef(null);
  const toneRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

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
      setTranslation("Translation failed");
    }
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new webkitSpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = async (event) => {
        const speechText = event.results[event.resultIndex][0].transcript;
        setRecognizedText(speechText);
        await handleTranslate(speechText);
      };
      recognition.onerror = () => {
        setIsRecording(false);
        setIsStopping(false);
      };
      recognition.onend = () => {
        setIsRecording(false);
        setIsStopping(false);
        if (isRecording) recognition.start();
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
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.lang = getLanguageCode(sourceLangRef.current.value);
      recognitionRef.current.start();
    }
  };

  const stopRecognition = () => {
    setIsStopping(true);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (isRecording) {
          stopRecognition();
        } else {
          startRecognition();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRecording]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-top py-4 m-2 relative ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      {isStopping && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="flex items-center space-x-2">
            <FaSpinner className="w-4 h-4 text-white animate-spin duration-500" />
            <span className="text-white font-semibold">Stopping...</span>
          </div>
        </div>
      )}
      <a
        href="https://daily.dev"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 right-4"
      >
        <img
          src={darkMode ? "/dark-theme-image.png" : "/light-theme-image.png"}
          alt="Daily Dev"
          className="w-8 h-8"
        />
      </a>
      <button
        onClick={toggleDarkMode}
        className="absolute top-4 left-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
      <div className="w-full sm:max-w-md p-4 mx-4">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <span className="block">LIVE</span>
          <span className="block text-2xl">Translator</span>
        </h1>
        <div className="mb-6">
          <div className="flex justify-between mb-4 space-x-4">
            <div className="w-1/2">
              <label
                htmlFor="sourceLang"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                From...
              </label>
              <select
                id="sourceLang"
                ref={sourceLangRef}
                className="mt-1 block w-full pl-3 pr-8 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                disabled={isRecording}
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.flag} {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/2">
              <label
                htmlFor="targetLang"
                className="block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                To...
              </label>
              <select
                id="targetLang"
                ref={targetLangRef}
                className="mt-1 block w-full pl-3 pr-8 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
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
              className="mt-1 block w-full pl-3 pr-8 py-2 text-base border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
              disabled={isRecording}
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={isRecording ? stopRecognition : startRecognition}
            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isRecording
                ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 animate-pulse"
                : "bg-gradient-to-b from-[#CE3DF3] to-[#9b2cd0] text-white hover:from-[#d464f5] hover:to-[#bb48e1] focus:ring-[#CE3DF3]"
            }`}
            disabled={isStopping}
          >
            {isRecording ? <FaStop className="w-8 h-8 mx-auto" /> : <FaMicrophone className="w-8 h-8 mx-auto" />}
          </button>
        </div>

        <p id="status" className="mt-4 text-gray-700 dark:text-gray-300">{status}</p>
        <p id="recognized-text" className="mt-2 text-sm text-gray-500 text-center">{recognizedText}</p>
        <p id="result" className="mt-2 text-lg font-semibold text-center text-gray-700 dark:text-gray-300">{translation}</p>
      </div>
    </div>
  );
};

export default TranslatePage;
