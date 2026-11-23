/**
 * Script Principal - Página Oficial & Media Kit ctcxsz
 * Funcionalidades:
 * 1. Controle do menu mobile responsivo
 * 2. Alternância entre abas de Setup (In-Game vs Hardware)
 * 3. Cópia rápida das configurações de Fortnite com feedback visual
 * 4. Atualização automática do ano no rodapé
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. MENU MOBILE
  // =========================================================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu automaticamente ao clicar em qualquer link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // =========================================================================
  // 2. SISTEMA DE ABAS (SETUP & CONFIGURAÇÕES)
  // =========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab');

      // Reseta estado ativo de todos os botões
      tabButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      // Oculta todos os painéis
      tabPanels.forEach((panel) => {
        panel.classList.remove('active');
        panel.hidden = true;
      });

      // Ativa o botão clicado e exibe o painel correspondente
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.hidden = false;
      }
    });
  });

  // =========================================================================
  // 3. BOTÃO DE COPIAR CONFIGURAÇÕES IN-GAME
  // =========================================================================
  const copyBtn = document.getElementById('copySettingsBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const copyToast = document.getElementById('copyToast');
  const specsList = document.getElementById('ingameSpecsList');

  let toastTimeout;

  const showToast = (message) => {
    if (!copyToast) return;
    copyToast.textContent = message;
    copyToast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      copyToast.classList.remove('show');
    }, 3000);
  };

  if (copyBtn && specsList) {
    copyBtn.addEventListener('click', async () => {
      // Lê dinamicamente os itens da tela para evitar divergência de dados
      const items = specsList.querySelectorAll('.spec-item');
      const formattedLines = ['Configurações Fortnite — ctcxsz:'];

      items.forEach((item) => {
        const label = item.querySelector('.spec-name')?.textContent.trim();
        const value = item.querySelector('.spec-val')?.textContent.trim();
        if (label && value) {
          formattedLines.push(`• ${label}: ${value}`);
        }
      });

      const textToCopy = formattedLines.join('\n');

      try {
        await navigator.clipboard.writeText(textToCopy);
        if (copyBtnText) copyBtnText.textContent = 'Copiado!';
        showToast('Configurações copiadas para a área de transferência!');

        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copiar Configurações';
        }, 2500);
      } catch (err) {
        // Fallback seguro caso o navegador bloqueie a API Clipboard (ex: HTTP local)
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          showToast('Configurações copiadas!');
        } catch (fallbackErr) {
          showToast('Não foi possível copiar automaticamente.');
        }
        document.body.removeChild(textarea);
      }
    });
  }

  // =========================================================================
  // 4. ANO ATUAL NO RODAPÉ
  // =========================================================================
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});
