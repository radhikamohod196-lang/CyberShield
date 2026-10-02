from collections import deque


def bfs(graph, start_node):
    visited = set()
    queue = deque([start_node])
    traversal_order = []

    visited.add(start_node)

    while queue:
        current = queue.popleft()
        traversal_order.append(current)

        for neighbor in graph.neighbors(current):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return traversal_order


def dfs(graph, start_node):
    visited = set()
    traversal_order = []

    def dfs_visit(node):
        visited.add(node)
        traversal_order.append(node)

        for neighbor in graph.neighbors(node):
            if neighbor not in visited:
                dfs_visit(neighbor)

    dfs_visit(start_node)

    return traversal_order

def find_path(graph, start, target):
    """
    Find a shortest path from start node to target node using BFS.
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