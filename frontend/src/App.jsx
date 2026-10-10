
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateResponse(e) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Request failed");
      }

      setResponse(data.response);
    } catch (err) {
      setError(
        err.message || "Unable to connect to the AI backend."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">✦</div>
          <span>Nova<span className="brand-light"> AI</span></span>
        </div>
        <div className="status">
          <span className="status-dot" />
          Gemini connected
        </div>
      </nav>

      <main className="workspace">
        <div className="hero">
          <div className="eyebrow">YOUR AI WORKSPACE</div>
          <h1>Ideas into <span>answers.</span></h1>
          <p>Ask anything. Explore ideas. Get things done.</p>
        </div>

        <form className="prompt-card" onSubmit={generateResponse}>
          <label htmlFor="prompt">What would you like to know?</label>

          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask a question or describe a task..."
            rows={4}
          />

          <div className="prompt-footer">
            <span className="hint">Powered by Gemini</span>
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
            >
              {loading ? "Thinking..." : "Generate answer"}
              {!loading && <span> ↗</span>}
            </button>
          </div>
        </form>

        {loading && (
          <div className="loading">
            <span className="loader" />
            <span>Thinking through your question...</span>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {response && !loading && (
          <section className="answer-card">
            <div className="answer-heading">
              <div className="answer-icon">✦</div>
              <div>
                <h2>AI Response</h2>
                <span>Generated just for you</span>
              </div>
              <button
                className="copy-button"
                type="button"
                onClick={() => navigator.clipboard.writeText(response)}
              >
                Copy answer
              </button>
            </div>

            <div className="markdown">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </section>
        )}

        {!response && !loading && !error && (
          <div className="suggestions">
            <p>NOT SURE WHERE TO START?</p>
            <div className="suggestion-grid">
              <button
                type="button"
                className="suggestion"
                onClick={() => setPrompt("Explain APIs with a simple real-world example.")}
              >
                <span>⌘</span>
                <strong>Learn something</strong>
                <small>Explain a complex topic simply</small>
              </button>
              <button
                type="button"
                className="suggestion"
                onClick={() => setPrompt("Give me five creative project ideas using AI.")}
              >
                <span>✧</span>
                <strong>Explore ideas</strong>
                <small>Discover something new</small>
              </button>
              <button
                type="button"
                className="suggestion"
                onClick={() => setPrompt("Create a practical daily study plan for learning Python.")}
              >
                <span>◷</span>
                <strong>Make a plan</strong>
                <small>Turn a goal into action</small>
              </button>
            </div>
          </div>
        )}
      </main>

      <footer>Nova AI · Your ideas, powered by intelligence.</footer>
    </div>
  );
}

export default App;
