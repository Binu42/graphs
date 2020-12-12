const graphs = document.getElementById("graphs");

fetch("./data.json")
  .then(response => {
    return response.json();
  })
  .then(data => {
    let projects = "";
    data.forEach(({ name, route, description }) => {
      projects += `<a href=${route} class="project">
        <div class="project-name">
          ${name}
        </div>
        <div class="project-description">
          ${description}
        </div>
      </a>`
    })
    graphs.innerHTML = projects;
  });