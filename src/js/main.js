/*
 * SVG for Everybody
 * https://github.com/jonathantneal/svg4everybody
 */

svg4everybody();


/**
 * Toggle on/off nav on click
 */

var nav = document.getElementById('nav');
var navToggle = document.getElementById('navToggle');

function toggleNav() {
  nav.classList.toggle('is-open');
}

if (nav && navToggle) {
  navToggle.addEventListener('click', toggleNav);
}
