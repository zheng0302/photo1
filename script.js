document.addEventListener('DOMContentLoaded', function() {
  
  // 1. 純原生 JS 控制漢堡按鈕的打開與收合
  const toggler = document.getElementById('customNavbarToggler');
  const collapseMenu = document.getElementById('customNavbarCollapse');
  
  if (toggler && collapseMenu) {
    toggler.addEventListener('click', function() {
      collapseMenu.classList.toggle('show-list');
    });
  }

  // 2. 右上角書籤分頁的切換與點擊後的置頂處理 (自動支持無限個新增分頁)
  const bookmarkLinks = document.querySelectorAll('.bookmark-nav a');
  
  bookmarkLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const parentNav = link.closest('.bookmark-nav');
      parentNav.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
      link.classList.add('active');
      
      const targetId = link.getAttribute('href');
      const tabContent = document.querySelector('.tab-content');
      
      tabContent.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('show', 'active');
      });
      
      const targetPane = document.querySelector(targetId);
      if (targetPane) {
        targetPane.classList.add('show', 'active');
      }
      
      if (collapseMenu.classList.contains('show-list')) {
        collapseMenu.classList.remove('show-list');
      }
      
      const mainTitle = document.querySelector('.main-title');
      if (mainTitle) {
        window.scrollTo({
          top: mainTitle.offsetTop - 90,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3. 純原生 JS 首頁大圖輪播邏輯
 const slide1 = document.getElementById('heroSlide1');
  const slide2 = document.getElementById('heroSlide2');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  
  // 切換照片的共用函式
  function toggleSlides() {
    if (slide1 && slide2) {
      slide1.classList.toggle('active');
      slide2.classList.toggle('active');
    }
  }

  // 自動輪播（每 4 秒）
  let autoSlideInterval = setInterval(toggleSlides, 4000);

  // 重設計時器（防止剛點完按鈕就瞬間又自動切換）
  function resetSlideTimer() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(toggleSlides, 4000);
  }

  // 綁定手動點擊事件
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleSlides();
      resetSlideTimer(); // 點擊後重新計算 4 秒
    });
    
    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      toggleSlides();
      resetSlideTimer(); // 點擊後重新計算 4 秒
    });
  }
  });
// ==========================================================================
// 當地照片集：燈箱連動與前後切換邏輯
// ==========================================================================
document.addEventListener('DOMContentLoaded', function () {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxModal = document.getElementById('lightboxModal');
  
  let currentIndex = 0;
  const totalImages = galleryItems.length;

  // 更新燈箱圖片與文字函數
  function updateLightbox(index) {
    if (index < 0 || index >= totalImages) return;
    currentIndex = index;
    const targetItem = document.querySelector(`.gallery-item[data-index="${currentIndex}"]`);
    
    if (targetItem) {
      if (lightboxImage) {
        const newSrc = targetItem.getAttribute('data-img-src');
        lightboxImage.setAttribute('src', newSrc);
      }
      if (lightboxCaption) {
        const newCaption = targetItem.getAttribute('data-caption') || targetItem.querySelector('img')?.getAttribute('alt') || '';
        lightboxCaption.textContent = newCaption;
      }
    }
  }

  // 監聽所有圖片的點擊 -> 開啟小視窗
  galleryItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault(); 
      const index = parseInt(this.getAttribute('data-index'));
      updateLightbox(index);
      if (lightboxModal) {
        lightboxModal.classList.add('show'); 
      }
    });
  });

  // 關閉燈箱函數
  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('show');
    }
  }

  // 直接用 ID 綁定「關閉按鈕」，絕對不會認錯人！
  const realCloseBtn = document.getElementById('closeLightboxBtn');
  if (realCloseBtn) {
    realCloseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // 阻止事件冒泡
      closeLightbox();     // 關閉視窗
    });
  }

  // 直接用 ID 綁定「上一張」
  const realPrevBtn = document.getElementById('prevLightboxBtn');
  if (realPrevBtn) {
    realPrevBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation(); 
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = totalImages - 1; 
      updateLightbox(newIndex);
    });
  }

  // 直接用 ID 綁定「下一張」
  const realNextBtn = document.getElementById('nextLightboxBtn');
  if (realNextBtn) {
    realNextBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation(); 
      let newIndex = currentIndex + 1;
      if (newIndex >= totalImages) newIndex = 0; 
      updateLightbox(newIndex); 
    });
  }

  // 點擊黑背景（非圖片區域）時也能關閉
  if (lightboxModal) {
    lightboxModal.addEventListener('click', function (e) {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  // 支援鍵盤事件
  document.addEventListener('keydown', function (e) {
    if (!lightboxModal || !lightboxModal.classList.contains('show')) return; 

    if (e.key === 'ArrowLeft' && realPrevBtn) {
      realPrevBtn.click();
    } else if (e.key === 'ArrowRight' && realNextBtn) {
      realNextBtn.click();
    } else if (e.key === 'Escape') {
      closeLightbox(); 
    }
  });
});