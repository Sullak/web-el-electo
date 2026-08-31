/* ============================================
   EL ELECTO — JavaScript principal
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Menú móvil ---
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      }
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  // --- Enlace activo ---
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // --- Navbar: efecto scroll ---
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.style.background = 'rgba(30,8,2,0.97)';
        navbar.style.backdropFilter = 'blur(12px)';
      } else {
        navbar.style.background = 'var(--brown-dark)';
        navbar.style.backdropFilter = 'none';
      }
    }, { passive: true });
  }

  // --- Formulario de compra ---
  const purchaseForm = document.getElementById('purchaseForm');
  if (purchaseForm) {
    // Toggle dedicatoria
    document.querySelectorAll('input[name="tipo_pedido"]').forEach(radio => {
      radio.addEventListener('change', () => {
        const group = document.getElementById('dedicatoria-group');
        if (group) group.style.display = radio.value === 'dedicatoria' ? 'block' : 'none';
        document.querySelectorAll('.radio-option').forEach(o => o.classList.remove('selected'));
        radio.closest('.radio-option').classList.add('selected');
      });
    });

    // Submit
    purchaseForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const get = id => document.getElementById(id)?.value?.trim() || '';
      const nombre   = get('nombre');
      const ciudad   = get('ciudad');
      const pais     = get('pais');
      const cantidad = get('cantidad');
      const email    = get('email');
      const whatsapp = get('whatsapp_cliente');
      const tipo     = document.querySelector('input[name="tipo_pedido"]:checked')?.value || 'sin-dedicatoria';
      const dedicatoria = get('dedicatoria');

      const tipoLabel = { 'sin-dedicatoria': 'Sin dedicatoria', 'dedicatoria': 'Con dedicatoria personalizada', 'solo-firma': 'Solo firma del autor' };

      let msg = `Hola! Me interesa el libro "El Electo... El Progreso Silenciado".\n\n`;
      msg += `👤 Nombre: ${nombre}\n`;
      msg += `📍 Ciudad: ${ciudad}, ${pais}\n`;
      msg += `📧 Email: ${email}\n`;
      if (whatsapp) msg += `📱 WhatsApp: ${whatsapp}\n`;
      msg += `📚 Cantidad: ${cantidad} ejemplar(es)\n`;
      msg += `📝 Tipo: ${tipoLabel[tipo] || tipo}`;
      if (tipo === 'dedicatoria' && dedicatoria) msg += `\n✍️ Dedicatoria: "${dedicatoria}"`;

      const WA_NUMBER = '595974202326';
      const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

      const formData = new FormData(purchaseForm);
      fetch('/submit-form', {
        method: 'POST',
        body: formData
      })
      .then(async response => {
        if (response.ok) {
          purchaseForm.style.display = 'none';
          const successMsg = document.getElementById('form-success');
          if (successMsg) successMsg.style.display = 'flex';
          setTimeout(() => { window.open(waUrl, '_blank'); }, 1200);
        } else {
          const msg = await response.text();
          alert('Error al enviar el pedido: ' + msg);
        }
      })
      .catch(err => {
        alert('Error al enviar el pedido: ' + err.message);
      });
    });
  }

  // --- Formulario de contacto ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      fetch('/submit-form', {
        method: 'POST',
        body: formData
      })
      .then(async response => {
        if (response.ok) {
          contactForm.style.display = 'none';
          const ok = document.getElementById('contact-success');
          if (ok) ok.style.display = 'flex';
        } else {
          const msg = await response.text();
          alert('Error al enviar el mensaje: ' + msg);
        }
      })
      .catch(err => {
        alert('Error al enviar el mensaje: ' + err.message);
      });
    });
  }

  // --- Búsqueda de artículos ---
  const searchInput = document.getElementById('articleSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      document.querySelectorAll('.article-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // --- Animación de entrada (Intersection Observer) ---
  const observed = document.querySelectorAll('.card-animate');
  if (observed.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    observed.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      io.observe(el);
    });
  }

});
