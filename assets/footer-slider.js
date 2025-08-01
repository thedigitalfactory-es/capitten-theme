class AutoSliderComponent extends SliderComponent {
  constructor() {
    super();
    if (!this.slider) return;
    if (this.slider.dataset.autoplay === 'true') this.setAutoPlay();
  }

  setAutoPlay() {
    this.autoplaySpeed = this.slider.dataset.speed * 1000;
    this.addEventListener('mouseover', this.pause.bind(this));
    this.addEventListener('mouseleave', this.play.bind(this));
    this.play();
  }

  play() {
    clearInterval(this.autoplay);
    this.autoplay = setInterval(this.autoRotateSlides.bind(this), this.autoplaySpeed);
  }

  pause() {
    clearInterval(this.autoplay);
  }

  autoRotateSlides() {
    const position =
      this.currentPage === this.totalPages
        ? 0
        : this.slider.scrollLeft + this.sliderItemOffset;
    this.setSlidePosition(position);
  }
}

customElements.define('auto-slider-component', AutoSliderComponent);
