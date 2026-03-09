// course.js — Course detail page
// Reads ?id= from the URL, fetches course + reviews from backend.

const params   = new URLSearchParams(window.location.search);
const courseId = params.get('id');

// ── Star string helper ────────────────────────────────────────────────────────
function stars(val) {
  if (!val) return '&mdash;';
  const full = Math.round(val);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

function fmt(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ── Load course info ──────────────────────────────────────────────────────────
async function loadCourse() {
  if (!courseId) {
    document.getElementById('courseHeader').innerHTML =
      '<p>No course selected. <a href="index.html">Browse courses &rarr;</a></p>';
    return;
  }

  try {
    const res    = await fetch(`/api/courses/${courseId}`);
    if (!res.ok) throw new Error(`${res.status}`);
    const course = await res.json();

    document.title = `${course.department} ${course.courseNumber} \u2014 UW Course Overview`;

    document.getElementById('courseHeader').innerHTML = `
      <p>${course.department} &mdash; ${course.credits} credit${course.credits === 1 ? '' : 's'}</p>
      <h1>${course.department} ${course.courseNumber}: ${course.title}</h1>
      <p>${course.description || ''}</p>
    `;

    const ratings = course.ratings || {};
    document.getElementById('sdDept').textContent       = course.department;
    document.getElementById('sdNumber').textContent     = course.courseNumber;
    document.getElementById('sdCredits').textContent    = course.credits;
    document.getElementById('sdDifficulty').textContent = ratings.avgDifficulty ? ratings.avgDifficulty.toFixed(1) + '/5' : 'N/A';
    document.getElementById('sdWorkload').textContent   = ratings.avgWorkload   ? ratings.avgWorkload.toFixed(1)   + '/5' : 'N/A';
    document.getElementById('sdOverall').textContent    = ratings.avgOverall    ? ratings.avgOverall.toFixed(1)    + '/5' : 'N/A';
    document.getElementById('courseSidebar').style.display = '';

  } catch (err) {
    document.getElementById('courseHeader').innerHTML =
      `<p>Could not load course. (${err.message})</p>`;
    console.error(err);
  }
}

// ── Load reviews ──────────────────────────────────────────────────────────────
async function loadReviews() {
  if (!courseId) return;

  const reviewStatus = document.getElementById('reviewStatus');
  const reviewsList  = document.getElementById('reviewsList');

  try {
    const res     = await fetch(`/api/courses/${courseId}/reviews`);
    if (!res.ok) throw new Error(`${res.status}`);
    const reviews = await res.json();

    reviewStatus.textContent = '';

    if (reviews.length === 0) {
      reviewsList.innerHTML = '<p>No reviews yet for this course.</p>';
      return;
    }

    reviewsList.innerHTML = '<ul>' + reviews.map((r) => `
      <li>
        <p>
          <strong>@${r.userID || 'Anonymous'}</strong> &mdash; ${fmt(r.createdAt)}
        </p>
        <p>
          Overall: ${stars(r.overallRating)} ${r.overallRating}/5 &nbsp;|&nbsp;
          Difficulty: ${r.difficultyRating}/5 &nbsp;|&nbsp;
          Workload: ${r.workloadRating}/5
        </p>
        <p>${r.reviewText}</p>
      </li>
    `).join('') + '</ul>';

  } catch (err) {
    reviewStatus.textContent = `Could not load reviews. (${err.message})`;
    console.error(err);
  }
}

// ── Submit review ─────────────────────────────────────────────────────────────
async function submitReview(event) {
  event.preventDefault();

  if (!courseId) return;

  const status = document.getElementById('reviewFormStatus');
  status.textContent = 'Submitting…';

  const body = {
    username:         document.getElementById('rfUsername').value.trim() || 'Anonymous',
    overallRating:    Number(document.getElementById('rfOverall').value),
    difficultyRating: Number(document.getElementById('rfDifficulty').value),
    workloadRating:   Number(document.getElementById('rfWorkload').value),
    reviewText:       document.getElementById('rfText').value.trim(),
  };

  try {
    const res = await fetch(`/api/courses/${courseId}/reviews`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });

    if (!res.ok) throw new Error(`${res.status}`);

    status.textContent = 'Review submitted!';
    document.getElementById('reviewForm').reset();
    await loadReviews();
  } catch (err) {
    status.textContent = `Failed to submit review. (${err.message})`;
    console.error(err);
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadCourse();
loadReviews();
