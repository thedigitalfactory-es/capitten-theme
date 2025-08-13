class FooterSlider extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.slider = this.querySelector('[id^="Slider-"]');
    if (!this.slider) return;

    this.sliderItems = Array.from(this.querySelectorAll('[id^="Slide-"]'));
    this.dots = Array.from(this.querySelectorAll('.slider-counter__link'));
    this.currentIndex = 0;

    this.updateMetrics();
    this.slider.addEventListener('scroll', this.onScroll.bind(this));
    window.addEventListener('resize', this.updateMetrics.bind(this));

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', (event) => {
        event.preventDefault();
        this.goToSlide(index);
      });
    });

    const autoplay = this.slider.dataset.autoplay === 'true';
    this.speed = parseInt(this.slider.dataset.speed || 5) * 1000;
    if (autoplay) {
      this.play();
      this.addEventListener('mouseover', this.pause.bind(this));
      this.addEventListener('mouseleave', this.play.bind(this));
    }

    this.updateDots();
  }

  updateMetrics() {
    if (this.sliderItems.length > 1) {
      this.slideOffset = this.sliderItems[1].offsetLeft - this.sliderItems[0].offsetLeft;
    } else if (this.sliderItems.length === 1) {
      this.slideOffset = this.sliderItems[0].clientWidth;
    } else {
      this.slideOffset = 0;
    }
    this.goToSlide(this.currentIndex);
  }

  onScroll() {
    if (!this.slideOffset) return;
    const index = Math.round(this.slider.scrollLeft / this.slideOffset);
    if (index !== this.currentIndex) {
      this.currentIndex = index;
      this.updateDots();
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.slider.scrollTo({
      left: this.slideOffset * index,
      behavior: 'smooth',
    });
    this.updateDots();
  }

  nextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.sliderItems.length;
    this.goToSlide(nextIndex);
  }

  updateDots() {
    if (!this.dots.length) return;
    this.dots.forEach((dot) => {
      dot.classList.remove('slider-counter__link--active');
      dot.removeAttribute('aria-current');
    });
    const active = this.dots[this.currentIndex];
    if (active) {
      active.classList.add('slider-counter__link--active');
      active.setAttribute('aria-current', true);
    }
  }

  play() {
    this.pause();
    this.autoplayTimer = setInterval(() => this.nextSlide(), this.speed);
  }

  pause() {
    clearInterval(this.autoplayTimer);
  }
}

customElements.define('footer-slider', FooterSlider);
