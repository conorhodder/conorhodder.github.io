document.addEventListener("DOMContentLoaded", function () {
    const article = document.querySelector("article");
    const toc = document.getElementById("toc");
    if (!article || !toc) return;
  
    const headers = article.querySelectorAll("h2, h3");
    if (headers.length === 0) return;
  
    let tocHTML = '<div class="toc-title">Table of Contents</div><ul class="toc-list">';
    
    headers.forEach(header => {
      if (!header.id) {
        header.id = header.textContent.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-]+/g, "");
      }
      const indent = header.tagName === "H3" ? " class='toc-indent'" : "";
      tocHTML += `<li${indent}><a href="#${header.id}">${header.textContent}</a></li>`;
    });
    tocHTML += "</ul>";
    toc.innerHTML = tocHTML;
  });