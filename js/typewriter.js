document.addEventListener('DOMContentLoaded', () => {
  const contentEl = document.getElementById('letter-content');
  if (!contentEl) return;
  
  const letterText = `Mom Vi ơi,

Bốn năm đã trôi qua như một giấc mơ đẹp — đầy những trang sách luật, những buổi sáng cà phê vội vàng trước giờ học, những đêm deadline căng thẳng và những khoảnh khắc vỡ òa vui sướng không thể nào quên.

Hôm nay, khi tấm bằng Cử nhân Luật đặt vào tay mom, đó không chỉ là thành quả của trí tuệ — đó là minh chứng cho sự kiên nhẫn, lòng dũng cảm và trái tim luôn hướng về phía trước dù bao nhiêu lần vấp ngã.

Nhóm 7 Nụ luôn ở đây, luôn tự hào về mom. Hành trình phía trước sẽ không phải lúc nào cũng bằng phẳng — nhưng hãy nhớ rằng mom đã làm được điều mà nhiều người chỉ dám mơ ước.

Chặng đường mới đang chờ. Và mom hoàn toàn sẵn sàng.

Với tất cả tình yêu và sự tự hào,`;

  let typed = false;
  
  const typeText = () => {
    if (typed) return;
    typed = true;
    
    contentEl.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    
    let i = 0;
    
    const typeNextChar = () => {
      if (i < letterText.length) {
        let char = letterText.charAt(i);
        
        if (char === '\n') {
          if (i + 1 < letterText.length && letterText.charAt(i + 1) === '\n') {
            const br = document.createElement('br');
            const br2 = document.createElement('br');
            contentEl.appendChild(br);
            contentEl.appendChild(br2);
            i++; 
          } else {
            const space = document.createTextNode(' ');
            contentEl.appendChild(space);
          }
        } else {
          const textNode = document.createTextNode(char);
          contentEl.appendChild(textNode);
        }
        
        contentEl.appendChild(cursor);
        i++;
        
        const delay = 22 + Math.random() * 16;
        setTimeout(typeNextChar, delay);
      } else {
        setTimeout(() => cursor.remove(), 2000);
      }
    };
    
    typeNextChar();
  };
  
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      typeText();
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  
  observer.observe(contentEl);
});
