// ===== APP.JS — Trang Phân Loại Sách =====
// Kết nối trực tiếp với OPAC Thư Viện THPT Dương Đông
(function() {
  'use strict';
  const D = LIBRARY_DATA;
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  document.addEventListener('DOMContentLoaded', () => {
    renderCollections();
    renderDDC();
    renderSubjects();
    renderKeywords();
    bindTabs();
    bindSearch();
    bindCloseResults();
  });

  // ===== TABS =====
  function bindTabs() {
    $$('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        $$('.view').forEach(v => v.classList.remove('active'));
        $(`#view-${tab.dataset.view}`).classList.add('active');
        hideResults();
      });
    });
  }

  // ===== COLLECTIONS =====
  function renderCollections() {
    const grid = $('#collectionsGrid');
    grid.innerHTML = D.collections.map(c => `
      <div class="collection-card" style="--card-accent:${c.color}" data-code="${c.code}">
        <div class="card-icon">${c.icon}</div>
        <div class="card-code">${c.code}</div>
        <div class="card-name">${c.name}</div>
        <div class="card-count">${c.count.toLocaleString()}<span>tài liệu</span></div>
        <div class="card-loan">Mượn: <strong>${c.loan} ngày</strong></div>
        <p style="font-size:0.82rem;color:var(--text-dim);margin-top:8px">${c.desc}</p>
      </div>
    `).join('');
    grid.querySelectorAll('.collection-card').forEach(card => {
      card.addEventListener('click', () => {
        const c = D.collections.find(x => x.code === card.dataset.code);
        // Lọc tủ sách thuộc bộ sưu tập này
        const related = D.tuSach.filter(ts =>
          (c.code === 'GK' && (ts.category.includes('SGK') || ts.category.includes('lớp'))) ||
          (c.code === 'TK' && (ts.category === 'Tham khảo' || ts.category === 'Môn học' || ts.category === 'Chuyên đề')) ||
          (c.code === 'NV' && ts.category === 'Nghiệp vụ') ||
          (c.code === 'TIENGANH' && ts.category === 'Ngoại ngữ')
        );
        showTuSachResults(`${c.icon} ${c.name}`, related, `${c.count} tài liệu — Mượn ${c.loan} ngày`);
      });
    });
  }

  // ===== DDC =====
  function renderDDC() {
    const container = $('#ddcContainer');
    container.innerHTML = D.ddc.map(d => `
      <div class="ddc-row" data-num="${d.num}" style="--ddc-color:${d.num === '800' ? '#1565c0' : d.num === '500' ? '#2e7d32' : d.num === '300' ? '#e65100' : d.num === '900' ? '#c62828' : d.num === '700' ? '#ad1457' : d.num === '100' ? '#6a1b9a' : d.num === '400' ? '#00838f' : d.num === '600' ? '#ef6c00' : '#546e7a'}">
        <div class="ddc-num">${d.num}</div>
        <div style="flex:1">
          <div class="ddc-name">${d.name}</div>
          <div class="ddc-name-vi">${d.nameVi}</div>
        </div>
        <a href="${searchLink('090a', d.num)}" target="_blank" class="ddc-link">Tra cứu ↗</a>
      </div>
    `).join('');
    container.querySelectorAll('.ddc-row').forEach(row => {
      row.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') return;
        const num = row.dataset.num;
        const d = D.ddc.find(x => x.num === num);
        if (d.subs) {
          showDDCSubResults(`🔢 DDC ${d.num} — ${d.name}`, d);
        } else {
          window.open(searchLink('090a', num), '_blank');
        }
      });
    });
  }

  // ===== SUBJECTS (Tủ Sách) =====
  function renderSubjects() {
    const container = $('#subjectsContainer');
    const grouped = {};
    D.tuSach.forEach(ts => {
      if (!grouped[ts.category]) grouped[ts.category] = [];
      grouped[ts.category].push(ts);
    });

    const icons = {
      'Chuyên đề':'📚','SGK':'📗','SGK Lớp 10':'🔟','SGK Lớp 11':'1️⃣','SGK Lớp 12':'🔢',
      'Chuyên đề lớp 10':'📝','Chuyên đề lớp 11':'📝','Chuyên đề lớp 12':'📝',
      'Bài tập lớp 10':'✏️','Bài tập lớp 11':'✏️',
      'Tham khảo':'📘','Nghiệp vụ':'📕','Môn học':'📐','Nghệ thuật':'🎨',
      'Văn học':'📖','Khoa học':'🔬','Ngoại ngữ':'🇬🇧','Công cụ':'🗺️',
      'Kỹ năng':'🌱','Giải trí':'🎮','Lịch sử':'🏛️','Đất nước':'🇻🇳',
      'Văn hoá':'🎭','Địa phương':'🌴','Chính trị':'⭐','Khác':'📦',
      'Công nghệ':'🔧','Thể chất lớp 11':'⚽',
    };

    let html = '';
    for (const [cat, items] of Object.entries(grouped)) {
      html += `<div style="grid-column:1/-1;margin-top:16px;margin-bottom:4px">
        <h3 style="font-size:0.82rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--text-dim);font-weight:600">${cat} (${items.length})</h3>
      </div>`;
      items.forEach(ts => {
        const icon = icons[ts.category] || '📄';
        html += `
          <div class="subject-card" data-name="${ts.name}">
            <div class="subject-icon">${icon}</div>
            <div class="subject-info">
              <div class="subject-name">${ts.name}</div>
              <div class="subject-meta">${ts.category}</div>
            </div>
          </div>`;
      });
    }
    container.innerHTML = html;

    container.querySelectorAll('.subject-card').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.name;
        // Mở trực tiếp link tra cứu trên web thư viện
        window.open(viewTmLink(name), '_blank');
      });
    });
  }

  // ===== KEYWORDS =====
  function renderKeywords() {
    const cloud = $('#tagCloud');
    // Tạo tag từ tên tủ sách + DDC
    const tags = new Map();
    D.tuSach.forEach(ts => {
      const base = ts.name.replace(/\d+/g,'').replace(/\s+/g,' ').trim();
      if (base.length > 2) tags.set(base, (tags.get(base)||0) + 1);
    });
    // Thêm DDC
    D.ddc.forEach(d => { tags.set(d.name, 3); });
    // Thêm manual tags
    ['Phú Quốc','Kiên Giang','Biển đảo','Đề thi','Ôn tập','Bài tập','Chuyên đề','Nâng cao',
     'Lớp 10','Lớp 11','Lớp 12','Giáo viên','Học sinh giỏi'].forEach(t => tags.set(t, 2));

    const sorted = [...tags.entries()].sort(() => Math.random() - 0.5);
    cloud.innerHTML = sorted.map(([word, count]) => {
      const cls = count >= 4 ? 'size-lg' : count >= 2 ? 'size-md' : '';
      return `<span class="tag ${cls}" data-word="${word}">${word}</span>`;
    }).join('');

    cloud.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => {
        window.open(searchLink('keyword', tag.dataset.word), '_blank');
      });
    });
  }

  // ===== SEARCH =====
  function bindSearch() {
    const input = $('#globalSearch');
    const clearBtn = $('#clearSearch');
    input.addEventListener('input', () => {
      clearBtn.style.display = input.value ? 'block' : 'none';
    });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        window.open(searchLink('keyword', input.value.trim()), '_blank');
      }
    });
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      input.focus();
    });
  }

  // ===== RESULTS =====
  function showTuSachResults(title, items, subtitle) {
    const panel = $('#resultsPanel');
    $('#resultsTitle').innerHTML = `${title} <span style="font-size:0.85rem;color:var(--text-dim);font-weight:400;margin-left:8px">${subtitle}</span>`;
    const list = $('#resultsList');
    if (!items.length) {
      list.innerHTML = `<div class="no-results"><p>Tra cứu trực tiếp tại <a href="${LIBRARY_URL}/opac/index.php" target="_blank">OPAC Thư Viện ↗</a></p></div>`;
    } else {
      list.innerHTML = items.map((ts, i) => `
        <div class="result-item" style="cursor:pointer" onclick="window.open('${viewTmLink(ts.name)}','_blank')">
          <div class="result-num">${i+1}</div>
          <div class="result-info">
            <div class="result-title">${ts.name}</div>
            <div class="result-meta"><span>📂 ${ts.category}</span></div>
          </div>
          <div class="result-ddc">Xem ↗</div>
        </div>
      `).join('');
    }
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }

  function showDDCSubResults(title, ddcItem) {
    const panel = $('#resultsPanel');
    $('#resultsTitle').textContent = title;
    const list = $('#resultsList');
    if (!ddcItem.subs) {
      list.innerHTML = `<div class="no-results">Nhấn "Tra cứu" để xem sách thuộc DDC ${ddcItem.num}</div>`;
    } else {
      list.innerHTML = ddcItem.subs.map((sub, i) => {
        if (typeof sub === 'string') {
          const parts = sub.match(/^([\d.]+)\s+(.+)$/);
          if (parts) {
            return `<div class="result-item" style="cursor:pointer" onclick="window.open('${searchLink('090a', parts[1])}','_blank')">
              <div class="result-num">${parts[1]}</div>
              <div class="result-info"><div class="result-title">${parts[2]}</div></div>
              <div class="result-ddc">Tra cứu ↗</div>
            </div>`;
          }
          return `<div class="result-item"><div class="result-info"><div class="result-title">${sub}</div></div></div>`;
        }
        return `<div class="result-item" style="cursor:pointer" onclick="window.open('${searchLink('090a', sub.num)}','_blank')">
          <div class="result-num">${sub.num}</div>
          <div class="result-info">
            <div class="result-title">${sub.name}</div>
            ${sub.subs ? `<div class="result-meta">${sub.subs.length} phân nhóm con</div>` : ''}
          </div>
          <div class="result-ddc">Tra cứu ↗</div>
        </div>`;
      }).join('');
    }
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }

  function hideResults() { $('#resultsPanel').style.display = 'none'; }
  function bindCloseResults() { $('#closeResults').addEventListener('click', hideResults); }
})();
