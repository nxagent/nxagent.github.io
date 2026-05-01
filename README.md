# NxAgent

Next Agents. Ship fast.

NxAgent is a draft agentic AI framework for building agents, tools, and multi-agent workflows in Python. This repository currently contains the early landing page and minimal documentation scaffold.

## Documentation

- [Docs](docs/index.html)
- [Get started](docs/get-started.html)
- [Quickstart](docs/quickstart.html)

## Install

```bash
pip install nx-agent
```

Package publishing is planned. The install command is placeholder copy until the package is available.

## Quickstart

```python
from nx_agent import Agent, Tool

@Tool
def web_search(query: str) -> str:
    return "Search results for: " + query

researcher = Agent(
    role="Research Analyst",
    goal="Find and synthesize accurate information",
    tools=[web_search],
)

result = researcher.run("Summarize the latest advances in agentic AI")
print(result)
```

## License

MIT
