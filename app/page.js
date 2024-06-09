'use client';

import { useState, useRef, useEffect } from 'react';

export default function TranslatePage() {
  const [result, setResult] = useState('');
  const [text, setText] = useState('');
  const [sourceLang, setSourceLang] = useState('Italian');
  const [targetLang, setTargetLang] = useState('Greek');
  const [tone, setTone] = useState('formal');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const isRestarting = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log('Recognition started');
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const speechText = event.results[event.resultIndex][0].transcript;
      console.log('Recognized text:', speechText);
      setText(speechText);
      handleTranslate(speechText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      console.log('Recognition ended');
      setIsRecording(false);
      if (isRestarting.current) {
        recognition.start(); // Restart recognition if still recording
      }
    };
  }, [isRecording]);

  const handleTranslate = async (inputText) => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, source_lang: sourceLang, target_lang: targetLang, tone }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.translation);
      } else {
        setResult('Translation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('Translation failed');
    }
  };

  const startRecognition = () => {
    if (!isRecording && recognitionRef.current) {
      isRestarting.current = true;
      recognitionRef.current.lang = getLanguageCode(sourceLang);
      recognitionRef.current.start();
    }
  };

  const stopRecognition = () => {
    if (isRecording && recognitionRef.current) {
      isRestarting.current = false;
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const getLanguageCode = (language) => {
    const languageCodes = {
      Italian: 'it-IT',
      English: 'en-US',
      Spanish: 'es-ES',
      French: 'fr-FR',
      Tagalog: 'tl-PH',
    };
    return languageCodes[language] || 'en-US';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">2Translate Text</h1>

        <div className="mb-4">
          <label htmlFor="sourceLang" className="block text-sm font-medium text-gray-700">
            Source Language
          </label>
          <select
            id="sourceLang"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="Italian">Italian</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Tagalog">Tagalog</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="targetLang" className="block text-sm font-medium text-gray-700">
            Target Language
          </label>
          <select
            id="targetLang"
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="Greek">Greek</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Tagalog">Tagalog</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
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

        <div className="mb-4">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700">
            Text to Translate
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md"
            rows={4}
          ></textarea>
        </div>

        <button
          onClick={() => handleTranslate(text)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Translate
        </button>

        <button
          onClick={isRecording ? stopRecognition : startRecognition}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white mt-2 ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        <p id="result" className="mt-4 text-lg font-semibold text-gray-700">{result}</p>
      </div>
    </div>
  );
}
