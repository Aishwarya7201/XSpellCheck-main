import React, { useState } from "react";
const customDictionary = {
  teh: "the",
  wrok: "work",
  fot: "for",
  exampl: "example",
  th2: "the",
};
const XSpellCheck = () => {
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState([]);
  const handleChange = (e) => {
    const inputText = e.target.value;
    setText(inputText);
    const words = inputText.split(" ");
    const correctedWords = words.map((item) => {
      const correctedWord = customDictionary[item.toLowerCase()];
      return correctedWord || item;
    });
    correctedWords.join(" "); 
    const firstCorrection = correctedWords.find(
      (word, idx) => word !== words[idx]
    );
    // eslint-disable-next-line no-undef
    setSuggestions(firstCorrection || "");
  };

  const handleTextChange = async (event) => {
    const newText = event.target.value;
    setText(newText);
    const words = newText.split(/[ ,.]+/);

    const correctedWords = await Promise.all(
      words.map(async (word) => {
        const correctedWord = await fetchCorrectedWord(word.toLowerCase());
        return correctedWord || word;
      })
    );

    setCorrections(correctedWords.filter((word, idx) => word !== words[idx]));
  };

  const fetchCorrectedWord = async (word) => {
    try {
      const response = await fetch(
        `https://languagetool.org/api/v2/check?text=${word}&language=en-US`
      );
      const data = await response.json();
      if (data.matches && data.matches.length > 0) {
        const firstSuggestion = data.matches[0].replacements[0].value;
        return firstSuggestion;
      }
      return null;
    } catch (error) {
      console.error("Error fetching corrected word:", error);
      return null;
    }
  };

  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text here..."
        rows={10}
        cols={50}
      />
      {corrections.length > 0 && (
        <p>
          Did you mean:
          {/* {corrections.map((correction, index) => (
            <span key={index}>
              <strong> {correction}</strong>
              {index < corrections.length - 1 && ", "}
            </span>
          ))} */}
          {<strong> {corrections[0]}</strong>}?
        </p>
      )}
    </div>
  );
};

export default XSpellCheck;
