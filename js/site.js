const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('nav--open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Lukk meny' : 'Åpne meny');
});

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const submitButton = contactForm.querySelector('.form-submit');
    submitButton.disabled = true;

    try {
      const response = await fetch('https://formsubmit.co/ajax/steinar@idle.no', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(contactForm),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        contactForm.classList.add('is-hidden');
        document.getElementById('form-success').classList.add('is-visible');
      } else {
        alert(result.message || 'Noe gikk galt. Prøv igjen, eller send oss en e-post direkte.');
        submitButton.disabled = false;
      }
    } catch (err) {
      alert('Noe gikk galt. Prøv igjen, eller send oss en e-post direkte.');
      submitButton.disabled = false;
    }
  });
}
