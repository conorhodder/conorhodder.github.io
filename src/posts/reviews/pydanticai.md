---
title: "Pydantic AI Review"
date: 2024-06-10
tags: [review, pydanticai]
layout: review.njk
summary: "A critical review of Pydantic AI — what works, what doesn't, and who should care."
---

## Summary

Pydantic AI is a deliberate attempt to bring the same rigor, reliability, and developer-first philosophy that made [Pydantic](https://docs.pydantic.dev/) a staple in Python backends to the chaotic world of LLM outputs.

It is not magic, but it's a _real_ step forward for anyone serious about production-grade LLM applications. It brings the rigor of type safety and validation to a domain that desperately needs it. If you're building anything where LLM output needs to be reliable, you're playing with fire if you don't use something like this.

**Don't mistake guardrails for guarantees. Use Pydantic AI as one layer in a broader strategy for LLM reliability, not as your only defense.**

## When to use it

**Use Pydantic AI if:**

- You need type-safe, validated LLM outputs and want to catch errors early.
- Your workflow is mostly linear or tool-based, not complex multi-step agentic graphs.
- You value Pythonic APIs, open-source ethos, and strong schema validation.
- You're comfortable with some DIY integration and can tolerate a smaller ecosystem.
- You want to build production-grade LLM applications with explicit contracts between your code and the model.

**Avoid Pydantic AI if:**

- You aren't comfortable integrating an Agentic AI system into a graph orchestration system like [LangGraph](https://langchain-ai.github.io/langgraph/)
- You want a plug-and-play ecosystem with lots of integrations (vector stores, retrievers, etc.).
- You require sub-second, high-throughput performance at scale.
- You want a "batteries included" agent platform (memory, tool selection, multi-agent collaboration, etc.)
- You don't have a strong engineering team.

## Best Practices

- **Use Pydantic AI for validation, LangGraph for flow:** For complex, multi-step agentic workflows, use Pydantic AI to validate and structure LLM/tool outputs, but let LangGraph handle orchestration, branching, and state management. Write thin adapters to connect Pydantic AI agents as nodes or tools within your LangGraph graphs. Test these integrations with both happy-path and error scenarios. ([LangGraph docs](https://langchain-ai.github.io/langgraph/))
- **Plan for evolution:** As your application evolves, your Pydantic models will too. Use versioned schemas and migration strategies to avoid breaking downstream consumers. When updating schemas, ensure you can still parse and validate historical outputs or logs for auditability and debugging.
- **Instrument with OpenTelemetry**: Add OTel instrumentation from day one to capture traces, metrics, and logs for agent runs, tool calls, and validation steps. Exclude sensitive data in production and regularly audit what is exported to observability backends, especially in regulated environments. ([OpenTelemetry docs](https://opentelemetry.io/docs/))

## Deep Dive

### Development Methodology

Pydantic AI is built by the core maintainers of Pydantic, led by Samuel Colvin. Their track record is clear: they've set the standard for type safety and validation in Python, with a relentless focus on correctness, performance, and developer experience. The project is open-source, community-driven, and shaped by real-world feedback from thousands of production users. ([Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai))

- **Type safety as a non-negotiable:** Pydantic AI enforces strict contracts between your code and the LLM, catching errors at the boundary—before they can corrupt your data or logic.
- **Fail fast, fail loud:** Instead of silent failures or brittle hacks, you get immediate, actionable errors. This is a conscious rejection of the "move fast and break things" mentality that plagues most LLM integrations.
- **Pythonic, developer-first design:** The API is intuitive, composable, and leverages the best of Python's typing ecosystem. You don't have to fight the tool to get reliable results.
- **Open-source ethos:** The team prioritizes transparency, documentation, and community input, ensuring the tool evolves to meet real developer needs.

### Developer Experience

The pythonic design of Pydantic AI provides a seamless environment for experienced Python developers to write code that will perform at scale. But the real value is in how it transforms the day-to-day workflow:

#### Instantly Catching LLM Output Errors

With Pydantic AI, you don't have to write defensive code for every possible malformed LLM output. The schema validation does it for you:

```python
from pydantic import BaseModel
from pydantic_ai import Agent

class Product(BaseModel):
    name: str
    price: float

agent = Agent("gpt-4o", result_type=Product)

# If the LLM returns a string for price, or omits a field, you get a clear error—not a silent bug.
try:
    result = agent.run_sync("Generate a product with name and price.")
    print(result.data)
except Exception as e:
    print("Validation failed:", e)
```

#### Type-Safe Autocompletion and Refactoring

Because outputs are real Pydantic models, your IDE can autocomplete fields and catch typos:

```python
# IDE will suggest .name and .price, not random dict keys
product = result.data
print(product.name)
print(product.price)
```

#### Easy Testing and Mocking

You can mock LLM responses with real models, making tests simple and robust:

```python
def test_agent_returns_valid_product(monkeypatch):
    class DummyModel:
        def run_sync(self, prompt, **kwargs):
            return type('Result', (), {'data': Product(name='Widget', price=19.99)})()
    agent = Agent(DummyModel(), result_type=Product)
    result = agent.run_sync('Generate a product.')
    assert result.data.name == 'Widget'
    assert result.data.price == 19.99
```

#### Schema-Driven Prompting

You can generate prompts or validate outputs directly from your Pydantic models, reducing duplication and drift:

```python
from pydantic_ai.prompting import prompt_from_schema

prompt = prompt_from_schema(Product)
print(prompt)
# Output: "Generate a product with the following fields: name (string), price (float)."
```

#### Effortless Integration with Tooling

Because Pydantic AI uses standard Python types, you can plug outputs directly into FastAPI, SQLModel, or other frameworks:

```python
from fastapi import FastAPI

app = FastAPI()

@app.post("/product")
def create_product(product: Product):
    # product is already validated and type-safe
    ...
```

### Integrating with Tools

Pydantic AI is designed to be extensible, allowing you to write your own custom tools and integrate with broader automation or orchestration platforms like MCP (Modular Command Platform). This flexibility is crucial for building real-world, production-grade LLM applications. ([MCP docs](https://ai.pydantic.dev/mcp/client/#sse-client))

A "tool" in the context of agentic frameworks is typically a function or class that performs a specific action—such as calling an API, querying a database, or transforming data. With Pydantic AI, you can define tools with strong type safety using Pydantic models for both input and output.

**Example: Defining and Registering a Custom Tool**

```python
from pydantic import BaseModel
from pydantic_ai.tools import Tool, register_tool

class WeatherInput(BaseModel):
    city: str

class WeatherOutput(BaseModel):
    temperature_c: float
    description: str

def get_weather(data: WeatherInput) -> WeatherOutput:
    # Imagine this calls a real API
    return WeatherOutput(temperature_c=22.5, description="Sunny")

weather_tool = Tool(
    name="get_weather",
    description="Get the current weather for a city.",
    input_model=WeatherInput,
    output_model=WeatherOutput,
    func=get_weather,
)

register_tool(weather_tool)
```

You can now use this tool in your agent flows, and Pydantic AI will validate all inputs and outputs automatically.

**Example: Attaching an MCP Server to an Agent**

```python
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerSSE

# 1. Define the MCP server (could be a GitHub tool server, etc.)
server = MCPServerSSE(url='http://localhost:3001/sse')

# 2. Create the agent with the MCP server attached
agent = Agent('openai:gpt-4o', mcp_servers=[server])

# 3. Use the agent as normal; it can now call any tool provided by the MCP server
async def main():
    async with agent.run_mcp_servers():
        result = await agent.run('Open a pull request on repo X with title Y and body Z')
    print(result.output)
```

- The LLM can now "see" and invoke the tools provided by the MCP server (e.g., `open_pull_request`, `add_label`, etc.) as part of its tool-calling capabilities.
- No glue code or manual tool registration required—the agent dynamically discovers and uses the tools.
- You can connect to multiple MCP servers, use tool prefixes to avoid naming conflicts, and even do sampling/proxying of LLM calls.

For more details and advanced usage (including tool call customization, prefixes, and sampling), see the official docs: [Pydantic AI MCP Client](https://ai.pydantic.dev/mcp/client/#sse-client).

### Testing & Evaluation

One of the biggest advantages of Pydantic AI is that it brings type safety and schema validation to the unpredictable world of LLMs. This makes happy-path testing much easier: you can write tests that assert your agent returns a valid, typed model—or fails loudly if the LLM output is malformed. ([Testing LLMs](https://arxiv.org/abs/2307.10169))

**What's easy:**

- You can test that your agent returns the right structure, and that invalid outputs are caught by validation.
- Downstream code can rely on real types, so you don't need to write defensive tests for every possible shape of data.

**What's hard:**

- Testing complex agent flows, tool errors, or dependency injection edge cases can be tricky. Error messages aren't always clear, and mocking LLM responses or tool calls requires extra setup.
- If your agent uses async tools or external APIs, you'll need to use async test frameworks (like [pytest-asyncio](https://pytest-asyncio.readthedocs.io/en/latest/)) and carefully mock dependencies.

**Example: Unit Testing a Pydantic AI Agent**

```python
import pytest
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel

class UserProfile(BaseModel):
    name: str
    age: int
    email: str

def test_agent_returns_valid_user(monkeypatch):
    # Mock the LLM response to return a valid user
    class DummyModel:
        def run_sync(self, prompt, **kwargs):
            return type('Result', (), {'data': UserProfile(name='Alice', age=30, email='alice@example.com')})()
    agent = Agent(DummyModel(), result_type=UserProfile)
    result = agent.run_sync('Generate a user profile.')
    assert result.data.name == 'Alice'
    assert result.data.age == 30
    assert result.data.email == 'alice@example.com'
```

Pydantic AI makes it much easier to write meaningful, business-focused tests for LLM-powered code. But for complex agent flows, you'll need to invest in good test infrastructure and be ready to mock or stub out the unpredictable parts.

**Example: Using pydantic-eval for LLM Output Evaluation**

For evaluation tests, you can go beyond schema validation and use the [pydantic-eval](https://github.com/pydantic/eval) package to automate the process of having an LLM judge the quality or correctness of another LLM's output. This is especially useful for subjective or open-ended tasks where strict validation isn't enough.

`pydantic-eval` provides a simple interface for running LLM-based evaluations at scale, with built-in support for common metrics and prompt templates.

```python
from pydantic_eval import LLMJudge, JudgedExample
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel

# Agent that generates a summary
summary_agent = Agent(OpenAIModel("gpt-4o"))

input_text = "Pydantic AI is a library for validating LLM outputs."
summary = summary_agent.run_sync(f"Summarize: {input_text}").output

# Use pydantic-eval's LLMJudge to evaluate the summary
judge = LLMJudge(model="gpt-4o")

example = JudgedExample(
    input=input_text,
    output=summary,
    reference="Pydantic AI helps ensure LLM outputs are type-safe and valid."
)

result = judge.judge(
    example,
    rubric="Rate the summary for accuracy and completeness on a scale of 1 to 5."
)

print(f"Summary: {summary}")
print(f"LLM Judge Score: {result.score}")
print(f"LLM Judge Explanation: {result.explanation}")
```

**Benefits:**

- Standardizes LLM-based evaluation with reusable rubrics and consistent scoring.
- Scales to large test sets and supports advanced reporting.
- Reduces boilerplate and manual prompt engineering.

This pattern is powerful for regression testing, prompt tuning, and continuous evaluation of LLM-powered systems. Always review a sample of LLM-judged results to ensure quality and fairness.

### Observability

As LLM-powered systems move into production, observability becomes non-negotiable. You need to know not just if your code works, but how it behaves in the wild—where latency spikes, where errors occur, and how agent flows perform end-to-end. Pydantic AI is built to be observability-agnostic, with first-class support for [OpenTelemetry (OTel)](https://opentelemetry.io/). ([LLM Observability](https://arxiv.org/abs/2307.10169))

**Pydantic AI & OpenTelemetry Integration**
Pydantic AI can be instrumented with OpenTelemetry to provide:

- Tracing of agent calls, tool invocations, and validation steps
- Metrics on latency, error rates, token usage, and throughput
- Context propagation across async and multi-agent workflows

**How to Instrument with OpenTelemetry**

1. **Set Custom OTel Providers with InstrumentationSettings** ([Pydantic AI OTel docs](https://ai.pydantic.dev/logfire/#instrumenting-a-specific-model))

```python
from opentelemetry.sdk._events import EventLoggerProvider
from opentelemetry.sdk.trace import TracerProvider
from pydantic_ai.agent import Agent, InstrumentationSettings

instrumentation_settings = InstrumentationSettings(
    tracer_provider=TracerProvider(),
    event_logger_provider=EventLoggerProvider(),
)

agent = Agent('gpt-4o', instrument=instrumentation_settings)
# Or instrument all agents globally:
Agent.instrument_all(instrumentation_settings)
```

2. **Instrument a Specific Model**

```python
from pydantic_ai import Agent
from pydantic_ai.models.instrumented import InstrumentationSettings, InstrumentedModel

settings = InstrumentationSettings()
model = InstrumentedModel('gpt-4o', settings)
agent = Agent(model)
```

3. **Exclude Sensitive Content or Binary Data**

```python
from pydantic_ai.agent import Agent, InstrumentationSettings

instrumentation_settings = InstrumentationSettings(include_content=False)
agent = Agent('gpt-4o', instrument=instrumentation_settings)
```

4. **Send Data to Any OTel Backend**

You can send data to any OTel-compatible backend (Grafana, Datadog, Honeycomb, otel-tui, etc.) by configuring the appropriate environment variables:

```python
import os
from pydantic_ai.agent import Agent

os.environ['OTEL_EXPORTER_OTLP_ENDPOINT'] = 'http://localhost:4318'
Agent.instrument_all()
agent = Agent('openai:gpt-4o')
result = agent.run_sync('What is the capital of France?')
print(result.output)
```

For more details and advanced usage, see the official docs: [PydanticAI Debugging and Monitoring](https://ai.pydantic.dev/logfire/#instrumenting-a-specific-model).

### Deployment

Pydantic AI does not come with any out of the box solution for deployment, and focused entirely on the development of the agents. With that being said, it does focus on containerised technologies for runtime and therefore is simple to integrate into your Cloud environments, K8s or any other OCI compliant runtime. ([Kubernetes best practices](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/))

### Strengths

- Type Safety as a first order concept ([Pydantic docs](https://docs.pydantic.dev/))
- Solid integration into observability tooling using open source frameworks ([OpenTelemetry](https://opentelemetry.io/))
- Clear, actionable error messages that speed up debugging
- Extensible with custom validators and plugins
- Excellent documentation and active community support ([Pydantic AI docs](https://ai.pydantic.dev/))
- Pythonic, intuitive API design that fits naturally into modern Python projects
- Strong support for schema evolution and versioning
- Easy integration with [FastAPI](https://fastapi.tiangolo.com/), [SQLModel](https://sqlmodel.tiangolo.com/), and other popular Python frameworks

### Weaknesses

- Clumsy attempt at graph orchestration, requires external library.
- Performance cost at large scale
- Limited ecosystem compared to more mature agentic frameworks (e.g., [LangChain](https://python.langchain.com/))
- Steep learning curve for teams unfamiliar with Pydantic or type-driven development
- Async support is present but not as seamless as sync flows
- Occasional breaking changes as the project evolves rapidly
- Smaller set of out-of-the-box integrations (retrievers, memory, tools) than some competitors
- Some advanced features require deep understanding of Python typing and Pydantic internals

---

**Want more?**  
If you need a full walkthrough, integration tips, or want to see how Pydantic AI compares to LangChain or other frameworks, let me know.
