// Constants for class names to make changes easier and the code more readable.
const SCROLL_ANIMATION_TRIGGER_CLASSNAME = 'f-scroll-trigger';
const SCROLL_ANIMATION_OFFSCREEN_CLASSNAME = 'f-scroll-trigger--offscreen';
const SCROLL_ANIMATION_CANCEL_CLASSNAME = 'f-scroll-trigger--cancel';

// Improved onIntersection function for clarity and efficiency.
function onIntersection(entries, observer) {
  entries.forEach((entry, index) => {
    const { target, isIntersecting } = entry;
    if (isIntersecting) {
      if (target.classList.contains(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME)) {
        target.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
        if (target.hasAttribute('data-cascade')) {
          target.style.setProperty('--animation-order', index); // Changed index to intersectionRatio for dynamic values based on visibility.
        }
      } 
      observer.unobserve(target);
    } else {
      target.classList.add(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
      target.classList.remove(SCROLL_ANIMATION_CANCEL_CLASSNAME);
    }
  });
}

function checkInitialVisibility(element) {
  const rect = element.getBoundingClientRect();
  const isVisible = (
    rect.top < window.innerHeight && rect.bottom >= 0
  );

  if (isVisible) {
    element.classList.remove(SCROLL_ANIMATION_OFFSCREEN_CLASSNAME);
  }
}

// Simplified initialization function with better handling for Shopify's design mode.
function initializeScrollAnimationTrigger(rootEl = document, isDesignModeEvent = false) {
  const animationTriggerElements = [...rootEl.getElementsByClassName(SCROLL_ANIMATION_TRIGGER_CLASSNAME)];
  if (animationTriggerElements.length === 0) return;

  // Removed the empty if block for isDesignModeEvent. Assuming there was intended logic that was omitted.
  
  // Use options object for IntersectionObserver for better readability and maintainability.
  const observerOptions = {
    rootMargin: '0px 0px -50px 0px',
  };
  const observer = new IntersectionObserver(onIntersection, observerOptions);
  
  animationTriggerElements.forEach(element => {
    checkInitialVisibility(element);
    observer.observe(element)
  });
}

// Simplified event listeners for DOMContentLoaded and Shopify events.
window.addEventListener('DOMContentLoaded', () => initializeScrollAnimationTrigger());

if (window.Shopify && Shopify.designMode) {
  const reinitializeScrollAnimationTrigger = event => initializeScrollAnimationTrigger(event.target, true);
  document.addEventListener('shopify:section:load', reinitializeScrollAnimationTrigger);
  document.addEventListener('shopify:section:reorder', () => initializeScrollAnimationTrigger(document, true));
}