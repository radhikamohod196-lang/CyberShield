function NetworkGraph({ nodes, connections, traversal,criticalPaths }) {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="map-message">
        <h3>No network data loaded</h3>
      </div>
    );
  }

  const positions = {};

  const highlightedEdges = new Set();

if (criticalPaths) {
  criticalPaths.forEach((item) => {
    const path = item.path;

    for (let i = 0; i < path.length - 1; i++) {
      highlightedEdges.add(`${path[i]}-${path[i + 1]}`);
      highlightedEdges.add(`${path[i + 1]}-${path[i]}`);
    }
  });
}

  nodes.forEach((node, index) => {
    positions[node.id] = {
      x: 100 + (index % 4) * 210,
      y: 100 + Math.floor(index / 4) * 150,
    };
  });

  return (
    <div className="cyber-network">

      <svg
        width="100%"
        height="500"
        viewBox="0 0 900 500"
      >

        {/* CONNECTIONS */}
        {connections.map((connection, index) => {

          const source = positions[connection.source];
          const target = positions[connection.target];

          if (!source || !target) {
            return null;
          }

          return (
            <line
  key={index}
  x1={source.x}
  y1={source.y}
  x2={target.x}
  y2={target.y}
  stroke={
    highlightedEdges.has(
      `${connection.source}-${connection.target}`
    )
      ? "#ff4d6d"
      : "#4d7896"
  }
  strokeWidth={
    highlightedEdges.has(
      `${connection.source}-${connection.target}`
    )
      ? "6"
      : "3"
  }
/>
          );
        })}


        {/* NODES */}
        {nodes.map((node) => {

          const position = positions[node.id];

          let color = "#1c405c";

        if (node.critical) {
          color = "#8b2635";
        } else if (node.vulnerable) {
          color = "#806b24";
        } else if (traversal && traversal.includes(node.id)) {
          color = "#075985";
        }

          return (
            <g key={node.id}>

              <circle
                cx={position.x}
                cy={position.y}
                r="38"
                fill={color}
                stroke="#5ecbff"
                strokeWidth="3"
              />

              <text
                x={position.x}
                y={position.y - 3}
                textAnchor="middle"
                fill="white"
                fontSize="15"
                fontWeight="bold"
              >
                {node.id}
              </text>

              <text
                x={position.x}
                y={position.y + 15}
                textAnchor="middle"
                fill="white"
                fontSize="10"
              >
                {node.name}
              </text>

            </g>
          );
        })}

      </svg>

    </div>
  );
}

export default NetworkGraph;