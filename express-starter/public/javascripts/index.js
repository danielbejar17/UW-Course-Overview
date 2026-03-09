// index.js — Course browser
// Fetches courses from GET /api/courses and renders them.

const API = '/api/courses';

let allCourses = [];
let activeDept = 'all';

// ── Fetch courses from the backend ────────────────────────────────────────────
async function loadCourses() {
  const statusMsg = document.getElementById('statusMsg');

  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    allCourses = await res.json();
    statusMsg.textContent = '';
    renderCourses();
  } catch (err) {
    statusMsg.textContent = `Could not load courses. Is the server running? (${err.message})`;
    console.error(err);
  }
}

// ── Render filtered list ──────────────────────────────────────────────────────
function renderCourses() {
  const query      = document.getElementById('searchInput').value.toLowerCase();
  const courseGrid = document.getElementById('courseGrid');

  const filtered = allCourses.filter((c) => {
    const matchDept   = activeDept === 'all' || c.department === activeDept;
    const matchSearch = !query ||
      `${c.department} ${c.courseNumber} ${c.title}`.toLowerCase().includes(query);
    return matchDept && matchSearch;
  });

  if (filtered.length === 0) {
    courseGrid.innerHTML = '<p>No courses match your search.</p>';
    return;
  }

  courseGrid.innerHTML = '<ul>' + filtered.map((c) => `
    <li>
      <h3><a href="course.html?id=${c._id}">${c.department} ${c.courseNumber}: ${c.title}</a></h3>
      <p>${c.department} &mdash; ${c.credits} credit${c.credits === 1 ? '' : 's'}</p>
      <p>${c.description || ''}</p>
      <p>Rating: ${stars(c.avgOverall)} ${c.avgOverall ? c.avgOverall.toFixed(1) + '/5' : 'N/A'} &mdash; ${c.reviewCount ?? 0} review${(c.reviewCount ?? 0) === 1 ? '' : 's'}</p>
    </li>
  `).join('') + '</ul>';
}

// ── Department filter ─────────────────────────────────────────────────────────
function setDept(btn, dept) {
  activeDept = dept;
  document.querySelectorAll('.dept-filter button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCourses();
}

// ── Search input handler ──────────────────────────────────────────────────────
function filterCourses() {
  renderCourses();
}

// ── Star string helper ────────────────────────────────────────────────────────
function stars(val) {
  if (!val) return '☆☆☆☆☆';
  const full  = Math.round(val);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadCourses();
