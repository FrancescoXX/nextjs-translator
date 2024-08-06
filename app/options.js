export const languageOptions = [
    { value: "Italian", label: "Italian", flag: "🇮🇹" },
    { value: "English", label: "English", flag: "🇺🇸" },
    { value: "Spanish", label: "Spanish", flag: "🇪🇸" },
    { value: "French", label: "French", flag: "🇫🇷" },
    { value: "Tagalog", label: "Tagalog", flag: "🇵🇭" },
    { value: "Hebrew", label: "Hebrew", flag: "🇮🇱" },
    { value: "Japanese", label: "Japanese", flag: "🇯🇵" },
    { value: "Hindi", label: "Hindi", flag: "🇮🇳" },
    { value: "Arabic", label: "Arabic", flag: "AR" },
    { value: "Urdu", label: "Urdu", flag: "URD" }
  ];
  
  export const toneOptions = [
    { value: "formal", label: "🎩 Formal" },
    { value: "informal", label: "🧢 Informal" },
    { value: "professional", label: "💼 Professional" },
    { value: "friendly", label: "😊 Friendly" },
  ];
  
  export const getLanguageCode = (language) => {
    const languageCodes = {
      Italian: "it-IT",
      English: "en-US",
      Spanish: "es-ES",
      French: "fr-FR",
      Tagalog: "tl-PH",
      Hebrew: "he-IL",
      Japanese: "ja-JP",
      Hindi: "hi-IN",
      Arabic: "ar-001",
      Urdu: "urd-PK"
    };
    return languageCodes[language] || "en-US";
  };
  
