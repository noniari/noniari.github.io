const timelineDataOrca = [
  {id: 'intro', time: '00:00', title: 'Введение', text: 'Доклад о дизайне, не о разработке игр.'},
  {id: 'model', time: '02:00', title: 'Character / Hero / Orc', text: 'Первые классы, private inheritance и первые архитектурные ошибки.'},
  {id: 'design', time: '09:30', title: 'Damageable и Bellicose', text: 'Решение через разделение обязанностей и композицию.'},
  {id: 'cpp20', time: '19:00', title: 'Templates / Concepts', text: 'Новые способы выразить поведение без иерархии.'},
  {id: 'variant', time: '27:00', title: 'std::variant / std::visit', text: 'Группирование разных типов без virtual dispatch.'},
  {id: 'battle', time: '35:00', title: 'Массовые битвы', text: 'Команды героев и монстров, типы оружия и заклинаний.'},
  {id: 'conclusion', time: '46:00', title: 'Выводы', text: 'Архитектурные выборы зависят от задачи и поддержки.'}
];

const timelineDataProfiling = [
  {id: 'intro', time: '00:00', title: 'Введение', text: 'Филипп и Влад представляют доклад о профилировании в Леста Игры.'},
  {id: 'overview', time: '04:40', title: 'Виды профилирования', text: 'Sampling и instrumentation для игровых движков.'},
  {id: 'architecture', time: '10:01', title: 'Архитектура профайлера', text: 'Многоуровневая система профилирования Леста Игры.'},
  {id: 'profiling', time: '17:14', title: 'CPU Profiling', text: 'RDTSC, RAII и многопоточность для CPU-профайлинга.'},
  {id: 'gpu', time: '26:28', title: 'GPU Profiling и ETW', text: 'Timestamp queries, DirectX hooking и Event Tracing for Windows.'},
  {id: 'conclusion', time: '54:52', title: 'Заключение', text: 'Ключевые выводы по профилированию игр.'}
];

function getTimelineData() {
  const pageType = document.body.dataset.page || 'orca';
  return pageType === 'profiling' ? timelineDataProfiling : timelineDataOrca;
}

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

  const speakerPhoto = document.getElementById('speakerPhoto');
  if (speakerPhoto) {
    speakerPhoto.addEventListener('error', () => {
      speakerPhoto.src = 'patrice-roy.svg';
    });
  }
}

function initTimeline() {
  const timelineData = getTimelineData();
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
