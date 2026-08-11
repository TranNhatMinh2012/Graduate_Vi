document.addEventListener('DOMContentLoaded', () => {
  const wishesGrid = document.getElementById('wishes-grid');
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

  fetch('wishes.xlsx')
    .then(response => {
      if (!response.ok) throw new Error('File not found');
      return response.arrayBuffer();
    })
    .then(data => {
      if (typeof XLSX === 'undefined') throw new Error('XLSX library not loaded');
      
      const workbook = XLSX.read(data, { type: 'array' });
      
      // Tìm sheet của Gái Mũy Amee (substring match, không phân biệt hoa/thường)
      const keywords = ['mũy', 'muy', 'amee', 'ame'];
      let chosenSheet = null;
      
      for (let sheetName of workbook.SheetNames) {
        const lower = sheetName.toLowerCase();
        if (keywords.some(kw => lower.includes(kw))) {
          chosenSheet = sheetName;
          break;
        }
      }
      
      // Fallback: lấy sheet đầu tiên nếu không tìm thấy
      if (!chosenSheet) {
        chosenSheet = workbook.SheetNames[0];
      }
      
      const worksheet = workbook.Sheets[chosenSheet];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      let count = 0;
      json.forEach(row => {
        if (!row || row.length < 2) return;
        const name = (row[0] || '').toString().trim();
        const msg = (row[1] || '').toString().trim();
        
        if (!name || !msg) return;
        if (name.toLowerCase() === 'tên' || name.toLowerCase() === 'ten' || msg.toLowerCase().includes('lời chúc')) return;
        
        const card = document.createElement('div');
        card.className = 'wish-card glass reveal';
        
        card.innerHTML = `
          <span class="wish-stars">★★★</span>
          <p class="wish-msg">"${escapeHTML(msg)}"</p>
          <div class="wish-from">${escapeHTML(name)}</div>
          <div class="wish-sheet">Gửi từ form chúc mừng</div>
        `;
        
        wishesGrid.appendChild(card);
        count++;
      });
      
      if (count === 0) {
        wishesGrid.innerHTML = '<p class="body-text">Chưa có lời chúc nào.</p>';
      } else {
        setTimeout(() => {
          const cards = document.querySelectorAll('.wish-card');
          if (typeof gsap !== 'undefined') {
            gsap.to(cards, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "back.out(1.2)"
            });
          } else {
            cards.forEach(el => el.classList.add('in'));
          }
        }, 100);
      }
    })
    .catch(error => {
      console.error(error);
      wishesGrid.innerHTML = '<p class="body-text">Không thể tải dữ liệu lời chúc. Vui lòng thử lại sau.</p>';
    });
});
