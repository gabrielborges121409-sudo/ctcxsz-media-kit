/**
 * Script Principal — Media Kit ctcxsz
 *
 * 1. Navbar: classe "scrolled" ao rolar + animação do hamburguer
 * 2. Menu mobile: toggle + fecha ao clicar em link
 * 3. Sistema de abas (Setup)
 * 4. Copiar configurações in-game com feedback visual
 * 5. Ano dinâmico no rodapé
 * 6. Animação de entrada com IntersectionObserver (fade-in das seções)
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. NAVBAR — classe "scrolled" ao rolar a página
  // =========================================================================
  const navbar = document.querySelector('.navbar');

  const handleScroll = () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // aplica no carregamento caso já tenha rolado

  // =========================================================================
  // 2. MENU MOBILE
  // =========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu    = document.getElementById('navMenu');
  const navLinks   = document.querySelectorAll('.nav-link, .nav-cta');

  const closeMenu = () => {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Fecha com Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });

    // Fecha ao clicar fora do menu
    document.addEventListener('click', e => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  // =========================================================================
  // 3. SISTEMA DE ABAS (Setup)
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels  = document.querySelectorAll('.tab-panel');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');

      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      tabPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.hidden = true;
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.hidden = false;
        // Aguarda um frame para disparar a animação CSS
        requestAnimationFrame(() => targetPanel.classList.add('active'));
      }
    });
  });

  // =========================================================================
  // 4. COPIAR CONFIGURAÇÕES IN-GAME
  // =========================================================================
  const copyBtn    = document.getElementById('copySettingsBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const copyToast  = document.getElementById('copyToast');
  const specsList  = document.getElementById('ingameSpecsList');

  let toastTimer;

  const showToast = (message) => {
    if (!copyToast) return;
    copyToast.textContent = message;
    copyToast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => copyToast.classList.remove('show'), 3200);
  };

  if (copyBtn && specsList) {
    copyBtn.addEventListener('click', async () => {
      const items = specsList.querySelectorAll('.spec-item');
      const lines = ['⚙️ Configurações Fortnite — ctcxsz:', ''];

      items.forEach(item => {
        const label = item.querySelector('.spec-name')?.textContent.trim();
        const value = item.querySelector('.spec-val')?.textContent.trim();
        if (label && value) lines.push(`• ${label}: ${value}`);
      });

      const text = lines.join('\n');

      const resetBtn = () => {
        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copiar Configs';
        }, 2500);
      };

      try {
        await navigator.clipboard.writeText(text);
        if (copyBtnText) copyBtnText.textContent = '✓ Copiado!';
        showToast('Configurações copiadas!');
        resetBtn();
      } catch {
        // Fallback para HTTP local
        const ta = document.createElement('textarea');
        ta.value = text;
        Object.assign(ta.style, { position: 'fixed', opacity: '0', top: '0', left: '0' });
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
          document.execCommand('copy');
          if (copyBtnText) copyBtnText.textContent = '✓ Copiado!';
          showToast('Configurações copiadas!');
        } catch {
          showToast('Não foi possível copiar automaticamente.');
        }
        document.body.removeChild(ta);
        resetBtn();
      }
    });
  }

  // =========================================================================
  // 5. ANO DINÂMICO
  // =========================================================================
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // =========================================================================
  // 6. FADE-IN DE ENTRADA DAS SEÇÕES (IntersectionObserver)
  // =========================================================================
  const fadeTargets = document.querySelectorAll('.metric-card, .clip-card, .setup-card, .cta-box');

  if ('IntersectionObserver' in window) {
    // Define estado inicial invisível via JS (evita flash sem CSS extra)
    fadeTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Delay escalonado para cards em grid
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    fadeTargets.forEach(el => observer.observe(el));
  }

});
