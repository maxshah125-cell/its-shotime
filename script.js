(() => {
  const carousel = document.getElementById('carousel');
  const cards = Array.from(carousel.querySelectorAll('.card'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  const total = cards.length;
  let current = 0;

  // Create progress dots
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'progress-dots';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dotsContainer.appendChild(dot);
  }
  document.body.appendChild(dotsContainer);

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function applyCardColor(card) {
    card.style.background = card.dataset.color;
  }

  // Sync detail section with active card
  function syncDetail() {
    const activeCard = cards[current];
    const img       = activeCard.dataset.img;
    const name      = activeCard.querySelector('.card-name').textContent;
    const price     = activeCard.querySelector('.card-price').textContent;
    const desc      = activeCard.dataset.desc;
    const color     = activeCard.dataset.color;
    const colors    = activeCard.dataset.colors ? activeCard.dataset.colors.split(',') : [color, color, color];

    const detailShoe = document.getElementById('detailShoe');
    detailShoe.src = img;
    detailShoe.alt = name;

    document.getElementById('detailName').textContent  = name;
    document.getElementById('detailPrice').textContent = price;
    document.getElementById('detailDesc').textContent  = desc;
    document.getElementById('detailBg').style.background = color;

    document.getElementById('flyingShoeImg').src = img;
    if (window.scrollY > window.innerHeight * 0.5) {
      document.getElementById('flyingShoe').style.opacity = '1';
    }

    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach((swatch, i) => {
      swatch.style.background = colors[i] || color;
    });
  }

  function update() {
    const prevIndex = mod(current - 1, total);
    const nextIndex = mod(current + 1, total);

    cards.forEach(card => {
      card.classList.remove('active', 'side', 'side-left', 'side-right', 'hidden');
      card.classList.add('hidden');
      applyCardColor(card);
    });

    cards[current].classList.remove('hidden');
    cards[current].classList.add('active');

    cards[prevIndex].classList.remove('hidden');
    cards[prevIndex].classList.add('side', 'side-left');

    cards[nextIndex].classList.remove('hidden');
    cards[nextIndex].classList.add('side', 'side-right');

    // Reorder DOM: left → center → right
    carousel.appendChild(cards[prevIndex]);
    carousel.appendChild(cards[current]);
    carousel.appendChild(cards[nextIndex]);

    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });

    syncDetail();
  }

  function next() {
    current = mod(current + 1, total);
    update();
  }

  function prev() {
    current = mod(current - 1, total);
    update();
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  let touchStartX = 0;

  document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
    }
  }, { passive: true });

  cards.forEach((card) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('side-left')) prev();
      else if (card.classList.contains('side-right')) next();
    });
  });

  // Size button toggle
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Scroll observer — animate detail section on entry
  const detailShoe  = document.getElementById('detailShoe');
  const detailRight = document.querySelector('.detail-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        detailShoe.classList.add('visible');
        detailRight.classList.add('visible');
      } else {
        detailShoe.classList.remove('visible');
        detailRight.classList.remove('visible');
      }
    });
  }, { threshold: 0.2 });

  observer.observe(document.getElementById('detailSection'));

const flyingShoe = document.getElementById('flyingShoe');
const flyingImg = document.getElementById('flyingShoeImg');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const pageH = window.innerHeight;
  const progress = Math.min(scrollY / pageH, 1);

  if (progress <= 0) {
    flyingShoe.style.opacity = '0';
    return;
  }

  // Get actual card position on screen
  const activeCard = cards[current];
  const cardRect = activeCard.getBoundingClientRect();
  const cardImg = activeCard.querySelector('.shoe-img');
  const imgRect = cardImg.getBoundingClientRect();

  // Start = actual shoe image position
  const startX = imgRect.left;
  const startY = imgRect.top + scrollY;

  // End = left side of page 2
  const endX = 80;
  const endY = pageH * 1.1;

  const x = startX + (endX - startX) * progress;
  const y = startY + (endY - startY) * progress - scrollY;
  const size = 200 + (80 * progress);

  flyingShoe.style.opacity = '1';
  flyingShoe.style.transform = `translate(${x}px, ${y}px)`;
  flyingImg.style.width = size + 'px';
  flyingImg.src = cards[current].dataset.img;
});

  // Init
  update();
})();

window.addEventListener('scroll', () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    if (window.scrollY > 100) {
      card.classList.add('scrolled');
    } else {
      card.classList.remove('scrolled');
    }
  });
});
