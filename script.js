let chart;

// ----------------------------
// Import TXT file
function importFile(event){
  const file = event.target.files[0];
  if(!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  if(ext !== 'txt'){ alert("Only TXT files allowed!"); return; }

  const reader = new FileReader();
  reader.onload = e => saveRoadmap(file.name, e.target.result);
  reader.readAsText(file);
}

// ----------------------------
// Save roadmap to localStorage
function saveRoadmap(fileName, text){
  const steps = text.split('\n')
  .map(l => l.trim())
  .filter(l => {
    // Remove line if empty OR only special characters
    return l.length > 0 && /[a-zA-Z0-9]/.test(l);
  });

  const saved = JSON.parse(localStorage.getItem("roadmaps")||"{}");
  saved[fileName] = { steps: steps, progress: {} };
  localStorage.setItem("roadmaps", JSON.stringify(saved));
  displaySteps(fileName);
  alert(`✅ Loaded roadmap: ${fileName}`);
}

// ----------------------------
// Display roadmap steps
function displaySteps(fileName){
  const container = document.getElementById("roadmapContainer");
  container.innerHTML = "";
  const saved = JSON.parse(localStorage.getItem("roadmaps")||"{}");
  const roadmap = saved[fileName];
  if(!roadmap) return;

  roadmap.steps.forEach((step,index)=>{
    const div = document.createElement("div");
    const isHeading = step.trim().startsWith('#');

    if(isHeading){
      div.className = 'roadmap-heading';
      div.textContent = step.replace(/^#+\s*/, '');
    } else {
      div.className = 'roadmap-step';
      const completed = roadmap.progress[index] || false;
      if(completed) div.classList.add("step-complete");

      div.innerHTML = `
        <div class="task-row">
          <div>
            <input type="checkbox" id="${fileName}-step-${index}" ${completed?'checked':''} onchange="markComplete(this,'${fileName}',${index})"/>
            <label for="${fileName}-step-${index}">${step}</label>
          </div>
          <div class="date" id="date-${fileName}-${index}">${completed? 'Completed on: '+roadmap.progress[index]:''}</div>
        </div>
      `;
    }
    container.appendChild(div);
  });

  updateChart(fileName);
  showAnalytics(fileName);
  showRoadmaps();
}

// ----------------------------
// Mark task complete
function markComplete(checkbox,fileName,index){
  const saved = JSON.parse(localStorage.getItem("roadmaps")||"{}");
  const roadmap = saved[fileName];
  const div = checkbox.closest(".roadmap-step");
  const dateDiv = document.getElementById(`date-${fileName}-${index}`);

  if(checkbox.checked){
    div.classList.add("step-complete");
    const now = new Date().toLocaleString();
    dateDiv.textContent = `Completed on: ${now}`;
    roadmap.progress[index] = now;
  } else {
    div.classList.remove("step-complete");
    dateDiv.textContent = '';
    delete roadmap.progress[index];
  }

  localStorage.setItem("roadmaps", JSON.stringify(saved));
  updateChart(fileName);
  showAnalytics(fileName);
}

// ----------------------------
// Update progress chart
function updateChart(fileName){
  const saved = JSON.parse(localStorage.getItem("roadmaps")||"{}");
  const roadmap = saved[fileName];
  if(!roadmap) return;

  const total = roadmap.steps.filter(s=>!s.trim().startsWith('#')).length;
  const completed = Object.keys(roadmap.progress).length;

  const data = { labels:['Completed','Pending'], datasets:[{data:[completed,total-completed], backgroundColor:['#28a745','#dc3545']}]};
  const ctx = document.getElementById('progressChart').getContext('2d');

  if(chart) chart.destroy();
  chart = new Chart(ctx,{
    type:'pie',
    data:data,
    options:{
      responsive:true,
      plugins:{legend:{position:'bottom'}, title:{display:true,text:`Roadmap Progress: ${fileName}`}}
    }
  });
}

// ----------------------------
// Show analytics
function showAnalytics(fileName){
  const container = document.getElementById("analyticsContainer");
  const saved = JSON.parse(localStorage.getItem("roadmaps")||"{}");
  const roadmap = saved[fileName];
  if(!roadmap){ container.innerHTML=''; return; }

  const total = roadmap.steps.filter(s=>!s.trim().startsWith('#')).length;
  const completed = Object.keys(roadmap.progress).length;
  const pending = total - completed;

  container.innerHTML = `📊 Analytics:<br>Total Tasks: ${total}<br>✅ Completed: ${completed}<br>⏳ Pending: ${pending}`;
}

// ----------------------------
// Show saved roadmaps
function showRoadmaps(){
  const container = document.getElementById("roadmapSelector");
  container.innerHTML = '';
  const saved = JSON.parse(localStorage.getItem("roadmaps")||"{}");
  const files = Object.keys(saved);
  if(files.length===0){ container.innerHTML="<p style='color:gray;'>No saved roadmaps yet. Import a TXT file first.</p>"; return; }

  files.forEach(file=>{
    const btn = document.createElement("button");
    btn.textContent = file;
    btn.onclick = ()=>displaySteps(file);
    container.appendChild(btn);
  });
}

// ----------------------------
// Reset all roadmaps
function resetAll(){
  if(confirm("Are you sure you want to delete ALL roadmaps and progress?")){
    localStorage.removeItem("roadmaps");
    document.getElementById("roadmapContainer").innerHTML='';
    document.getElementById("roadmapSelector").innerHTML='';
    document.getElementById("analyticsContainer").innerHTML='';
    chart?.destroy();
  }
}

// ----------------------------
// Auto-load last roadmap
window.onload = function(){
  const saved = JSON.parse(localStorage.getItem("roadmaps")||"{}");
  const files = Object.keys(saved);
  if(files.length>0) displaySteps(files[0]);
  else document.getElementById("roadmapContainer").innerHTML="<p style='text-align:center;color:gray;'>📄 Import your roadmap.txt file to get started!</p>";
};

// ----------------------------
// Search filter
function filterTasks(){
  const query = document.getElementById("searchInput").value.toLowerCase();
  const container = document.getElementById("roadmapContainer");
  let lastHeading = null;

  Array.from(container.children).forEach(el => {
    if(el.classList.contains("roadmap-heading")){
      // heading initially hide
      el.style.display = 'none';
      lastHeading = el;
    } else if(el.classList.contains("roadmap-step")){
      const label = el.querySelector("label");
      const match = label.textContent.toLowerCase().includes(query);
      el.style.display = match ? 'flex' : 'none';
      
      // agar task match hua to show its heading
      if(match && lastHeading) lastHeading.style.display = 'block';
    }
  });
}
