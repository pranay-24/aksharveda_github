class StickyHeader extends HTMLElement {
	constructor() {
		super()
	}

	connectedCallback() {
		this.stickyEnabled = this.dataset.headerSticky === 'true'
		this.hideOnScroll = true
		this.isSticky = false
		this.header = document.querySelector('.f-section-header')
		if (this.stickyEnabled) this.initStickyHeader()
	}

	disconnectedCallback() {
		this.removeEventListener('preventHeaderReveal', this._hideHeaderOnScrollUp)
		window.removeEventListener('scroll', this.onScrollHandler)
	}

	initStickyHeader() {
		this.currentScrollTop = 0
		this.preventReveal = false

		this.onScrollHandler = this._onScroll.bind(this)
		this._hideHeaderOnScrollUp = () => this.preventReveal = true

		this.addEventListener('preventHeaderReveal', this._hideHeaderOnScrollUp)
		window.addEventListener('scroll', this.onScrollHandler, false)

		this.rectTop = this.header.offsetTop
		this.offset = this.header.offsetTop + this.header.clientHeight

		document.body.classList.add('header-sticky-enabled')
	}

	_onScroll() {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop
		if(this.hideOnScroll) {
			if (scrollTop > this.currentScrollTop && scrollTop > this.offset) {
				requestAnimationFrame(this._hide.bind(this))
			} else if (scrollTop < this.currentScrollTop && scrollTop > this.offset) {
				if (!this.preventReveal) {
					requestAnimationFrame(this._reveal.bind(this))
				} else {
					window.clearTimeout(this.isScrolling)
	
					this.isScrolling = setTimeout(() => {
						this.preventReveal = false
					}, 66)
	
					requestAnimationFrame(this._hide.bind(this))
				}
			} else if (scrollTop <= this.rectTop) {
				requestAnimationFrame(this._reset.bind(this))
			}
		}
		this.currentScrollTop = scrollTop
	}

	_hide() {
		if( this.isSticky ) {
			this.isSticky = false
			this.header.classList.add('site-header--sticky', 'site-header--hidden')
			document.body.classList.remove('header-sticky--visible')
			this._closeMenuDisclosure()
		}
	}

	_reveal() {
		if( ! this.isSticky ) {
			this.isSticky = true
			this.header.classList.add('site-header--sticky', 'site-header--animate')
			this.header.classList.remove('site-header--hidden')
			document.body.classList.add('header-sticky--visible')
		}
	}

	_reset() {
		this.isSticky = false
		this.header.classList.remove('site-header--hidden', 'site-header--sticky', 'site-header--animate')
		document.body.classList.remove('header-sticky--visible')
	}

	_closeMenuDisclosure() {
		this.disclosures = this.disclosures || this.header.querySelectorAll('header-menu');
		this.disclosures.forEach(disclosure => disclosure.close());

		this.siteNav = this.siteNav || this.header.querySelector('site-nav');
		this.siteNav && this.siteNav.closeMegaDropdowns()
	}
}

customElements.define('sticky-header', StickyHeader)
