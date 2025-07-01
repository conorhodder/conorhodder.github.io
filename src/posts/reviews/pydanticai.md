---
title: "Pydantic AI Review"
date: 2024-06-10
tags: [review, pydanticai]
layout: review.njk
summary: "A critical review of Pydantic AI — what works, what doesn't, and who should care."
---

## Summary

Pydantic AI is a deliberate attempt to bring the same rigor, reliability, and developer-first philosophy that made Pydantic a staple in Python backends to the chaotic world of LLM outputs.

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

- You aren't comfortable integrating an Agentic AI system into a graph orchestration system like LangGraph
- You want a plug-and-play ecosystem with lots of integrations (vector stores, retrievers, etc.).
- You require sub-second, high-throughput performance at scale.
- You want a "batteries included" agent platform (memory, tool selection, multi-agent collaboration, etc.).

## Strengths

- Type Safety as a first order concept
- Solid integration into observability tooling using open source frameworks

## Weaknesses

- Clumsy attempt at graph orchestration, requires external library.
- Performance cost at large scale

## Deep Dive

### Development Methodology

Pydantic AI is built by the core maintainers of Pydantic, led by Samuel Colvin. Their track record is clear: they've set the standard for type safety and validation in Python, with a relentless focus on correctness, performance, and developer experience. The project is open-source, community-driven, and shaped by real-world feedback from thousands of production users.

- **Type safety as a non-negotiable:** Pydantic AI enforces strict contracts between your code and the LLM, catching errors at the boundary—before they can corrupt your data or logic.
- **Fail fast, fail loud:** Instead of silent failures or brittle hacks, you get immediate, actionable errors. This is a conscious rejection of the "move fast and break things" mentality that plagues most LLM integrations.
- **Pythonic, developer-first design:** The API is intuitive, composable, and leverages the best of Python's typing ecosystem. You don't have to fight the tool to get reliable results.
- **Open-source ethos:** The team prioritizes transparency, documentation, and community input, ensuring the tool evolves to meet real developer needs.

### Developer Experience

The pythonic design of Pydantic AI provides a seamless environment for experienced Python developers to write code that will perform at scale.

### Testing & Evaluation

One of the biggest advantages of Pydantic AI is that it brings type safety and schema validation to the unpredictable world of LLMs. This makes happy-path testing much easier: you can write tests that assert your agent returns a valid, typed model—or fails loudly if the LLM output is malformed.

**What's easy:**

- You can test that your agent returns the right structure, and that invalid outputs are caught by validation.
- Downstream code can rely on real types, so you don't need to write defensive tests for every possible shape of data.

**What's hard:**

- Testing complex agent flows, tool errors, or dependency injection edge cases can be tricky. Error messages aren't always clear, and mocking LLM responses or tool calls requires extra setup.
- If your agent uses async tools or external APIs, you'll need to use async test frameworks (like pytest-asyncio) and carefully mock dependencies.

**Example: Testing a Pydantic AI Agent**

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

### Observability

As LLM-powered systems move into production, observability becomes non-negotiable. You need to know not just if your code works, but how it behaves in the wild—where latency spikes, where errors occur, and how agent flows perform end-to-end. Pydantic AI is built to be observability-agnostic, with first-class support for OpenTelemetry (OTel).

**Pydantic AI & OpenTelemetry Integration**
Pydantic AI can be instrumented with OpenTelemetry to provide:

- Tracing of agent calls, tool invocations, and validation steps
- Metrics on latency, error rates, token usage, and throughput
- Context propagation across async and multi-agent workflows

**How to Instrument with OpenTelemetry**

1. **Set Custom OTel Providers with InstrumentationSettings**

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

Pydantic AI does not come with any out of the box solution for deployment, and focused entirely on the development of the agents. With that being said, it does focus on containerised technologies for runtime and therefore is simple to integrate into your Cloud environments, K8s or any other OCI compliant runtime.

### Best Practices

- **Unit tests:** Always write unit tests for your business logic, especially for code that consumes Pydantic AI outputs. Mock LLM/model responses to test both valid and invalid cases. Use async test frameworks (like pytest-asyncio) for async agent flows.
- **Evaluation tests:** Go beyond unit tests—use evaluation frameworks or custom scripts to measure LLM output quality on real or synthetic datasets. Track accuracy, robustness, and failure modes. Treat your prompts and schemas as code: version, test, and review them.
- **Instrument early:** Add OpenTelemetry instrumentation (via InstrumentationSettings) from day one. This gives you traces, metrics, and logs for agent runs, tool calls, and validation steps. Exclude sensitive content in production if needed.
- **Use Pydantic AI for validation, LangGraph for flow:** For complex, multi-step agentic workflows, use Pydantic AI to validate and structure LLM/tool outputs, but let LangGraph handle orchestration, branching, and state management.
- **Glue code:** Write thin adapters to connect Pydantic AI agents as nodes or tools within your LangGraph graphs. Test these integrations with both happy-path and error scenarios.
- **Iterate fast:** Start with simple flows, then incrementally add complexity. Use observability and evaluation data to refine both your orchestration logic and your Pydantic schemas.
- **Be explicit:** Write clear, unambiguous prompts and document their intent. Small changes can have big effects—track and review prompt changes like code.
- **Version prompts:** Use version control for prompts and system instructions. When updating, run regression tests to catch unexpected changes in LLM behavior.
- **Plan for change:** As your application evolves, your Pydantic models will too. Use versioned schemas and migration strategies to avoid breaking downstream consumers.
- **Validate old data:** When updating schemas, ensure you can still parse and validate historical outputs or logs for auditability and debugging.
- **Limit logging of sensitive data:** Use InstrumentationSettings to exclude prompts, completions, or tool arguments that may contain PII or proprietary information.
- **Review observability exports:** Regularly audit what data is sent to observability backends, especially in regulated environments.

---

**Want more?**  
If you need a full walkthrough, integration tips, or want to see how Pydantic AI compares to LangChain or other frameworks, let me know.
