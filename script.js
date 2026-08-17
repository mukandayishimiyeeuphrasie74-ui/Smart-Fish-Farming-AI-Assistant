const form = document.getElementById('feedbackForm');
const outputArea = document.getElementById('outputArea');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const renderOutput = (problem, stakeholder1, stakeholder2) => {
  outputArea.classList.remove('empty-state');
  outputArea.innerHTML = `
    <div class="saved-section">
      <h3>Problem</h3>
      <p>${escapeHtml(problem)}</p>
    </div>

    <div class="saved-section">
      <h3>Stakeholder 1</h3>
      <p><strong>Does this problem resonate with them?</strong><br>${escapeHtml(stakeholder1.resonate)}</p>
      <p><strong>What aspects do they think matter most?</strong><br>${escapeHtml(stakeholder1.matter)}</p>
      <p><strong>What questions or concerns come to mind?</strong><br>${escapeHtml(stakeholder1.questions)}</p>
      <p><strong>What are you missing about this problem?</strong><br>${escapeHtml(stakeholder1.missing)}</p>
    </div>

    <div class="saved-section">
      <h3>Stakeholder 2</h3>
      <p><strong>Does this problem resonate with them?</strong><br>${escapeHtml(stakeholder2.resonate)}</p>
      <p><strong>What aspects do they think matter most?</strong><br>${escapeHtml(stakeholder2.matter)}</p>
      <p><strong>What questions or concerns come to mind?</strong><br>${escapeHtml(stakeholder2.questions)}</p>
      <p><strong>What are you missing about this problem?</strong><br>${escapeHtml(stakeholder2.missing)}</p>
    </div>
  `;
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const problem = document.getElementById('problem').value.trim();
  const stakeholder1 = {
    resonate: document.getElementById('stakeholder1Resonate').value.trim(),
    matter: document.getElementById('stakeholder1Matter').value.trim(),
    questions: document.getElementById('stakeholder1Questions').value.trim(),
    missing: document.getElementById('stakeholder1Missing').value.trim(),
  };
  const stakeholder2 = {
    resonate: document.getElementById('stakeholder2Resonate').value.trim(),
    matter: document.getElementById('stakeholder2Matter').value.trim(),
    questions: document.getElementById('stakeholder2Questions').value.trim(),
    missing: document.getElementById('stakeholder2Missing').value.trim(),
  };

  const allFieldsFilled = problem && Object.values(stakeholder1).every(Boolean) && Object.values(stakeholder2).every(Boolean);

  if (!allFieldsFilled) {
    alert('Please fill in the problem and all feedback fields for both stakeholders before saving.');
    return;
  }

  renderOutput(problem, stakeholder1, stakeholder2);
  localStorage.setItem('foundersToolkitData', JSON.stringify({ problem, stakeholder1, stakeholder2 }));
});

const savedData = localStorage.getItem('foundersToolkitData');
if (savedData) {
  try {
    const parsed = JSON.parse(savedData);
    renderOutput(parsed.problem, parsed.stakeholder1, parsed.stakeholder2);
  } catch (error) {
    console.error('Unable to restore saved problem and feedback.', error);
  }
}
