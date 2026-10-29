(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  $('#yr').textContent = new Date().getFullYear();

  // Theme (remembers choice)
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.dataset.theme = saved;
  else if (matchMedia('(prefers-color-scheme: dark)').matches) root.dataset.theme = 'dark';
  $('#theme').onclick = () => { const t = root.dataset.theme === 'dark' ? 'light' : 'dark'; root.dataset.theme = t; localStorage.setItem('theme', t); };

  // Mobile menu
  $('#burger').onclick = () => $('#links').classList.toggle('open');
  $$('#links a').forEach(a => a.onclick = () => $('#links').classList.remove('open'));

  // Scroll progress + active link
  const secs = $$('main section[id]'), links = $$('#links a');
  addEventListener('scroll', () => {
    const h = document.documentElement;
    $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
    let cur = '';
    secs.forEach(s => { if (s.getBoundingClientRect().top < 140) cur = s.id; });
    links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
  }, { passive: true });

  // Cursor glow
  addEventListener('pointermove', e => { const g = $('#glow'); g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; });

  // Typing effect — edit these lines
  const lines = ['building REST APIs with Node.js & FastAPI', 'designing databases that scale', 'solving problems on LeetCode', 'shipping full-stack apps end to end'];
  let li = 0, ci = 0, del = false; const el = $('#type');
  (function tick() {
    const w = lines[li];
    el.textContent = w.slice(0, ci);
    if (!del && ci++ === w.length) { del = true; return setTimeout(tick, 1600); }
    if (del && --ci === 0) { del = false; li = (li + 1) % lines.length; }
    setTimeout(tick, del ? 28 : 55);
  })();

  // Reveal on scroll + counters + chart animations
  $$('.project,.job,.cert,.stats,.ach li,.facts div,.skill-rows>div,.edu').forEach(e => e.classList.add('rv'));
  $$('.bars').forEach(b => $$('i', b).forEach((i, n) => i.style.setProperty('--i', n)));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-n]', e.target).forEach(c => {
      const n = +c.dataset.n, s = c.dataset.suffix || ''; let v = 0;
      const t = setInterval(() => { v += Math.ceil(n / 40); if (v >= n) { v = n; clearInterval(t); } c.textContent = v + s; }, 30);
    });
  }), { threshold: .2 });
  $$('.rv').forEach(e => io.observe(e));

  // 3D tilt on project previews
  $$('.tilt').forEach(t => {
    const m = $('.mock', t);
    t.addEventListener('pointermove', e => { const r = t.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; m.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg)`; });
    t.addEventListener('pointerleave', () => m.style.transform = '');
  });

  // Copy email
  $('#copy').onclick = async () => {
    try { await navigator.clipboard.writeText($('#mailtxt').textContent); $('#copy').textContent = '✓'; setTimeout(() => $('#copy').textContent = '⧉', 1500); } catch { }
  };

  // Contact form -> EmailJS
emailjs.init({
  publicKey: "5SFJuBlZhbbFLymYF"
});

$('#form').addEventListener('submit', async e => {
  e.preventDefault();

  const form = e.target;
  const status = $('#status');
  const button = $('#send');

  button.disabled = true;
  button.textContent = 'Sending…';
  status.className = '';
  status.textContent = '';

  try {
    await emailjs.sendForm(
      'service_50g2jbg',
      'template_byn02xc',
      form
    );

    status.className = 'ok-t';
    status.textContent = 'Message sent successfully! I’ll reply soon.';
    form.reset();

  } catch (error) {
    console.error('EmailJS error:', error);

    status.className = 'err-t';
    status.textContent =
      'Could not send the message. Please email me directly at unmeshkulkarni205@gmail.com.';
  } finally {
    button.disabled = false;
    button.textContent = 'Send message';
  }
});
  // ===== Game: Squash the bugs =====
  const arena = $('#arena'), msg = $('#msg'), sc = $('#score'), tm = $('#time'), bs = $('#best');
  let score = 0, time = 30, run = false, spawnT, clockT, best = +localStorage.getItem('bugBest') || 0;
  bs.textContent = best;
  const bugs = ['🐛', '🐞', '🦗', '🪲'];
  function spawn() {
    if (!run) return;
    const ok = Math.random() < .2, b = document.createElement('span');
    b.className = 'bug' + (ok ? ' ok' : ''); b.textContent = ok ? '🟢' : bugs[Math.floor(Math.random() * bugs.length)];
    b.style.left = Math.random() * (arena.clientWidth - 44) + 'px'; b.style.top = Math.random() * (arena.clientHeight - 44) + 'px';
    b.onpointerdown = ev => {
      ev.stopPropagation();
      score += ok ? -5 : 1; if (score < 0) score = 0; sc.textContent = score;
      const p = document.createElement('span'); p.className = 'pts'; p.textContent = ok ? '-5 (that was a feature!)' : '+1'; p.style.cssText = `left:${b.offsetLeft}px;top:${b.offsetTop}px;color:${ok ? '#f87171' : '#16a34a'}`;
      arena.append(p); setTimeout(() => p.remove(), 800);
      b.classList.add('dead'); setTimeout(() => b.remove(), 160);
    };
    arena.append(b); setTimeout(() => b.remove(), 1300 + Math.random() * 600);
    spawnT = setTimeout(spawn, Math.max(260, 650 - score * 8));
  }
  function end() {
    run = false; clearTimeout(spawnT); clearInterval(clockT); $$('.bug', arena).forEach(b => b.remove());
    if (score > best) { best = score; localStorage.setItem('bugBest', best); bs.textContent = best; }
    msg.style.display = 'grid';
    msg.textContent = `Deploy complete!\nYou squashed ${score} bugs.\n` + (score >= 25 ? 'Senior engineer energy. Hire this person (me).' : score >= 12 ? 'Solid QA instincts.' : 'Tests are still failing. Try again?');
    $('#start').textContent = 'Play again';
  }
  $('#start').onclick = () => {
    score = 0; time = 30; run = true; sc.textContent = 0; tm.textContent = 30; msg.style.display = 'none'; $('#start').textContent = 'Restart';
    clearTimeout(spawnT); clearInterval(clockT); $$('.bug', arena).forEach(b => b.remove());
    spawn(); clockT = setInterval(() => { tm.textContent = --time; if (time <= 0) end(); }, 1000);
  };
  // Easter egg: Konami code
  const k = [38,38,40,40,37,39,37,39,66,65]; let ki = 0;
  addEventListener('keydown', e => { ki = e.keyCode === k[ki] ? ki + 1 : 0; if (ki === k.length) { ki = 0; root.style.setProperty('--accent', '#e11d8f'); alert('Konami code unlocked: hot-pink mode. Reload to undo.'); } });
    // ===== Interactive skills (edit the list below) =====
  const CATS = { all: 'All', lang: 'Languages', web: 'Web & Backend', data: 'Data & Databases', cloud: 'Cloud & Tools', core: 'Core concepts' };
  const COLORS = { lang: '#2f4bd6', web: '#0f8f62', data: '#c96a00', cloud: '#0e7490', core: '#d6336c' };
  // [name, category, [where I used it]]
  const SKILLS = [
    ['C++', 'lang', ['Data Structures & Algorithms (Abdul Bari course)', 'Problem solving']],
    ['Python', 'lang', ['ShortLink', 'Technosys internship: data scripts & automation', '100 Days of Code bootcamp']],
    ['Java', 'lang', ['Object-oriented programming', 'Coursework']],
    ['JavaScript', 'lang', ['PulseSentinel', 'DealDrop', 'IEC internship']],
    ['TypeScript', 'lang', ['Typed web development']],
    ['SQL', 'lang', ['PulseSentinel', 'ShortLink', 'Technosys internship: query optimization']],
    ['React', 'web', ['PulseSentinel dashboard', 'IEC internship web app']],
    ['Node.js', 'web', ['PulseSentinel', 'DealDrop', 'IEC internship']],
    ['Express.js', 'web', ['PulseSentinel REST API']],
    ['Next.js', 'web', ['DealDrop']],
    ['FastAPI', 'web', ['ShortLink REST API']],
    ['REST APIs', 'web', ['PulseSentinel', 'ShortLink', 'Technosys & IEC internships']],
    ['Pandas', 'data', ['Technosys internship: dataset processing']],
    ['NumPy', 'data', ['Technosys internship: data analysis']],
    ['Power BI', 'data', ['Technosys internship: operational dashboards']],
    ['MySQL', 'data', ['PulseSentinel', 'IEC internship']],
    ['PostgreSQL', 'data', ['ShortLink', 'Technosys internship']],
    ['MongoDB', 'data', ['NoSQL databases']],
    ['AWS', 'cloud', ['DealDrop deployment', 'AWS Cloud Club workshops']],
    ['GCP', 'cloud', ['Cloud platform fundamentals']],
    ['Vercel', 'cloud', ['DealDrop deployment']],
    ['Docker', 'cloud', ['ShortLink containerization']],
    ['Git & GitHub', 'cloud', ['Every project']],
    ['Pytest', 'cloud', ['ShortLink unit & API tests']],
    ['Web Scraping', 'cloud', ['DealDrop price pipeline']],
    ['Data Structures & Algorithms', 'core', ['Udemy DSA certification', 'LeetCode practice']],
    ['OOP', 'core', ['Java & C++ coursework']],
    ['Unit Testing', 'core', ['PulseSentinel', 'ShortLink']],
    ['Web Security', 'core', ['SSRF protection in PulseSentinel', 'JWT auth in ShortLink', 'Input validation at IEC']],
    ['Backend Development', 'core', ['PulseSentinel', 'ShortLink', 'DealDrop']],
    ['Database Management', 'core', ['Schemas, foreign keys & indexes in my projects']]
  ];
  const tabs = $('#skTabs'), grid = $('#skGrid'), det = $('#skDetail');
  let cat = 'all', sel = null;
  function drawSkills() {
    grid.innerHTML = '';
    SKILLS.filter(s => cat === 'all' || s[1] === cat).forEach((s, i) => {
      const b = document.createElement('button');
      b.className = 'sk' + (sel === s[0] ? ' on' : ''); b.textContent = s[0];
      b.style.setProperty('--c', COLORS[s[1]]); b.style.animationDelay = i * 25 + 'ms';
      b.onclick = () => {
        sel = s[0]; $$('.sk', grid).forEach(x => x.classList.toggle('on', x === b));
        det.classList.add('live'); $('#skName').textContent = s[0];
        $('#skUse').textContent = 'Where I\u2019ve used it:';
        const old = $('.chips', det); if (old) old.remove();
        const c = document.createElement('div'); c.className = 'chips';
        s[2].forEach(u => { const sp = document.createElement('span'); sp.textContent = u; c.append(sp); });
        det.append(c);
      };
      grid.append(b);
    });
  }
  Object.keys(CATS).forEach(k => {
    const n = k === 'all' ? SKILLS.length : SKILLS.filter(s => s[1] === k).length;
    const b = document.createElement('button');
    b.innerHTML = CATS[k] + '<b>' + n + '</b>'; if (k === 'all') b.className = 'on';
    b.onclick = () => { cat = k; $$('button', tabs).forEach(x => x.classList.toggle('on', x === b)); drawSkills(); };
    tabs.append(b);
  });
  drawSkills();
    // Live Pune time in footer
  const pt = $('#puneTime');
  const clock = () => pt.textContent = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' });
  clock(); setInterval(clock, 30000);
})();
