import { useState } from "react";
import InfoCard from "./InfoCard";

export default function Form() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [urlChips, setUrlChips] = useState([]);
  const [siteInfos, setSiteInfos] = useState([]);
  const [validationError, setValidationError] = useState("");

  function removeChip(chipToRemove) {
    const updatedChips = urlChips.filter((chip) => chip !== chipToRemove);
    setUrlChips(updatedChips);

    const updatedSitesInfos = siteInfos.filter((info) => chipToRemove !== info.url);
    setSiteInfos(updatedSitesInfos);
  }

  function handlePressEnter(e) {
    if (e.key === "Enter") e.preventDefault();
    if (e.key !== "Enter" || !text) return;

    if (urlChips.includes(text)) {
      return setValidationError("URL already exists in the list");
    }

    const urlArr = e.target.value
      .trim()
      .split(" ")
      .filter((item) => !urlChips.includes(item));
    setUrlChips((prev) => [...prev, ...urlArr]);
    setText("");
    setValidationError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (urlChips.length < 3) {
      setValidationError("You need to submit at least 3 unique urls");
      return;
    }

    setSiteInfos([]);
    setLoading(true);

    try {
      const response = await fetch("/fetch-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "X-XSS-Protection": "1; mode=block",
        },
        body: JSON.stringify({ urls: urlChips }),
      });

      setLoading(false);
      switch (response.status) {
        case 429:
          setValidationError("Too many requests. Please try again later.");
          return;

        case 500:
          setValidationError("Internal Server Error. Please try again later.");
          return;

        default:
          if (!response.ok) {
            setValidationError(`Error: ${response.statusText}`);
            return;
          }
      }

      const metadata = await response.json();
      setSiteInfos(metadata);
    } catch (error) {
      setLoading(false);
      setValidationError("Network error. Please try again later.");
      console.error("Network error:", error);
    }
  }

  return (
    <div className="appContainer">
      <form onSubmit={handleSubmit}>
        <label htmlFor="urlInput">Enter URLS in the box below</label>
        <div className="input-container">
          <ul className="chips">
            {urlChips.map((chip) => (
              <li key={chip} className="chip">
                <span>{chip}</span>
                <span
                  onClick={() => removeChip(chip)}
                  onKeyDown={() => {
                    return;
                  }}
                  className="chipIcon"
                  aria-hidden="false"
                  style={{ cursor: "pointer", fontSize: "16px" }}
                >
                  &#x2716;
                </span>
              </li>
            ))}
          </ul>
          <input
            type="text"
            id="urlInput"
            data-testid="urlInput"
            placeholder="Paste URL and press Enter to add it"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handlePressEnter}
          />
        </div>
        {validationError && <p id="errorMessage">{validationError}</p>}
        <button type="submit">Get URL data</button>
      </form>
      {siteInfos.length > 0 ? (
        siteInfos.map((info, i) => <InfoCard key={`${info.title}_${i}`} data={info} />)
      ) : loading ? (
        <span>Loading metadata... Please wait</span>
      ) : (
        <InfoCard data={null} />
      )}
    </div>
  );
}
