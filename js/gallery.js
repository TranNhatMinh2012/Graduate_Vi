document.addEventListener('DOMContentLoaded', () => {
  const galleryGrid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (!galleryGrid) return;
  
  fetch('assets/images/memories/manifest.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      // manifest.json: { "images": ["file1.jpg", ...] }
      const images = Array.isArray(data) ? data : (data.images || []);
      if (images.length === 0) throw new Error('Không có ảnh');
      
      galleryGrid.innerHTML = '';
      images.forEach((imgSrc, index) => {
        const item = document.createElement('div');
        item.className = 'masonry-item reveal';
        
        const tag = document.createElement('div');
        tag.className = 'exhibit-tag';
        tag.textContent = 'KỶ NIỆM ' + String(index + 1).padStart(2, '0');
        
        const img = document.createElement('img');
        img.src = 'assets/images/memories/' + imgSrc;
        img.alt = 'Kỷ niệm ' + (index + 1);
        img.loading = 'lazy';
        
        item.appendChild(tag);
        item.appendChild(img);
        galleryGrid.appendChild(item);
        
        item.addEventListener('click', () => {
          if (lightboxImg) lightboxImg.src = img.src;
          if (lightbox)    lightbox.classList.add('open');
        });
      });
      
      setTimeout(() => {
        const items = document.querySelectorAll('.masonry-item');
        items.forEach(el => el.classList.add('in'));
      }, 100);
    })
    .catch(error => {
      galleryGrid.innerHTML = '<p class="body-text">Hiện chưa có hình ảnh kỷ niệm nào được tải lên. Vui lòng kiểm tra lại sau.</p>';
    });

  if (lightbox) {
    const closeLightbox = () => lightbox.classList.remove('open');
    
    lightboxClose.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    });
  }
});
