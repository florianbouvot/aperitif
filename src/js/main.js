/**
 * SVG for Everybody
 * https://github.com/jonathantneal/svg4everybody
 */

svg4everybody();


/**
 * Toggle on/off nav on click
 */

var navBtn = document.getElementById('js-nav-toggle-btn');
var navMenu = document.getElementById('js-nav-toggle-menu');

if (navBtn && navMenu) {
  navBtn.onclick = function toggleMenu() {
    navMenu.classList.toggle('is-expanded');
  };
};
