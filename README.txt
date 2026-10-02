Network Intrusion Path Analyzer - Test Datasets

Purpose:
These CSV files are TEST/INPUT DATA ONLY for a graph-based prototype.
They are NOT training data and are not intended for machine learning.

Each dataset contains:
- nodes.csv: network nodes and their simulated security properties
- connections.csv: graph edges between nodes

Suggested entry points:
01_basic: N1
02_multiple_paths: N1
03_disconnected: N1
04_vulnerable_nodes: N1
05_critical_target: N1
06_large_25_nodes: N01
07_edge_cases: N1 (also test N2 to verify cycle handling)

Important:
- These are simulated networks.
- They do not contain real IP addresses, credentials, or real vulnerability exploitation data.
- Your application should load these files, build a graph, and run BFS/DFS.
- The vulnerable and critical columns are labels for analysis, not ML targets.

Expected algorithm goals:
BFS: traversal order and minimum-hop paths in the unweighted graph.
DFS: depth-first traversal and reachable-node exploration.
Security analysis: identify reachable vulnerable and critical nodes from the selected entry point.
