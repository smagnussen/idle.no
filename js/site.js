const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('nav--open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Lukk meny' : 'Åpne meny');
});

const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const lines = [
      `Navn: ${data.get('name')}`,
      `E-post: ${data.get('email')}`,
      `Telefon: ${data.get('phone') || '—'}`,
      `Garasjeadresse: ${data.get('address') || '—'}`,
      `Ønsket modul: ${data.get('module')}`,
      '',
      'Melding:',
      data.get('message') || '—',
    ];

    const subject = encodeURIComponent(`Tilbudsforespørsel fra ${data.get('name')}`);
    const body = encodeURIComponent(lines.join('\n'));
    const mailtoLink = `mailto:hei@idle.no?subject=${subject}&body=${body}`;

    contactForm.classList.add('is-hidden');
    document.getElementById('form-success').classList.add('is-visible');

    window.setTimeout(() => { window.location.href = mailtoLink; }, 150);
  });
}
