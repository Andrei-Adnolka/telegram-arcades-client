export function disableScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop);
  };
}

export function enableScroll() {
  window.onscroll = function () {};
}
