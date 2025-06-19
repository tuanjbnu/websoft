function loadSoftware(category = "all", featuredOnly = false) {
  fetch('software.json')
    .then(res => res.json())
    .then(data => {
      // Lọc theo category
      if (category !== "all") {
        data = data.filter(s =>
          Array.isArray(s.category)
            ? s.category.includes(category)
            : s.category === category
        );
      }

      // Lọc theo featured
      if (featuredOnly) {
        data = data.filter(s => s.featured);
      }

      // Nếu có swiper-wrapper (trang index) thì render slider 4 thẻ 1 slide
      const wrapper = document.querySelector('.swiper-wrapper');
      if (wrapper) {
        wrapper.innerHTML = '';
        let slide;
        data.forEach((soft, i) => {
          if (i % 4 === 0) {
            slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = '<div class="software-grid"></div>';
            wrapper.appendChild(slide);
          }
          const el = document.createElement('div');
          el.className = 'software-card';
          el.innerHTML = `
            <img src="${soft.icon}" alt="${soft.name}">
            <h4>${soft.name}</h4>
            <p>${soft.desc}</p>
            <a href="${soft.download}" class="btn-download">Download</a>
          `;
          slide.querySelector('.software-grid').appendChild(el);
        });

        new Swiper('.software-swiper', {
          loop: true,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
          },
          speed: 1200,
          effect: 'fade',
          fadeEffect: {
            crossFade: true, // mượt mà hơn giữa các slide
          },
          grabCursor: true,
          slidesPerView: 1,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
        });

        
          pagination: {
            el: '.swiper-pagination',
            clickable: true
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        });

        return; // Đã render slider, dừng hàm
      }

      // Nếu không phải index (không có swiper-wrapper) -> hiển thị dạng grid + phân trang

      const grid = document.querySelector('.software-grid');
      const paginationContainer = document.querySelector('.pagination');

      if (!grid) return; // Không tìm thấy grid, không làm gì

      const itemsPerPage = 8; // 2 dòng x 4 cột = 8 thẻ
      let currentPage = 1;
      const totalPages = Math.ceil(data.length / itemsPerPage);

      // Hàm render grid theo trang
      function renderPage(page) {
        grid.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, data.length);

        // Thêm thẻ phần mềm có dữ liệu
        for (let i = start; i < end; i++) {
          const soft = data[i];
          const el = document.createElement('div');
          el.className = 'software-card';
          el.innerHTML = `
            <img src="${soft.icon}" alt="${soft.name}">
            <h4>${soft.name}</h4>
            <p>${soft.desc}</p>
            <a href="${soft.download}" class="btn-download">Download</a>
          `;
          grid.appendChild(el);
        }

        // Thêm thẻ rỗng (empty) để đảm bảo luôn đủ 8 thẻ
        const itemsRendered = end - start;
        const emptyCount = itemsPerPage - itemsRendered;
        for (let i = 0; i < emptyCount; i++) {
          const emptyEl = document.createElement('div');
          emptyEl.className = 'software-card empty';
          grid.appendChild(emptyEl);
        }
      }

      // Hàm render phân trang
      function renderPagination() {
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';

        // Prev button
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Prev';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
          if (currentPage > 1) {
            currentPage--;
            update();
          }
        });
        paginationContainer.appendChild(prevBtn);

        // Nút số trang
        for (let i = 1; i <= totalPages; i++) {
          const pageBtn = document.createElement('button');
          pageBtn.textContent = i;
          if (i === currentPage) {
            pageBtn.classList.add('active');
          }
          pageBtn.addEventListener('click', () => {
            currentPage = i;
            update();
          });
          paginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
          if (currentPage < totalPages) {
            currentPage++;
            update();
          }
        });
        paginationContainer.appendChild(nextBtn);
      }

      // Cập nhật render grid và phân trang
      function update() {
        renderPage(currentPage);
        renderPagination();
      }

      // Khởi tạo lần đầu
      update();

    })
    .catch(error => console.error("Lỗi khi load phần mềm:", error));
}

// Gọi loadSoftware khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  const category = window.pageCategory || "all";
  const featuredOnly = !window.pageCategory;
  loadSoftware(category, featuredOnly);
});

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('header nav ul li a');
  const currentPage = window.location.pathname.split('/').pop();

  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage || (currentPage === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    }
  });
});


