# NxAgent

Build your Next Agent.

NxAgent is a draft agentic AI framework for building agents, tools, and multi-agent workflows in Python. This repository currently contains the early landing site, docs preview, and get-started page.

## Site Sections

- [Features](index.html#features)
- [Workflow](index.html#workflow)
- [Applications](index.html#applications)
- [Docs](docs/)
- [Get started](get-started/)

## Install

```bash
pip install nx-agent
```

Package publishing is planned. The install command is placeholder copy until the package is available.

## Local Preview

Open `index.html` directly in your browser, or use a local server for clean URLs like `docs/` and `get-started/`.

## Get Started

```python
from nx_agent import Agent, tool

@tool
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
