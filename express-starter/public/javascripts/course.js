// course.js — Course detail page
// Reads ?id= from the URL, fetches course + reviews + threads from backend.

const params   = new URLSearchParams(window.location.search);
const courseId = params.get('id');

// ── Helpers ───────────────────────────────────────────────────────────────────

function stars(val) {
  if (!val) return '&mdash;';
  const full = Math.round(val);
  return '<span style="color:#aadb1e">' + '★'.repeat(full) + '☆'.repeat(5 - full) + '</span>';
}

function fmt(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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

    document.title = `${course.department} ${course.courseNumber} \u2014 Husky Hero`;

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

// ── Threads ───────────────────────────────────────────────────────────────────

let threads = []; // cached list so we can access title/body when expanding

async function loadThreads() {
  if (!courseId) return;

  const statusEl = document.getElementById('threadStatus');
  const listEl   = document.getElementById('threadsList');

  try {
    const res = await fetch(`/api/courses/${courseId}/threads`);
    if (!res.ok) throw new Error(`${res.status}`);
    threads = await res.json();

    if (threads.length === 0) {
      listEl.innerHTML = '<p class="threads-empty">No threads yet — start one below!</p>';
      return;
    }

    listEl.innerHTML = threads.map((t) => `
      <div class="thread-item" id="thread-${t._id}">
        <div class="thread-summary" onclick="toggleThread('${t._id}')">
          <span class="thread-title">${escHtml(t.title)}</span>
          <span class="thread-meta">
            by @${escHtml(t.createdBy)} &middot; ${fmt(t.createdAt)} &middot;
            <span id="thread-count-${t._id}">${t.commentCount} comment${t.commentCount === 1 ? '' : 's'}</span>
          </span>
        </div>
        <div class="thread-body" id="thread-body-${t._id}" style="display:none"></div>
      </div>
    `).join('');

  } catch (err) {
    if (statusEl) statusEl.textContent = `Could not load threads. (${err.message})`;
    console.error(err);
  }
}

async function toggleThread(threadId) {
  const bodyEl = document.getElementById(`thread-body-${threadId}`);
  if (!bodyEl) return;

  // Collapse if already open
  if (bodyEl.style.display !== 'none') {
    bodyEl.style.display = 'none';
    return;
  }

  bodyEl.style.display = '';
  bodyEl.innerHTML = '<p class="thread-loading">Loading&hellip;</p>';

  try {
    const thread   = threads.find((t) => t._id === threadId);
    const res      = await fetch(`/api/threads/${threadId}/comments`);
    if (!res.ok) throw new Error(`${res.status}`);
    const comments = await res.json();

    const tree = buildCommentTree(comments, null, 0);

    bodyEl.innerHTML = `
      <div class="thread-op">
        <p class="thread-op-text">${escHtml(thread ? thread.body : '')}</p>
      </div>
      <div class="comments-section">
        ${tree || '<p class="threads-empty">No comments yet.</p>'}
      </div>
      <div class="inline-comment-form" id="icf-${threadId}">
        <h4>Add a Comment</h4>
        <input type="text" id="icf-name-${threadId}" placeholder="Name (optional)" />
        <textarea id="icf-text-${threadId}" rows="3" placeholder="Write a comment&hellip;"></textarea>
        <div class="icf-actions">
          <button onclick="submitComment('${threadId}', null)">Comment</button>
          <span id="icf-status-${threadId}" class="icf-status"></span>
        </div>
      </div>
    `;
  } catch (err) {
    bodyEl.innerHTML = `<p class="thread-error">Could not load thread. (${err.message})</p>`;
    console.error(err);
  }
}

// Recursively build nested comment HTML (Reddit-style indentation)
function buildCommentTree(comments, parentId, depth) {
  if (depth > 8) return ''; // cap nesting depth
  const children = comments.filter((c) =>
    parentId === null ? !c.parentCommentID : c.parentCommentID === parentId
  );
  if (children.length === 0) return '';

  return children.map((c) => `
    <div class="comment" style="--depth:${depth}">
      <p class="comment-meta">
        <strong>@${escHtml(c.userID || 'Anonymous')}</strong> &middot; ${fmt(c.createdAt)}
      </p>
      <p class="comment-text">${escHtml(c.content || '')}</p>
      <button class="reply-btn" onclick="showReplyForm('${c.threadID}', '${c._id}')">Reply</button>
      <div class="reply-form-slot" id="reply-slot-${c._id}"></div>
      ${buildCommentTree(comments, c._id, depth + 1)}
    </div>
  `).join('');
}

function showReplyForm(threadId, parentCommentId) {
  const slot = document.getElementById(`reply-slot-${parentCommentId}`);
  if (!slot) return;

  // Toggle: close if already open
  if (slot.innerHTML.trim()) {
    slot.innerHTML = '';
    return;
  }

  slot.innerHTML = `
    <div class="inline-reply-form">
      <input type="text" id="rf-name-${parentCommentId}" placeholder="Name (optional)" />
      <textarea id="rf-text-${parentCommentId}" rows="2" placeholder="Write a reply&hellip;"></textarea>
      <div class="icf-actions">
        <button onclick="submitComment('${threadId}', '${parentCommentId}')">Reply</button>
        <button class="btn-cancel" onclick="document.getElementById('reply-slot-${parentCommentId}').innerHTML=''">Cancel</button>
        <span id="rf-status-${parentCommentId}" class="icf-status"></span>
      </div>
    </div>
  `;
}

async function submitComment(threadId, parentCommentId) {
  const nameId   = parentCommentId ? `rf-name-${parentCommentId}`   : `icf-name-${threadId}`;
  const textId   = parentCommentId ? `rf-text-${parentCommentId}`   : `icf-text-${threadId}`;
  const statusId = parentCommentId ? `rf-status-${parentCommentId}` : `icf-status-${threadId}`;

  const nameEl   = document.getElementById(nameId);
  const textEl   = document.getElementById(textId);
  const statusEl = document.getElementById(statusId);

  if (!textEl || !textEl.value.trim()) return;
  if (statusEl) statusEl.textContent = 'Posting…';

  try {
    const res = await fetch(`/api/threads/${threadId}/comments`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        content:         textEl.value.trim(),
        username:        nameEl ? (nameEl.value.trim() || 'Anonymous') : 'Anonymous',
        parentCommentID: parentCommentId || null,
      }),
    });
    if (!res.ok) throw new Error(`${res.status}`);

    // Refresh thread view and update count
    const bodyEl = document.getElementById(`thread-body-${threadId}`);
    if (bodyEl) bodyEl.style.display = 'none';
    await toggleThread(threadId);

    const t = threads.find((th) => th._id === threadId);
    if (t) {
      t.commentCount = (t.commentCount || 0) + 1;
      const countEl = document.getElementById(`thread-count-${threadId}`);
      if (countEl) countEl.textContent = `${t.commentCount} comment${t.commentCount === 1 ? '' : 's'}`;
    }
  } catch (err) {
    if (statusEl) statusEl.textContent = `Failed. (${err.message})`;
    console.error(err);
  }
}

async function submitThread(event) {
  event.preventDefault();
  if (!courseId) return;

  const statusEl = document.getElementById('threadFormStatus');
  statusEl.textContent = 'Posting…';

  const body = {
    title:    document.getElementById('tfTitle').value.trim(),
    body:     document.getElementById('tfBody').value.trim(),
    username: document.getElementById('tfUsername').value.trim() || 'Anonymous',
  };

  try {
    const res = await fetch(`/api/courses/${courseId}/threads`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${res.status}`);
    statusEl.textContent = 'Thread posted!';
    document.getElementById('threadForm').reset();
    await loadThreads();
  } catch (err) {
    statusEl.textContent = `Failed to post thread. (${err.message})`;
    console.error(err);
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
loadCourse();
loadReviews();
loadThreads();
