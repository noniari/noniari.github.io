const timelineData = [
  {id: 'intro', time: '00:00', title: 'Введение', text: 'Цель доклада и роль архитектуры в игровой системе.'},
  {id: 'model', time: '02:00', title: 'Базовая модель', text: 'Первичная иерархия Character / Hero / Orc и первые проблемы.'},
  {id: 'design', time: '09:30', title: 'Damageable и Bellicose', text: 'Разделение обязанностей и композиция вместо feature creep.'},
  {id: 'cpp20', time: '19:00', title: 'Templates и concepts', text: 'Современный C++: поведение важнее иерархий.'},
  {id: 'conclusion', time: '46:00', title: 'Выводы', text: 'Архитектура должна выбираться под задачу.'}
];

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('site-theme');
  const defaultTheme = storedTheme || 'light';
  const root = document.documentElement;

  root.dataset.theme = defaultTheme;
  themeToggle.textContent = defaultTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема';

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = nextTheme;
    localStorage.setItem('site-theme', nextTheme);
    themeToggle.textContent = nextTheme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
  });
}

function initTimeline() {
  const timelineLists = document.querySelectorAll('.timeline-list');
  const navLinks = document.querySelectorAll('.section-nav a');

  timelineData.forEach((item) => {
    timelineLists.forEach((list) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'timeline-item';
      button.dataset.target = item.id;

      const time = document.createElement('strong');
      time.textContent = item.time;
      const title = document.createElement('p');
      title.textContent = item.title;

      button.append(time, title);
      button.addEventListener('click', () => scrollToSection(item.id));
      list.append(button);
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = link.getAttribute('href').slice(1);
      scrollToSection(target);
    });
  });
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function initSectionObserver() {
  const sections = document.querySelectorAll('main .content-section');
  const navLinks = document.querySelectorAll('.section-nav a');
  const timelineButtons = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;

      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });

      timelineButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.target === id);
      });
    });
  }, {
    root: null,
    threshold: 0.3,
  });

  sections.forEach((section) => observer.observe(section));
}

function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('active'));
      panels.forEach((panel) => panel.classList.remove('active'));

      button.classList.add('active');
      const targetPanel = document.getElementById(button.dataset.tab);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      const panel = trigger.nextElementSibling;
      if (panel) {
        panel.style.maxHeight = !expanded ? `${panel.scrollHeight}px` : '0';
      }
    });
  });
}

function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const targetId = button.dataset.copyTarget;
      const codeElement = document.getElementById(targetId);
      if (!codeElement) return;

      try {
        await navigator.clipboard.writeText(codeElement.textContent);
        const previous = button.textContent;
        button.textContent = 'Скопировано';
        setTimeout(() => {
          button.textContent = previous;
        }, 1200);
      } catch {
        button.textContent = 'Ошибка';
        setTimeout(() => {
          button.textContent = 'Копировать код';
        }, 1200);
      }
    });
  });
}

function initPage() {
  initTheme();
  initTimeline();
  initSectionObserver();
  initTabs();
  initAccordion();
  initCopyButtons();
}

window.addEventListener('DOMContentLoaded', initPage);
