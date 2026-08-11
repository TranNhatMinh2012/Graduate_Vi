document.addEventListener('DOMContentLoaded', () => {
  const wishesGrid = document.getElementById('wishes-grid');
  const counterEl = document.getElementById('unseal-counter');
  const progressFill = document.getElementById('game-progress-fill');
  const unsealAllBtn = document.getElementById('unseal-all-btn');
  
  const modal = document.getElementById('doc-modal');
  const modalClose = document.getElementById('doc-modal-close');
  const modalDocId = document.getElementById('modal-doc-id');
  const modalDocStatus = document.getElementById('modal-doc-status');
  const modalDocType = document.getElementById('modal-doc-type');
  const modalDocSub = document.getElementById('modal-doc-sub');
  const modalDocMsg = document.getElementById('modal-doc-msg');
  const modalDocSigner = document.getElementById('modal-doc-signer');

  if (!wishesGrid) return;
  
  const escapeHTML = (str) => {
    if (!str) return '';
    return str.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const docTypes = [
    { type: 'AFFIDAVIT OF FRIENDSHIP', label: 'Bản Khai Tự Nguyện Tình Bạn' },
    { type: 'WITNESS STATEMENT', label: 'Lời Chứng Nhận Tốt Nghiệp' },
    { type: 'MEMORANDUM OF CELEBRATION', label: 'Ghi Nhớ Chúc Mừng' },
    { type: 'LEGAL OPINION & WISHES', label: 'Ý Kiến Pháp Lý & Lời Chúc' },
    { type: 'CERTIFICATE OF AFFECTION', label: 'Chứng Nhận Tình Bạn' },
    { type: 'COMMENDATION RECORD', label: 'Văn Bản Ghi Nhận Thành Tích' }
  ];

  const statusBadges = [
    { text: 'VERIFIED', class: 'badge-verified' },
    { text: 'CERTIFIED', class: 'badge-certified' },
    { text: 'FILED', class: 'badge-filed' },
    { text: 'NOTARIZED', class: 'badge-notarized' },
    { text: 'ADMITTED INTO RECORD', class: 'badge-admitted' },
    { text: 'AUTHENTICATED', class: 'badge-authenticated' }
  ];

  let totalDocs = 0;
  let unsealedCount = 0;
  const cardsData = [];

  const updateProgress = () => {
    if (counterEl) counterEl.textContent = `${unsealedCount} / ${totalDocs} Đã mở`;
    if (progressFill && totalDocs > 0) {
      const pct = (unsealedCount / totalDocs) * 100;
      progressFill.style.width = `${pct}%`;
    }
  };

  fetch('wishes.xlsx')
    .then(response => {
      if (!response.ok) throw new Error('File not found');
      return response.arrayBuffer();
    })
    .then(data => {
      if (typeof XLSX === 'undefined') throw new Error('XLSX library not loaded');
      
      const workbook = XLSX.read(data, { type: 'array' });
      const keywords = ['mũy', 'muy', 'amee', 'ame'];
      let chosenSheet = null;
      
      for (let sheetName of workbook.SheetNames) {
        const lower = sheetName.toLowerCase();
        if (keywords.some(kw => lower.includes(kw))) {
          chosenSheet = sheetName;
          break;
        }
      }
      
      if (!chosenSheet) {
        chosenSheet = workbook.SheetNames[0];
      }
      
      const worksheet = workbook.Sheets[chosenSheet];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      json.forEach(row => {
        if (!row || row.length < 2) return;
        const name = (row[0] || '').toString().trim();
        const msg = (row[1] || '').toString().trim();
        
        if (!name || !msg) return;
        if (name.toLowerCase() === 'tên' || name.toLowerCase() === 'ten' || msg.toLowerCase().includes('lời chúc')) return;
        
        cardsData.push({ name, msg });
      });

      totalDocs = cardsData.length;
      updateProgress();
      
      if (totalDocs === 0) {
        wishesGrid.innerHTML = '<p class="body-text">Chưa có lời chúc nào được ghi nhận.</p>';
        return;
      }

      wishesGrid.innerHTML = '';

      cardsData.forEach((item, index) => {
        const count = index + 1;
        const docType = docTypes[index % docTypes.length];
        const statusBadge = statusBadges[index % statusBadges.length];
        const docCode = `DOC-2026-VI-${String(count).padStart(3, '0')}`;
        
        const card = document.createElement('div');
        card.className = 'legal-doc-card glass sealed-card reveal';
        card.dataset.index = index;
        
        card.innerHTML = `
          <!-- Sealed View Overlay -->
          <div class="sealed-overlay">
            <div class="sealed-top-tag">TOP SECRET · CONFIDENTIAL</div>
            <div class="wax-seal-btn" title="Nhấn để bóc niêm phong hồ sơ">
              <span class="wax-seal-icon">✦</span>
              <span class="wax-seal-text">BÓC NIÊM PHONG</span>
              <span class="wax-seal-sub">UNSEAL RECORD</span>
            </div>
            <div class="sealed-bottom-meta">Hồ sơ #${docCode}</div>
          </div>

          <!-- Unsealed Document Content -->
          <div class="unsealed-content" style="display:none; opacity:0;">
            <div class="doc-header-row">
              <div class="doc-meta">
                <span class="doc-id">${docCode}</span>
                <span class="doc-type">${docType.type}</span>
              </div>
              <span class="doc-status-badge ${statusBadge.class}">${statusBadge.text}</span>
            </div>
            <div class="doc-sub-label">${docType.label}</div>
            
            <div class="doc-body-content">
              <p class="wish-msg">"${escapeHTML(item.msg)}"</p>
            </div>
            
            <div class="doc-footer-row">
              <div class="doc-signer-info">
                <span class="signer-title">NGƯỜI TUYÊN BỐ / DEPONENT</span>
                <span class="signer-name">${escapeHTML(item.name)}</span>
              </div>
              <div class="doc-stamp-mini">
                <span class="stamp-mini-text">SEALED</span>
              </div>
            </div>
          </div>
        `;
        
        // Handle unseal click
        const sealBtn = card.querySelector('.wax-seal-btn');
        const unsealCard = () => {
          if (card.classList.contains('is-unsealed')) return;
          card.classList.remove('sealed-card');
          card.classList.add('is-unsealed');
          
          const overlay = card.querySelector('.sealed-overlay');
          const content = card.querySelector('.unsealed-content');
          
          if (typeof gsap !== 'undefined') {
            gsap.timeline()
              .to(sealBtn, { scale: 1.25, rotation: 15, duration: 0.15, ease: 'power2.in' })
              .to(overlay, { opacity: 0, scale: 0.85, duration: 0.35, onComplete: () => { overlay.style.display = 'none'; } })
              .set(content, { display: 'flex', flexDirection: 'column', opacity: 0, y: 15 })
              .to(content, { opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)' });
          } else {
            overlay.style.display = 'none';
            content.style.display = 'flex';
            content.style.flexDirection = 'column';
            content.style.opacity = '1';
          }
          
          unsealedCount++;
          updateProgress();
        };

        sealBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          unsealCard();
        });

        // Click unsealed card to open full modal reader
        card.addEventListener('click', () => {
          if (!card.classList.contains('is-unsealed')) return;
          
          if (modal) {
            if (modalDocId) modalDocId.textContent = docCode;
            if (modalDocStatus) {
              modalDocStatus.textContent = statusBadge.text;
              modalDocStatus.className = `doc-status-badge ${statusBadge.class}`;
            }
            if (modalDocType) modalDocType.textContent = docType.type;
            if (modalDocSub) modalDocSub.textContent = docType.label;
            if (modalDocMsg) modalDocMsg.textContent = `"${item.msg}"`;
            if (modalDocSigner) modalDocSigner.textContent = item.name;
            
            modal.classList.add('open');
          }
        });
        
        wishesGrid.appendChild(card);
      });
      
      setTimeout(() => {
        const cards = document.querySelectorAll('.legal-doc-card');
        if (typeof gsap !== 'undefined') {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out"
          });
        } else {
          cards.forEach(el => el.classList.add('in'));
        }
      }, 100);

      // Unseal All Button
      if (unsealAllBtn) {
        unsealAllBtn.addEventListener('click', () => {
          const sealedCards = document.querySelectorAll('.legal-doc-card:not(.is-unsealed)');
          sealedCards.forEach((c, idx) => {
            setTimeout(() => {
              const btn = c.querySelector('.wax-seal-btn');
              if (btn) btn.click();
            }, idx * 120);
          });
        });
      }
    })
    .catch(error => {
      console.error(error);
      wishesGrid.innerHTML = '<p class="body-text">Không thể tải dữ liệu lời chúc. Vui lòng thử lại sau.</p>';
    });

  // Modal Close Events
  if (modal) {
    const closeModal = () => modal.classList.remove('open');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }
});
