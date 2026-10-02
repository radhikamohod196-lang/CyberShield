from graph import load_network
from algorithms import bfs, dfs


# Load the first test dataset
nodes_file = "../datasets/01_basic/nodes.csv"
connections_file = "../datasets/01_basic/connections.csv"

# Build the graph
graph = load_network(nodes_file, connections_file)

print("===== CYBERSHIELD NETWORK TEST =====")

print("Number of nodes:", graph.number_of_nodes())
print("Number of connections:", graph.number_of_edges())

print("\nBFS Traversal:")
print(bfs(graph, "N1"))

print("\nDFS Traversal:")
print(dfs(graph, "N1"))