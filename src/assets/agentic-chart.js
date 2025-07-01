// Register Chart.js datalabels plugin
Chart.register(ChartDataLabels);


const frameworks = [
  {
    name: "Pydantic AI",
    link: "https://github.com/pydantic-ai/pydantic-ai",
    description: "Pydantic AI: framework for building agentic applications with Pydantic, focused on type safety and developer experience.",
    assessment: { fit: 8.5, maturity: 8, "assessment-date": "2025-07-01" },
    review: "/posts/reviews/pydanticai"
  },
  {
    name: "Google ADK",
    link: "https://github.com/google/adk",
    description: "Google's Agent Development Kit: production-grade, multi-agent, model-agnostic, code-first, rapidly evolving.",
    assessment: { fit: 7, maturity: 3, "assessment-date": "2025-07-01" }
  },
  {
    name: "LangGraph (LangChain)",
    link: "https://github.com/langchain-ai/langgraph",
    description: "LangGraph: expressive, graph-based agent orchestration for complex, stateful, multi-agent workflows.",
    assessment: { fit: 5, maturity: 8, "assessment-date": "2025-07-01" }
  },
  {
    name: "CrewAI",
    link: "https://github.com/joaomdmoura/crewAI",
    description: "CrewAI: role-based, collaborative multi-agent framework for workflow composition and agent specialization.",
    assessment: { fit: 4, maturity: 7, "assessment-date": "2025-07-01" }
  },
  {
    name: "OpenAI Agents SDK",
    link: "https://github.com/openai/swarm",
    description: "OpenAI Agents SDK: lightweight, ergonomic, production-ready for multi-agent orchestration (formerly Swarm).",
    assessment: { fit: 4, maturity: 7.5, "assessment-date": "2025-07-01" }
  },
  {
    name: "AutoGen (Microsoft)",
    link: "https://github.com/microsoft/autogen",
    description: "AutoGen: multi-agent, LLM-powered conversations and workflows, strong on agent-to-agent communication.",
    assessment: { fit: 3, maturity: 7, "assessment-date": "2025-07-01" }
  },
  {
    name: "Haystack Agents",
    link: "https://github.com/deepset-ai/haystack",
    description: "Haystack Agents: agentic pipelines for search, retrieval, and reasoning, strong LLM and knowledge base integration.",
    assessment: { fit: 6.5, maturity: 7, "assessment-date": "2025-07-01" }
  }
];


document.addEventListener('DOMContentLoaded', function () {
  populate_framework_list();
  add_chart();
});

function populate_framework_list() {
  const list = document.getElementById('framework-list');
  if (!list) return;
  list.innerHTML = '';


  const header = document.createElement('h3');
  header.textContent = 'Reviews';

  const reviewList = document.createElement('ul');

  frameworks.forEach(fw => {
    if (!fw.review) {
      return;
    }

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = fw.review;
    a.textContent = fw.name;
    a.target = '_blank';
    li.appendChild(a);
    reviewList.appendChild(li);
  });

  if (reviewList.children.length > 0) {
    list.appendChild(header);
    list.appendChild(reviewList);
  }
}

function add_chart() {
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

      // Draw quadrant labels at the outer edges
      ctx.save();
      ctx.font = 'bold 18px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      const margin = 12;
      
      // Q2 (top-left): Maintain
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('MAINTAIN', chartArea.left + margin, chartArea.top + margin);
      
      // Q1 (top-right): Adopt
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      ctx.fillText('ADOPT', chartArea.right - margin, chartArea.top + margin);
      
      // Q3 (bottom-left): Avoid
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText('AVOID', chartArea.left + margin, chartArea.bottom - margin);
      
      // Q4 (bottom-right): Watch
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('WATCH', chartArea.right - margin, chartArea.bottom - margin);
      ctx.restore();
    }
  };

  new Chart(ctx, {
    type: 'scatter',
    data: {
      datasets: frameworks.map(fw => ({
        label: fw.name,
        data: [{ x: fw.assessment.fit, y: fw.assessment.maturity }],
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
}
