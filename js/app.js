let currentStep = 1;
let record = {};
let processSteps = [];

/* ---------- NAVIGATION ---------- */

function hideAll() {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("form-section").classList.add("hidden");
  document.getElementById("records-section").classList.add("hidden");
  document.getElementById("map-section").classList.add("hidden");
}

function goHome() {
  hideAll();
  document.getElementById("home").classList.remove("hidden");
}

function startNew() {
  hideAll();
  document.getElementById("form-section").classList.remove("hidden");

  record = {
    uuid: generateUUID(),
    created_at: new Date().toISOString(),
    geo: {},
    craft: {},
    practitioner: {},
    ontology: {},
    materials: [],
    process_steps: [],
    consent: {}
  };

  processSteps = [];
  currentStep = 1;
  captureGeo();
  renderStep();
}

/* ---------- GEO ---------- */

function captureGeo() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      record.geo = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };
    });
  }
}

/* ---------- ONTOLOGY ---------- */

const ontologyOptions = {
  domain: ["Textile", "Ceramic", "Metal", "Wood", "Natural Fiber"],
  function: ["Ritual", "Domestic", "Commercial", "Export"],
  transmission: ["Familial", "Apprenticeship", "Guild", "Informal"]
};

/* ---------- WIZARD ---------- */

function renderStep() {

  document.getElementById("step-indicator").innerText =
    `Step ${currentStep} of 6`;

  const content = document.getElementById("step-content");

  if (currentStep === 1) {
    content.innerHTML = `
      <h2>Craft Identification</h2>
      <input id="craft_name" placeholder="Craft Name"/>
      <select id="domain">${ontologyOptions.domain.map(d=>`<option>${d}</option>`)}</select>
      <select id="function">${ontologyOptions.function.map(f=>`<option>${f}</option>`)}</select>
    `;
  }

  if (currentStep === 2) {
    content.innerHTML = `
      <h2>Practitioner</h2>
      <input id="practitioner" placeholder="Name"/>
      <input id="community" placeholder="Community"/>
      <select id="transmission">${ontologyOptions.transmission.map(t=>`<option>${t}</option>`)}</select>
    `;
  }

  if (currentStep === 3) {
    content.innerHTML = `
      <h2>Materials</h2>
      <textarea id="materials"></textarea>
    `;
  }

  if (currentStep === 4) {
    content.innerHTML = `
      <h2>Process Steps</h2>
      <textarea id="step_desc"></textarea>
      <input type="file" id="step_img" accept="image/*" capture="environment"/>
      <button onclick="addProcessStep()">Add Step</button>
      <div id="step-list"></div>
    `;
    renderProcessList();
  }

  if (currentStep === 5) {
    content.innerHTML = `
      <h2>Consent</h2>
      <label>
        <input type="checkbox" id="consent_check">
        Verbal consent obtained
      </label>
      <canvas id="signature" width="300" height="100"></canvas>
      <button onclick="clearSignature()">Clear Signature</button>
    `;
    initSignature();
  }

  if (currentStep === 6) {
    content.innerHTML = `
      <h2>Finalize</h2>
      <p>Click Next to save record.</p>
    `;
  }
}

/* ---------- NEXT / BACK ---------- */

function nextStep() {

  if (currentStep === 1) {
    record.craft = { name: document.getElementById("craft_name").value };
    record.ontology.domain = document.getElementById("domain").value;
    record.ontology.function = document.getElementById("function").value;
  }

  if (currentStep === 2) {
    record.practitioner = {
      name: document.getElementById("practitioner").value,
      community: document.getElementById("community").value,
      transmission: document.getElementById("transmission").value
    };
  }

  if (currentStep === 3) {
    record.materials =
      document.getElementById("materials").value.split(",");
  }

  if (currentStep === 4) {
    record.process_steps = processSteps;
  }

  if (currentStep === 5) {
    record.consent = {
      given: document.getElementById("consent_check").checked,
      signature: document.getElementById("signature").toDataURL()
    };
  }

  if (currentStep === 6) {
    finalizeRecord();
    return;
  }

  currentStep++;
  renderStep();
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    renderStep();
  }
}
