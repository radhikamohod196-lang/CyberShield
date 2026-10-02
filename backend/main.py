from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from graph import load_network
from algorithms import bfs, dfs,find_path


app = FastAPI(title="CyberShield API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


DATASETS = {
    "01_basic": "01_basic",
    "02_multiple_paths": "02_multiple_paths",
    "03_disconnected": "03_disconnected",
    "04_vulnerable_nodes": "04_vulnerable_nodes",
    "05_critical_target": "05_critical_target",
    "06_large_25_nodes": "06_large_25_nodes",
    "07_edge_cases": "07_edge_cases"
}


class AnalysisRequest(BaseModel):
    entry_point: str
    algorithm: str
    dataset: str = "01_basic"


def get_graph(dataset):
    if dataset not in DATASETS:
        return None

    folder = DATASETS[dataset]

    nodes_file = f"../datasets/{folder}/nodes.csv"
    connections_file = f"../datasets/{folder}/connections.csv"

    return load_network(nodes_file, connections_file)


@app.get("/")
def home():
    return {
        "message": "CyberShield API is running"
    }


@app.get("/datasets")
def get_datasets():
    return {
        "datasets": list(DATASETS.keys())
    }


@app.get("/network")
def network_info(dataset: str = "01_basic"):

    graph = get_graph(dataset)

    if graph is None:
        return {
            "error": "Dataset not found"
        }

    nodes = []

    for node in graph.nodes:
        nodes.append({
            "id": node,
            "name": graph.nodes[node]["name"],
            "type": graph.nodes[node]["node_type"],
            "vulnerable": graph.nodes[node]["vulnerable"],
            "critical": graph.nodes[node]["critical"]
        })

    connections = []

    for source, target in graph.edges:
        connections.append({
            "source": source,
            "target": target
        })

    return {
        "dataset": dataset,
        "nodes": nodes,
        "connections": connections,
        "node_count": graph.number_of_nodes(),
        "connection_count": graph.number_of_edges()
    }

def find_path(graph, start, target):
    """
    Find a path from start node to target node using BFS.
    Returns the path as a list of node IDs.
    Returns [] if no path exists.
    """

    if start not in graph or target not in graph:
        return []

    if start == target:
        return [start]

    queue = [(start, [start])]
    visited = {start}

    while queue:
        current, path = queue.pop(0)

        for neighbor in graph.neighbors(current):
            if neighbor in visited:
                continue

            new_path = path + [neighbor]

            if neighbor == target:
                return new_path

            visited.add(neighbor)
            queue.append((neighbor, new_path))

    return []


@app.post("/analyze")
def analyze(request: AnalysisRequest):

    graph = get_graph(request.dataset)

    if graph is None:
        return {
            "error": "Dataset not found"
        }

    entry_point = request.entry_point.upper()
    algorithm = request.algorithm.upper()

    if entry_point not in graph:
        return {
            "error": f"Node {entry_point} does not exist"
        }

    if algorithm == "BFS":
        traversal = bfs(graph, entry_point)

    elif algorithm == "DFS":
        traversal = dfs(graph, entry_point)

    else:
        return {
            "error": "Algorithm must be BFS or DFS"
        }

    vulnerable_nodes = []
    critical_nodes = []

    for node in traversal:

        if graph.nodes[node]["vulnerable"]:
            vulnerable_nodes.append(node)

        if graph.nodes[node]["critical"]:
            critical_nodes.append(node)

            paths_to_critical = []

            for critical_node in critical_nodes:

    # Only calculate a path if the critical node
    # was actually reached by BFS/DFS
                if critical_node in traversal:

                    path = find_path(
                    graph,
                    entry_point,
                    critical_node
                )

                if path:
                    paths_to_critical.append({
                        "target": critical_node,
                        "path": path,
                        "hops": len(path) - 1
            })

    return {
    "dataset": request.dataset,
    "entry_point": entry_point,
    "algorithm": algorithm,
    "reachable_nodes": traversal,
    "vulnerable_nodes": vulnerable_nodes,
    "critical_nodes": critical_nodes,
    "paths_to_critical": paths_to_critical,
    "total_nodes": graph.number_of_nodes(),
    "total_connections": graph.number_of_edges()
}