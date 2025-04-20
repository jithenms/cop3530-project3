import { useState, useEffect } from 'react';

function App() {
    const [q, setQ] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (q.trim() === "") {
            setSuggestions([]);
            return;
        }

        fetch(`http://localhost:8000/suggest?prefix=${encodeURIComponent(q)}`)
            .then(res => res.json())
            .then(data => {
                setSuggestions(data.suggestions || []);
                setShowResults(true);
            })
            .catch(err => console.error(err));
    }, [q]);

    const clear = () => {
        setQ("");
        setSuggestions([]);
        setShowResults(false);
    };

    return (
        <div className="app-container">
            <div className="card">
                <h1>Yoogle</h1>
                <div className="search-wrapper">
                    <input
                        type="text"
                        placeholder="Type to search…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="search-input"
                    />
                    {q && <span onClick={clear} className="clear-icon">×</span>}
                </div>

                {showResults && suggestions.length > 0 && (
                    <ul className="results-list">
                        {suggestions.map((s, i) => (
                            <li
                                key={i}
                                className="result-item"
                                onClick={() => {
                                    setQ(s);
                                    setShowResults(false);
                                }}
                            >
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default App;
