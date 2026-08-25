const form = document.getElementById('feedbackForm');
const recordsList = document.getElementById('recordsList');
const STORAGE_KEY = 'foundersToolkitRecords';
const STAKEHOLDER_STORAGE_KEY = 'stakeholderTrackerRecords';

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// Tab Switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const tabName = button.getAttribute('data-tab');

    // Remove active class from all buttons and contents
    tabButtons.forEach((btn) => btn.classList.remove('active'));
    tabContents.forEach((content) => content.classList.remove('active'));

    // Add active class to clicked button and corresponding content
    button.classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
  });
});

// Feedback Form functionality
const getSavedRecords = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error('Unable to read saved records.', error);
    return [];
  }
};

const saveRecords = (records) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const renderRecords = (records) => {
  if (!records.length) {
    recordsList.classList.add('empty-state');
    recordsList.innerHTML = '<p>No saved records yet.</p>';
    return;
  }

  recordsList.classList.remove('empty-state');
  recordsList.innerHTML = records
    .map(
      (record, index) => `
        <article class="saved-record">
          <div class="record-header">
            <h3>Record ${records.length - index}</h3>
          </div>

          <div class="saved-section">
            <h4>Problem</h4>
            <p>${escapeHtml(record.problem)}</p>
          </div>

          <div class="saved-section">
            <h4>Stakeholder 1</h4>
            <p><strong>Does this problem resonate with them?</strong><br>${escapeHtml(record.stakeholder1.resonate)}</p>
            <p><strong>What aspects do they think matter most?</strong><br>${escapeHtml(record.stakeholder1.matter)}</p>
            <p><strong>What questions or concerns come to mind?</strong><br>${escapeHtml(record.stakeholder1.questions)}</p>
            <p><strong>What are you missing about this problem?</strong><br>${escapeHtml(record.stakeholder1.missing)}</p>
          </div>

          <div class="saved-section">
            <h4>Stakeholder 2</h4>
            <p><strong>Does this problem resonate with them?</strong><br>${escapeHtml(record.stakeholder2.resonate)}</p>
            <p><strong>What aspects do they think matter most?</strong><br>${escapeHtml(record.stakeholder2.matter)}</p>
            <p><strong>What questions or concerns come to mind?</strong><br>${escapeHtml(record.stakeholder2.questions)}</p>
            <p><strong>What are you missing about this problem?</strong><br>${escapeHtml(record.stakeholder2.missing)}</p>
          </div>
        </article>
      `
    )
    .join('');
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

  const record = {
    problem,
    stakeholder1,
    stakeholder2,
  };

  const existingRecords = getSavedRecords();
  const updatedRecords = [record, ...existingRecords];
  saveRecords(updatedRecords);
  renderRecords(updatedRecords);
  form.reset();
});

renderRecords(getSavedRecords());

// Stakeholder Tracker functionality
const stakeholderForm = document.getElementById('stakeholderForm');
const stakeholdersList = document.getElementById('stakeholdersList');

const getSavedStakeholders = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STAKEHOLDER_STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error('Unable to read stakeholder records.', error);
    return [];
  }
};

const saveStakeholders = (records) => {
  localStorage.setItem(STAKEHOLDER_STORAGE_KEY, JSON.stringify(records));
};

const renderStakeholders = (stakeholders) => {
  const table = stakeholdersList.querySelector('table');
  const tbody = table.querySelector('tbody');

  if (!stakeholders.length) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="3">No stakeholder records yet.</td></tr>';
    return;
  }

  tbody.innerHTML = stakeholders
    .map(
      (record) => `
        <tr>
          <td>${escapeHtml(record.name)}</td>
          <td><strong>${escapeHtml(record.type)}</strong></td>
          <td>${escapeHtml(record.feedback)}</td>
        </tr>
      `
    )
    .join('');
};

const showSuccessMessage = () => {
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.textContent = 'Stakeholder record added successfully!';

  stakeholderForm.parentElement.insertBefore(successMsg, stakeholderForm);

  setTimeout(() => {
    successMsg.remove();
  }, 3000);
};

stakeholderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('stakeholderName').value.trim();
  const type = document.getElementById('stakeholderType').value;
  const feedback = document.getElementById('stakeholderFeedback').value.trim();

  if (!name || !type || !feedback) {
    alert('Please fill in all fields.');
    return;
  }

  const record = {
    name,
    type,
    feedback,
  };

  const existingStakeholders = getSavedStakeholders();
  const updatedStakeholders = [record, ...existingStakeholders];
  saveStakeholders(updatedStakeholders);
  renderStakeholders(updatedStakeholders);

  showSuccessMessage();
  stakeholderForm.reset();
});

renderStakeholders(getSavedStakeholders());

// Feedback Analyzer functionality
const FEEDBACK_ANALYZER_PROBLEM_KEY = 'feedbackAnalyzerProblem';
const feedbackAnalyzerProblemInput = document.getElementById('feedbackAnalyzerProblem');
const feedbackAnalyzerOutput = document.getElementById('feedbackAnalyzerOutput');
const saveFeedbackProblemButton = document.getElementById('saveFeedbackProblemButton');
const analyzeAllFeedbackButton = document.getElementById('analyzeAllFeedbackButton');

const loadSavedFeedbackAnalyzerProblem = () => {
  const savedProblem = localStorage.getItem(FEEDBACK_ANALYZER_PROBLEM_KEY) || '';
  if (feedbackAnalyzerProblemInput) {
    feedbackAnalyzerProblemInput.value = savedProblem;
  }
  return savedProblem;
};

const saveFeedbackAnalyzerProblem = () => {
  if (!feedbackAnalyzerProblemInput) {
    return;
  }

  const problem = feedbackAnalyzerProblemInput.value.trim();

  if (!problem) {
    alert('Please enter a problem before saving.');
    return;
  }

  localStorage.setItem(FEEDBACK_ANALYZER_PROBLEM_KEY, problem);
  feedbackAnalyzerOutput.textContent = 'Problem saved locally.';
};

const collectFeedbackAnalyzerContext = () => {
  const problem = (localStorage.getItem(FEEDBACK_ANALYZER_PROBLEM_KEY) || feedbackAnalyzerProblemInput?.value || '').trim();

  const founderRecords = getSavedRecords().map((record) => ({
    source: 'Founders Toolkit',
    problem: record.problem,
    stakeholder1: record.stakeholder1,
    stakeholder2: record.stakeholder2,
  }));

  const stakeholderRecords = getSavedStakeholders().map((record) => ({
    source: 'Stakeholder Tracker',
    name: record.name,
    type: record.type,
    feedback: record.feedback,
  }));

  return {
    problem,
    feedbackRecords: [...founderRecords, ...stakeholderRecords],
  };
};

saveFeedbackProblemButton.addEventListener('click', saveFeedbackAnalyzerProblem);

analyzeAllFeedbackButton.addEventListener('click', async () => {
  const { problem, feedbackRecords } = collectFeedbackAnalyzerContext();

  if (!problem) {
    alert('Please save or enter a problem before analyzing.');
    return;
  }

  feedbackAnalyzerOutput.innerHTML = '<p>Analyzing feedback...</p>';

  try {
    const response = await fetch('/api/analyze-feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ problem, feedbackRecords }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Unable to analyze feedback.');
    }

    feedbackAnalyzerOutput.innerHTML = `<pre>${escapeHtml(result.analysis || 'No analysis returned.')}</pre>`;
  } catch (error) {
    console.error('Feedback analysis failed:', error);
    feedbackAnalyzerOutput.textContent = error.message || 'There was an error analyzing the feedback.';
  }
});

loadSavedFeedbackAnalyzerProblem();
