// ===== APP.JS — Book Classification Page =====
(function() {
  'use strict';

  const D = LIBRARY_DATA;
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  // ===== INIT =====
  document.addEventListener('DOMContentLoaded', () => {
    renderCollections();
    renderDDC();
    renderSubjects();
    renderKeywords();
    bindTabs();
    bindSearch();
    bindCloseResults();
  });

  // ===== TAB NAVIGATION =====
  function bindTabs() {
    $$('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const view = tab.dataset.view;
        $$('.view').forEach(v => v.classList.remove('active'));
        $(`#view-${view}`).classList.add('active');
        hideResults();
      });
    });
  }

  // ===== COLLECTIONS =====
  function renderCollections() {
    const grid = $('#collectionsGrid');
    grid.innerHTML = D.collections.map(c => `
      <div class="collection-card" style="--card-accent:${c.color}" data-filter="coll" data-value="${c.code}">
        <div class="card-icon">${c.icon}</div>
        <div class="card-code">${c.code}</div>
        <div class="card-name">${c.name}</div>
        <div class="card-count">${c.count.toLocaleString()}<span>tài liệu</span></div>
        <div class="card-loan">Thời hạn mượn: <strong>${c.loan} ngày</strong></div>
        <p style="font-size:0.82rem;color:var(--text-dim);margin-top:8px">${c.desc}</p>
      </div>
    `).join('');

    grid.querySelectorAll('.collection-card').forEach(card => {
      card.addEventListener('click', () => {
        const code = card.dataset.value;
        const coll = D.collections.find(c => c.code === code);
        const books = D.books.filter(b => b.coll === code);
        showResults(`${coll.icon} ${coll.name} (${coll.code})`, books, `Bộ sưu tập: ${coll.name}`);
      });
    });
  }

  // ===== DDC =====
  function renderDDC() {
    const container = $('#ddcContainer');
    const maxCount = Math.max(...D.ddc.map(d => d.count));

    container.innerHTML = D.ddc.map(d => {
      const pct = Math.round((d.count / maxCount) * 100);
      return `
        <div class="ddc-row" data-filter="ddc" data-value="${d.num}" style="--ddc-color:${d.color}">
          <div class="ddc-num">${d.num}</div>
          <div style="flex:1">
            <div class="ddc-name">${d.name}</div>
            <div class="ddc-name-vi">${d.nameVi}</div>
          </div>
          <div class="ddc-bar-wrap">
            <div class="ddc-bar" style="width:${pct}%;background:${d.color}"></div>
          </div>
          <div class="ddc-count">${d.count}</div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.ddc-row').forEach(row => {
      row.addEventListener('click', () => {
        const num = row.dataset.value;
        const ddc = D.ddc.find(d => d.num === num);
        const books = D.books.filter(b => b.ddc && b.ddc.startsWith(num.charAt(0)));
        showResults(`🔢 DDC ${ddc.num} — ${ddc.name}`, books, ddc.nameVi);
      });
    });
  }

  // ===== SUBJECTS =====
  function renderSubjects() {
    const container = $('#subjectsContainer');
    const grouped = {};
    D.subjects.forEach(s => {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s);
    });

    let html = '';
    for (const [cat, items] of Object.entries(grouped)) {
      html += `<div style="grid-column:1/-1;margin-top:16px;margin-bottom:4px">
        <h3 style="font-size:0.85rem;text-transform:uppercase;letter-spacing:2px;color:var(--text-dim);font-weight:600">${cat}</h3>
      </div>`;
      items.forEach(s => {
        html += `
          <div class="subject-card" data-filter="subject" data-value="${s.name}">
            <div class="subject-icon">${s.icon}</div>
            <div class="subject-info">
              <div class="subject-name">${s.name}</div>
              <div class="subject-meta">${s.count} tài liệu${s.grades ? ' • Lớp ' + s.grades : ''}</div>
            </div>
          </div>
        `;
      });
    }
    container.innerHTML = html;

    container.querySelectorAll('.subject-card').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.value;
        const subj = D.subjects.find(s => s.name === name);
        const books = D.books.filter(b => b.subject === name || b.title.includes(name));
        showResults(`${subj.icon} ${subj.name}`, books, `${subj.count} tài liệu`);
      });
    });
  }

  // ===== KEYWORDS =====
  function renderKeywords() {
    const cloud = $('#tagCloud');
    const shuffled = [...D.keywords].sort(() => Math.random() - 0.5);

    cloud.innerHTML = shuffled.map(k => {
      const sizeClass = k.weight >= 5 ? 'size-lg' : k.weight >= 3 ? 'size-md' : '';
      return `<span class="tag ${sizeClass}" data-word="${k.word}">${k.word}</span>`;
    }).join('');

    cloud.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const word = tag.dataset.word;
        const books = D.books.filter(b =>
          b.title.toLowerCase().includes(word.toLowerCase()) ||
          b.subject.toLowerCase().includes(word.toLowerCase()) ||
          b.author.toLowerCase().includes(word.toLowerCase())
        );
        showResults(`🏷️ "${word}"`, books, `Kết quả tìm kiếm từ khoá`);
      });
    });
  }

  // ===== SEARCH =====
  function bindSearch() {
    const input = $('#globalSearch');
    const clearBtn = $('#clearSearch');
    let debounce;

    input.addEventListener('input', () => {
      clearBtn.style.display = input.value ? 'block' : 'none';
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        if (input.value.trim().length >= 2) {
          doSearch(input.value.trim());
        } else {
          hideResults();
        }
      }, 300);
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      hideResults();
      input.focus();
    });
  }

  function doSearch(query) {
    const q = query.toLowerCase();
    const results = D.books.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.subject.toLowerCase().includes(q) ||
      b.ddc.includes(q) ||
      b.coll.toLowerCase().includes(q)
    );

    // Also search subjects
    const matchedSubjects = D.subjects.filter(s => s.name.toLowerCase().includes(q));
    const matchedDDC = D.ddc.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.nameVi.toLowerCase().includes(q) ||
      d.num.startsWith(q)
    );

    // Add books from matched subjects
    matchedSubjects.forEach(s => {
      D.books.forEach(b => {
        if (b.subject === s.name && !results.includes(b)) results.push(b);
      });
    });

    showResults(`🔍 Kết quả cho "${query}"`, results, `${results.length} tài liệu tìm thấy`);
  }

  // ===== RESULTS PANEL =====
  function showResults(title, books, subtitle) {
    const panel = $('#resultsPanel');
    const titleEl = $('#resultsTitle');
    const list = $('#resultsList');

    titleEl.innerHTML = `${title} <span style="font-size:0.85rem;color:var(--text-dim);font-weight:400;margin-left:8px">${subtitle || ''}</span>`;

    if (books.length === 0) {
      list.innerHTML = `
        <div class="no-results">
          <p style="font-size:1.5rem;margin-bottom:8px">📭</p>
          <p>Chưa có dữ liệu mẫu cho mục này.</p>
          <p style="margin-top:4px;font-size:0.82rem">Tra cứu trực tiếp tại
            <a href="https://tvthptduongdong.vsl.vn/lms/opac/index.php" target="_blank" style="color:var(--accent)">OPAC Thư Viện</a>
          </p>
        </div>
      `;
    } else {
      list.innerHTML = books.map((b, i) => {
        const collInfo = D.collections.find(c => c.code === b.coll);
        return `
          <div class="result-item">
            <div class="result-num">${i + 1}</div>
            <div class="result-info">
              <div class="result-title">${highlightMatch(b.title)}</div>
              <div class="result-meta">
                <span>✍️ ${b.author}</span>
                <span>📂 ${collInfo ? collInfo.name : b.coll}</span>
                <span>📖 ${b.subject}</span>
              </div>
            </div>
            <div class="result-ddc">DDC ${b.ddc}</div>
          </div>
        `;
      }).join('');
    }

    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideResults() {
    $('#resultsPanel').style.display = 'none';
  }

  function bindCloseResults() {
    $('#closeResults').addEventListener('click', hideResults);
  }

  function highlightMatch(text) {
    const q = ($('#globalSearch').value || '').trim();
    if (!q) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background:var(--accent);color:#fff;padding:0 2px;border-radius:3px">$1</mark>');
  }

})();
