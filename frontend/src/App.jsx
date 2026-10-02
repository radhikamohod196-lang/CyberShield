import { useEffect, useState } from "react";
import "./App.css";
import NetworkGraph from "./components/NetworkGraph";

const datasets = [
  {
    id: "01_basic",
    name: "Basic Network",
    entry: "N1",
  },
  {
    id: "02_multiple_paths",
    name: "Multiple Paths",
    entry: "N1",
  },
  {
    id: "03_disconnected",
    name: "Disconnected Network",
    entry: "N1",
  },
  {
    id: "04_vulnerable_nodes",
    name: "Vulnerable Nodes",
    entry: "N1",
  },
  {
    id: "05_critical_target",
    name: "Critical Target",
    entry: "N1",
  },
  {
    id: "06_large_25_nodes",
    name: "Large 25-Node Network",
    entry: "N01",
  },
  {
    id: "07_edge_cases",
    name: "Edge Cases",
    entry: "N1",
  },
];

function App() {
  const [dataset, setDataset] = useState("01_basic");
  const [algorithm, setAlgorithm] = useState("BFS");
  const [entryPoint, setEntryPoint] = useState("N1");

  const [network, setNetwork] = useState({
    nodes: 0,
    connections: 0,
    nodeData:[],
    ConnectionData:[],
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load network information whenever dataset changes
  useEffect(() => {
    const selectedDataset = datasets.find(
      (item) => item.id === dataset
    );

    if (selectedDataset) {
      setEntryPoint(selectedDataset.entry);
    }

    fetch(
      `http://127.0.0.1:8000/network?dataset=${dataset}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.error) {
          setNetwork({
            nodes: data.node_count,
            connections: data.connection_count,
            nodeData:data.nodes,
            connectionData:data.connections,
          });
        }
      })
      .catch((error) => {
        console.error("Network loading error:", error);
      });

    setResult(null);
  }, [dataset]);

  const analyzeNetwork = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            entry_point: entryPoint,
            algorithm: algorithm,
            dataset: dataset,
          }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);

      setResult({
        error:
          "Unable to connect to CyberShield backend.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <div className="brand">
          <div className="shield">🛡️</div>

          <div>
            <h1>CyberShield</h1>
            <p>Network Intrusion Path Analyzer</p>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          SYSTEM READY
        </div>

      </header>


      <main>

        {/* NETWORK OVERVIEW */}
        <section className="overview">

          <div className="stat-card">
            <span>NETWORK NODES</span>
            <strong>{network.nodes}</strong>
          </div>

          <div className="stat-card">
            <span>CONNECTIONS</span>
            <strong>{network.connections}</strong>
          </div>

          <div className="stat-card warning">
            <span>REACHABLE VULNERABLE</span>
            <strong>
              {result
                ? result.vulnerable_nodes.length
                : "—"}
            </strong>
          </div>

          <div className="stat-card danger">
            <span>REACHABLE CRITICAL</span>
            <strong>
              {result
                ? result.critical_nodes.length
                : "—"}
            </strong>
          </div>

        </section>


        {/* ANALYSIS CONTROL */}
        <section className="control-panel">

          <div>
            <h2>🔍 Intrusion Path Analysis</h2>

            <p>
              Analyze potential network reachability
              from a simulated entry point.
            </p>
          </div>


          <div className="controls">

            {/* DATASET */}
            <div className="control">

              <label>Test Network</label>

              <select
                value={dataset}
                onChange={(e) =>
                  setDataset(e.target.value)
                }
              >

                {datasets.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name}
                  </option>
                ))}

              </select>

            </div>


            {/* ENTRY POINT */}
            <div className="control">

              <label>Entry Point</label>

              <select value={entryPoint} onChange={(e) => setEntryPoint(e.target.value)}>
  {network.nodeData.map((node) => (
    <option key={node.id} value={node.id}>
      {node.id} — {node.name}
    </option>
  ))}
</select>

            </div>


            {/* ALGORITHM */}
            <div className="control">

              <label>Analysis Method</label>

              <div className="algorithm-buttons">

                <button
                  className={
                    algorithm === "BFS"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setAlgorithm("BFS")
                  }
                >
                  Reachability
                </button>

                <button
                  className={
                    algorithm === "DFS"
                      ? "selected"
                      : ""
                  }
                  onClick={() =>
                    setAlgorithm("DFS")
                  }
                >
                  Deep Analysis
                </button>

              </div>

            </div>


            {/* ANALYZE */}
            <button
              className="analyze-button"
              onClick={analyzeNetwork}
              disabled={loading}
            >
              {loading
                ? "ANALYZING..."
                : "ANALYZE NETWORK"}
            </button>

          </div>

        </section>


        {/* NETWORK MAP */}
        <section className="network-section">

          <div className="section-title">

            <h2>🌐 Network Topology</h2>

            <span>
              {dataset.replace("_", " ").toUpperCase()}
            </span>

          </div>


          <div className="network-map">

            

              <NetworkGraph
  nodes={network.nodeData}
  connections={network.connectionData}
  traversal={
    result
      ? result.reachable_nodes
      : []
  }
  criticalPaths={
    result
      ? result.paths_to_critical
      : []
  }
/>
</div>

            

          <div className="legend">

  <span>
    <i className="normal"></i>
    Normal / Reachable
  </span>

  <span>
    <i className="vulnerable"></i>
    Vulnerable
  </span>

  <span>
    <i className="critical"></i>
    Critical
  </span>

  <span>
    <i className="path-line"></i>
    Detected Critical Path
  </span>

</div>

        </section>


        {/* RESULTS */}
        <section className="results-section">

          <h2>📊 Analysis Results</h2>


          {!result && (
            <div className="empty-result">

              Select a test network and algorithm,
              then click

              <strong>
                {" "}ANALYZE NETWORK
              </strong>.

            </div>
          )}


          {result && !result.error && (

            <div>

              <div className="result-cards">

                <div className="result-card">
                  <span>ALGORITHM</span>
                  <strong>
                    {result.algorithm}
                  </strong>
                </div>

                <div className="result-card">
                  <span>REACHABLE</span>
                  <strong>
                    {result.reachable_nodes.length}
                  </strong>
                </div>

                <div className="result-card">
                  <span>VULNERABLE</span>
                  <strong>
                    {result.vulnerable_nodes.length}
                  </strong>
                </div>

                <div className="result-card">
                  <span>CRITICAL</span>
                  <strong>
                    {result.critical_nodes.length}
                  </strong>
                </div>

              </div>
              <div className="risk-summary">

  <h3>🛡️ Network Risk Summary</h3>

  <div className="risk-items">

    <div>
      <span>Total Nodes</span>
      <strong>{network.nodes}</strong>
    </div>

    <div>
      <span>Total Connections</span>
      <strong>{network.connections}</strong>
    </div>

    <div>
      <span>Vulnerable Reachable</span>
      <strong>{result.vulnerable_nodes.length}</strong>
    </div>

    <div>
      <span>Critical Reachable</span>
      <strong>{result.critical_nodes.length}</strong>
    </div>

  </div>

</div>
              <div className="critical-paths">
  <h3>🚨 Paths to Critical Systems</h3>

  {result.paths_to_critical && result.paths_to_critical.length > 0 ? (
    result.paths_to_critical.map((item, index) => (
      <div className="critical-path" key={index}>
        <div className="path-target">
          🎯 Critical Target: <strong>{item.target}</strong>
        </div>

        <div className="path-route">
          {item.path.join(" → ")}
        </div>

        <div className="path-hops">
          {item.hops} hops
        </div>
      </div>
    ))
  ) : (
    <p className="no-path">
      No reachable critical systems found.
    </p>
  )}
</div>


              <div className="result-details">

                <div>
                  <h3>
                    🧭 Traversal Order
                  </h3>

                  <p>
                    {result.reachable_nodes.join(
                      " → "
                    )}
                  </p>
                </div>


                <div>
                  <h3>
                    ⚠️ Reachable Vulnerable Nodes
                  </h3>

                  <p>
                    {result.vulnerable_nodes.length
                      ? result.vulnerable_nodes.join(
                          ", "
                        )
                      : "None"}
                  </p>
                </div>


                <div>
                  <h3>
                    🚨 Reachable Critical Nodes
                  </h3>

                  <p>
                    {result.critical_nodes.length
                      ? result.critical_nodes.join(
                          ", "
                        )
                      : "None"}
                  </p>
                </div>

              </div>

            </div>
          )}


          {result?.error && (

            <div className="error">
              ⚠️ {result.error}
            </div>

          )}

        </section>

      </main>


      <footer>
        CyberShield • Graph-Based Network Security
        Analysis • Simulated / Advisory Only
      </footer>

    </div>
  );
}

export default App;