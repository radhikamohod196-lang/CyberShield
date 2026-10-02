import pandas as pd
import networkx as nx


def load_network(nodes_file, connections_file):
    # Read the CSV files
    nodes_df = pd.read_csv(nodes_file)
    connections_df = pd.read_csv(connections_file)

    # Create a directed graph
    graph = nx.DiGraph()

    # Add nodes with their security information
    for _, row in nodes_df.iterrows():
        graph.add_node(
            row["node_id"],
            name=row["node_name"],
            node_type=row["node_type"],
            vulnerable=str(row["vulnerable"]).lower() in ("yes", "true", "1"),
critical=str(row["critical"]).lower() in ("yes", "true", "1"),
        )

    # Add network connections
    for _, row in connections_df.iterrows():
        graph.add_edge(
            row["source"],
            row["target"]
        )

    return graph