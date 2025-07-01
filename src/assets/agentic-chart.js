// Register Chart.js datalabels plugin
Chart.register(ChartDataLabels);


const frameworks = [
  {
    name: "Pydantic AI",
    link: "https://github.com/pydantic-ai/pydantic-ai",
    description: "Pydantic AI: framework for building agentic applications with Pydantic, focused on type safety and developer experience.",
    review: { fit: 8.5, maturity: 8, "assessment-date": "2025-07-01" }
  },
  {
    name: "Google ADK",
    link: "https://github.com/google/adk",
    description: "Google's Agent Development Kit: production-grade, multi-agent, model-agnostic, code-first, rapidly evolving.",
    review: { fit: 5, maturity: 3, "assessment-date": "2025-07-01" }
  },
  {
    name: "LangGraph (LangChain)",
    link: "https://github.com/langchain-ai/langgraph",
    description: "LangGraph: expressive, graph-based agent orchestration for complex, stateful, multi-agent workflows.",
    review: { fit: 5, maturity: 8, "assessment-date": "2025-07-01" }
  },
  {
    name: "BeeAI Framework",
    link: "https://github.com/i-am-bee/beeai-framework",
    description: "BeeAI: multi-agent, Python/TypeScript, production-ready, highly flexible, open-source.",
    review: { fit: 5.5, maturity: 7.5, "assessment-date": "2025-07-01" }
  },
  {
    name: "CrewAI",
    link: "https://github.com/joaomdmoura/crewAI",
    description: "CrewAI: role-based, collaborative multi-agent framework for workflow composition and agent specialization.",
    review: { fit: 4, maturity: 7, "assessment-date": "2025-07-01" }
  },
  {
    name: "OpenAI Agents SDK",
    link: "https://github.com/openai/swarm",
    description: "OpenAI Agents SDK: lightweight, ergonomic, production-ready for multi-agent orchestration (formerly Swarm).",
    review: { fit: 4, maturity: 7.5, "assessment-date": "2025-07-01" }
  },
  {
    name: "SmolAgents (Hugging Face)",
    link: "https://github.com/huggingface/smolagents",
    description: "SmolAgents: minimalist, code-first, code-executing agents, efficient and open-source.",
    review: { fit: 8, maturity: 6.5, "assessment-date": "2025-07-01" }
  },
  {
    name: "AutoGen (Microsoft)",
    link: "https://github.com/microsoft/autogen",
    description: "AutoGen: multi-agent, LLM-powered conversations and workflows, strong on agent-to-agent communication.",
    review: { fit: 3, maturity: 7, "assessment-date": "2025-07-01" }
  },
  {
    name: "Agent Zero",
    link: "https://aiagentstore.ai/ai-agent/agent-zero",
    description: "Agent Zero: open-source, highly customizable, supports dynamic, interactive, and multi-agent systems.",
    review: { fit: 3, maturity: 3, "assessment-date": "2025-07-01" }
  },
  {
    name: "MetaGPT",
    link: "https://github.com/geekan/MetaGPT",
    description: "MetaGPT: multi-agent, collaborative software engineering and automation, role-based agent teams.",
    review: { fit: 1, maturity: 4, "assessment-date": "2025-07-01" }
  },
  {
    name: "Haystack Agents",
    link: "https://github.com/deepset-ai/haystack",
    description: "Haystack Agents: agentic pipelines for search, retrieval, and reasoning, strong LLM and knowledge base integration.",
    review: { fit: 6.5, maturity: 7, "assessment-date": "2025-07-01" }
  }
];


document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('agentic-ratings').getContext('2d');

  // Four-quadrant background plugin
  const quadrantBackground = {
    id: 'quadrantBackground',
    beforeDraw: (chart) => {
      const {ctx, chartArea, scales} = chart;
      if (!chartArea) return;
      const xMid = scales.x.getPixelForValue(5);
      const yMid = scales.y.getPixelForValue(5);
      // Quadrant colors
      const colors = [
        'rgba(205, 255, 205, 0.4)', // Q1 (top-right)
        'rgba(205, 235, 255, 0.4)', // Q2 (top-left)
        'rgba(255, 205, 205, 0.4)', // Q3 (bottom-left)
        'rgba(255, 235, 205, 0.4)'  // Q4 (bottom-right)
      ];
      // Q1: top-right
      ctx.save();
      ctx.fillStyle = colors[0];
      ctx.fillRect(xMid, chartArea.top, chartArea.right - xMid, yMid - chartArea.top);
      
      // Q2: top-left
      ctx.fillStyle = colors[1];
      ctx.fillRect(chartArea.left, chartArea.top, xMid - chartArea.left, yMid - chartArea.top);
      
      // Q3: bottom-left
      ctx.fillStyle = colors[2];
      ctx.fillRect(chartArea.left, yMid, xMid - chartArea.left, chartArea.bottom - yMid);
      
      // Q4: bottom-right
      ctx.fillStyle = colors[3];
      ctx.fillRect(xMid, yMid, chartArea.right - xMid, chartArea.bottom - yMid);
      ctx.restore();

      // Draw quadrant labels
      ctx.save();
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#333';
      
      // Q1 (top-right)
      ctx.fillText('Adopt', xMid + (chartArea.right - xMid) / 2, chartArea.top + (yMid - chartArea.top) / 2);
      // Q2 (top-left)
      ctx.fillText('Maintain', chartArea.left + (xMid - chartArea.left) / 2, chartArea.top + (yMid - chartArea.top) / 2);
      // Q3 (bottom-left)
      ctx.fillText('Avoid', chartArea.left + (xMid - chartArea.left) / 2, yMid + (chartArea.bottom - yMid) / 2);
      // Q4 (bottom-right)
      ctx.fillText('Investigate', xMid + (chartArea.right - xMid) / 2, yMid + (chartArea.bottom - yMid) / 2);
      ctx.restore();
    }
  };

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: frameworks.map(fw => ({
        label: fw.name,
        data: [{ x: fw.review.fit, y: fw.review.maturity }],
        backgroundColor: 'rgba(75, 192, 192, 1)'
      }))
    },
    options: {
      responsive: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          callbacks: {
            title: function(context) {
              // Show the framework name as the tooltip title
              return context[0].dataset.label;
            },
            label: function(context) {
              // Show the description as the tooltip body
              const fw = frameworks[context.datasetIndex];
              return fw.description;
            }
          }
        },
        datalabels: {
          align: 'top',
          anchor: 'end',
          display: true,
          formatter: function(value, context) {
            return context.dataset.label;
          }
        }
      },
      hover: {
        mode: null
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Fit'
          },
          type: 'linear',
          position: 'bottom',
          min: 0,
          max: 10
        },
        y: {
          title: {
            display: true,
            text: 'Maturity'
          },
          min: 0,
          max: 10
        }
      }
    },
    plugins: [quadrantBackground]
  });
});
