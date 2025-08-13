class AutoSliderComponent extends SliderComponent {
  constructor() {
    super();
    if (!this.slider) return;

    this.sliderControlWrapper = this.querySelector('.slider-buttons');
    this.enableSliderLooping = true;

    if (!this.nextButton) {
      this.initPages();
      const resizeObserver = new ResizeObserver(() => this.initPages());
      resizeObserver.observe(this.slider);
      this.slider.addEventListener('scroll', this.update.bind(this));
    }

    if (this.sliderControlWrapper) {
      this.sliderControlLinksArray = Array.from(
        this.sliderControlWrapper.querySelectorAll('.slider-counter__link')
      );
      this.sliderControlLinksArray.forEach((link) =>
        link.addEventListener('click', this.linkToSlide.bind(this))
      );
    }

    this.setInitialSlide();

    if (this.slider.dataset.autoplay === 'true') this.setAutoPlay();
  }

  setInitialSlide() {
    if (!this.sliderItemOffset || !this.sliderItemsToShow.length) return;
    this.currentPage = Math.ceil(this.sliderItemsToShow.length / 2);
    const position = (this.currentPage - 1) * this.sliderItemOffset;
    this.setSlidePosition(position);
    this.update();
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

  onButtonClick(event) {
    event.preventDefault();
    const step = event.currentTarget.dataset.step || 1;

    if (event.currentTarget.name === 'next') {
      this.slideScrollPosition = this.slider.scrollLeft + step * this.sliderItemOffset;
      if (this.currentPage === this.sliderItemsToShow.length) {
        this.slideScrollPosition = 0;
      }
    } else {
      this.slideScrollPosition = this.slider.scrollLeft - step * this.sliderItemOffset;
      if (this.currentPage === 1) {
        this.slideScrollPosition = this.slider.scrollWidth - this.slider.clientWidth;
      }
    }

    this.setSlidePosition(this.slideScrollPosition);
  }

  linkToSlide(event) {
    event.preventDefault();
    const targetIndex = this.sliderControlLinksArray.indexOf(event.currentTarget);
    const slideScrollPosition =
      this.slider.scrollLeft + this.sliderItemOffset * (targetIndex + 1 - this.currentPage);
    this.setSlidePosition(slideScrollPosition);
  }

  update() {
    if (!this.slider) return;

    const previousPage = this.currentPage;
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItemOffset) + 1;

    if (this.currentPage != previousPage) {
      this.dispatchEvent(
        new CustomEvent('slideChanged', {
          detail: {
            currentPage: this.currentPage,
            currentElement: this.sliderItemsToShow[this.currentPage - 1],
          },
        })
      );
    }

    this.sliderControlButtons = this.querySelectorAll('.slider-counter__link');
    if (!this.sliderControlButtons.length) return;

    this.sliderControlButtons.forEach((link) => {
      link.classList.remove('slider-counter__link--active');
      link.removeAttribute('aria-current');
    });
    this.sliderControlButtons[this.currentPage - 1].classList.add('slider-counter__link--active');
    this.sliderControlButtons[this.currentPage - 1].setAttribute('aria-current', true);
  }
}

customElements.define('auto-slider-component', AutoSliderComponent);
