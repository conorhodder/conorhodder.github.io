---
title: "Pydantic AI Review"
date: 2024-06-10
tags: [review, pydanticai]
layout: review.njk
summary: "A critical review of Pydantic AI — what works, what doesn't, and who should care."
---

## What is Pydantic AI?

Pydantic AI is the latest project from Samuel Colvin and the team behind the original Pydantic library—one of Python's most trusted tools for data validation and type enforcement. This isn't just another LLM utility: it's a deliberate attempt to bring the same rigor, reliability, and developer-first philosophy that made Pydantic a staple in Python backends to the chaotic world of LLM outputs.

**Who makes it?**
Pydantic AI is built by the core maintainers of Pydantic, led by Samuel Colvin. Their track record is clear: they've set the standard for type safety and validation in Python, with a relentless focus on correctness, performance, and developer experience. The project is open-source, community-driven, and shaped by real-world feedback from thousands of production users.

**Their methodology:**

- **Type safety as a non-negotiable:** Pydantic AI enforces strict contracts between your code and the LLM, catching errors at the boundary—before they can corrupt your data or logic.
- **Fail fast, fail loud:** Instead of silent failures or brittle hacks, you get immediate, actionable errors. This is a conscious rejection of the "move fast and break things" mentality that plagues most LLM integrations.
- **Pythonic, developer-first design:** The API is intuitive, composable, and leverages the best of Python's typing ecosystem. You don't have to fight the tool to get reliable results.
- **Open-source ethos:** The team prioritizes transparency, documentation, and community input, ensuring the tool evolves to meet real developer needs.

**Why does this matter?**
Most LLM integrations are held together with string parsing, regexes, and hope. Pydantic AI is a hard reset: it gives you the confidence to build production systems on top of LLMs, knowing that your data contracts are enforced and your errors are surfaced immediately. If you care about reliability, maintainability, and not getting burned by silent LLM failures, this is the only sane way forward.

---

## Technical Deep Dive

### The Core Problem: LLM Outputs Are Unstructured

LLMs (like GPT-4) return free-form text. If you want to use them for anything serious—data extraction, API responses, or agentic workflows—you need to turn that text into structured, validated data. Most teams hack this together with regexes, brittle string parsing, or "hope and pray" JSON parsing. This is a recipe for silent failures and production nightmares.

**Pydantic AI's core value:**  
It lets you define the _shape_ of your expected output using Pydantic models, then parses and validates LLM responses against those models. If the output doesn't match, you get a clear error—no more silent data corruption.

---

### Example: Type-Safe LLM Output Parsing

Suppose you want your LLM to return a user profile. Here's how you'd do it with Pydantic AI:

```python
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel

# 1. Define your schema
class UserProfile(BaseModel):
    name: str
    age: int
    email: str

# 2. Set up your model and agent
model = OpenAIModel('gpt-4o', api_key="sk-...")
agent = Agent(model, result_type=UserProfile)

# 3. Prompt the LLM and parse the output
prompt = "Generate a user profile with name, age, and email."
result = agent.run_sync(prompt)
print(result.data)  # UserProfile(name='Alice', age=30, email='alice@example.com')
```

**What's happening here?**

- You define the _contract_ (UserProfile).
- The agent ensures the LLM output matches this contract, retrying or raising if not.
- If the LLM hallucinates or returns malformed data, you catch it immediately.

---

### Type Safety: Not Just a Buzzword

With Pydantic AI, your downstream code can rely on _actual types_, not "maybe this is a dict, maybe it's a string." This means:

- **IDE autocompletion** works.
- **Static analysis** tools can catch mistakes.
- **Refactoring** is safe.
- **Unit tests** are meaningful.

**Example: Downstream code is safe**

```python
def send_welcome_email(user: UserProfile):
    # No need to check if 'email' exists or is a string
    send_email(to=user.email, subject="Welcome!", body="Hello, " + user.name)
```

---

### Error Handling: Fail Fast, Fail Loud

If the LLM returns something invalid, Pydantic AI raises a `ValidationError`. This is a feature, not a bug. It means you can:

- Retry the LLM call
- Alert the user
- Log the failure for debugging

**Example: Handling LLM hallucinations**

```python
try:
    user = parser.parse(prompt)
except ValidationError as e:
    # Handle gracefully
    print("LLM output was invalid:", e)
    # Optionally, re-prompt or escalate
```

---

### Advanced: Nested Models and Enums

Pydantic AI supports complex, nested schemas—critical for real-world use.

```python
from enum import Enum

class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"

class UserProfile(BaseModel):
    name: str
    age: int
    email: str
    role: Role

# LLM output must now include a valid role, or validation fails
```

---

### Limitations and Gotchas

- **Garbage in, garbage out:** If your prompt is vague, the LLM will still hallucinate. Pydantic AI can only validate structure, not truth.
- **Performance:** Parsing and validation add latency. For high-throughput systems, benchmark before deploying.
- **Schema drift:** If you change your Pydantic model, update your prompts accordingly—or you'll get validation errors.

#### Weaknesses & Gotchas

- **Graph Definitions Are Painful:** One of the biggest weaknesses I encountered with Pydantic AI is its approach to defining agentic graphs (multi-step, branching workflows). The API for graph construction is clunky, under-documented, and far less intuitive than the rest of the library. I found myself fighting the framework, spending more time wrangling with graph definitions than building actual business logic. After repeated frustration, I had to lean on LangGraph—a library purpose-built for agentic graph workflows—which provided a much smoother, more ergonomic experience for complex, multi-step agent flows. If your use case involves anything beyond simple linear or tool-based agents, be prepared for friction, and consider whether Pydantic AI is the right fit for advanced graph-based orchestration.

- **Limited Ecosystem & Integrations:** Compared to frameworks like LangChain or Haystack, Pydantic AI's ecosystem is small. There are few plug-and-play integrations for vector stores, retrievers, or external tools. If your workflow goes beyond basic LLM calls and validation, expect to write a lot of glue code yourself.

- **Error Handling & Debuggability:** While validation errors are surfaced well, error messages for tool failures, dependency injection issues, or agent misconfigurations can be cryptic or unhelpful. Debugging complex agent flows is harder than it should be, especially for newcomers or when things go wrong in production.

- **Performance Overhead:** The type validation and retry logic add measurable latency. For high-throughput or real-time applications, this can be a dealbreaker. If you need sub-second responses or are running at scale, you'll need to benchmark carefully and may have to optimize or bypass parts of the stack.

---

## Observability

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

**Summary:**
Pydantic AI's observability is built on OpenTelemetry, so you can use any OTel backend, customize providers, and control what data is sent. For more details and advanced usage, see the official docs: [PydanticAI Debugging and Monitoring](https://ai.pydantic.dev/logfire/#instrumenting-a-specific-model).

---

## Testing Pydantic AI-Powered Code

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

**Bottom line:**
Pydantic AI makes it much easier to write meaningful, business-focused tests for LLM-powered code. But for complex agent flows, you'll need to invest in good test infrastructure and be ready to mock or stub out the unpredictable parts.

---

## Best Practices

### 1. Testing (Unit & Evaluation)

- **Unit tests:** Always write unit tests for your business logic, especially for code that consumes Pydantic AI outputs. Mock LLM/model responses to test both valid and invalid cases. Use async test frameworks (like pytest-asyncio) for async agent flows.
- **Evaluation tests:** Go beyond unit tests—use evaluation frameworks or custom scripts to measure LLM output quality on real or synthetic datasets. Track accuracy, robustness, and failure modes. Treat your prompts and schemas as code: version, test, and review them.

### 2. Observability Instrumentation

- **Instrument early:** Add OpenTelemetry instrumentation (via InstrumentationSettings) from day one. This gives you traces, metrics, and logs for agent runs, tool calls, and validation steps. Exclude sensitive content in production if needed.
- **Backend flexibility:** Send data to any OTel-compatible backend (Grafana, Datadog, Honeycomb, otel-tui, etc.) and monitor latency, error rates, and token usage. Use traces to debug bottlenecks and failures in real-world workflows.

### 3. Integration into LangGraph for Orchestration

- **Use Pydantic AI for validation, LangGraph for flow:** For complex, multi-step agentic workflows, use Pydantic AI to validate and structure LLM/tool outputs, but let LangGraph handle orchestration, branching, and state management.
- **Glue code:** Write thin adapters to connect Pydantic AI agents as nodes or tools within your LangGraph graphs. Test these integrations with both happy-path and error scenarios.
- **Iterate fast:** Start with simple flows, then incrementally add complexity. Use observability and evaluation data to refine both your orchestration logic and your Pydantic schemas.

### 4. Prompt Engineering & Versioning

- **Be explicit:** Write clear, unambiguous prompts and document their intent. Small changes can have big effects—track and review prompt changes like code.
- **Version prompts:** Use version control for prompts and system instructions. When updating, run regression tests to catch unexpected changes in LLM behavior.

### 5. Schema Evolution & Backward Compatibility

- **Plan for change:** As your application evolves, your Pydantic models will too. Use versioned schemas and migration strategies to avoid breaking downstream consumers.
- **Validate old data:** When updating schemas, ensure you can still parse and validate historical outputs or logs for auditability and debugging.

### 6. Security & Privacy

- **Limit logging of sensitive data:** Use InstrumentationSettings to exclude prompts, completions, or tool arguments that may contain PII or proprietary information.
- **Review observability exports:** Regularly audit what data is sent to observability backends, especially in regulated environments.

### 7. Dependency Management & Reproducibility

- **Pin dependencies:** Use a lockfile (e.g., `requirements.txt` or `poetry.lock`) to pin Pydantic AI, LLM SDKs, and all dependencies. This ensures reproducible builds and easier debugging.
- **Document environment:** Capture Python version, OS, and key environment variables in your README or setup scripts. Use containers or virtual environments for consistency across dev, test, and prod.

**Bottom line:**
Treat LLM-powered systems as production software: test deeply, instrument for visibility, version your prompts and schemas, protect sensitive data, and lock down your dependencies. This is how you build reliable, scalable, and debuggable AI applications.
