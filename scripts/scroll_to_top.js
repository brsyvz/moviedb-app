// this feature is extra
(function () {
  const scrollBtn = document.createElement('a');
  const icon = document.createElement('i');
  icon.classList.add('fas', 'fa-chevron-up');
  scrollBtn.className = 'scroll-top-btn';
  scrollBtn.appendChild(icon);
  scrollBtn.addEventListener('click', navigate);

  window.onscroll = function () {
    if (
      document.body.scrollTop > 200 ||
      document.documentElement.scrollTop > 200
    ) {
      scrollBtn.classList.add('show');
    } else {
      scrollBtn.classList.remove('show');
    }
  };

  function navigate() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const siteContent = document.querySelector('body');
  siteContent.appendChild(scrollBtn);
})();
