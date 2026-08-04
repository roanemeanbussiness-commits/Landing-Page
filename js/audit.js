/* ============================================================
   Free Business Audit — questionnaire + audit engine
   Deterministic, benchmark-backed. No backend required.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- QUESTIONS ---------------- */
  const QUESTIONS = [
    {
      id: 'industry', title: 'What kind of business do you run?',
      opts: [
        { v: 'home', t: 'Home services', s: 'Pools, landscaping, cleaning, HVAC...' },
        { v: 'trades', t: 'Construction / trades' },
        { v: 'realestate', t: 'Real estate' },
        { v: 'ecom', t: 'E-commerce / retail' },
        { v: 'agency', t: 'Agency / professional services' },
        { v: 'health', t: 'Health & wellness' },
        { v: 'food', t: 'Restaurant / hospitality' },
        { v: 'other', t: 'Something else' }
      ]
    },
    {
      id: 'teamSize', title: 'How big is your team?',
      opts: [
        { v: 'solo', t: 'Just me' },
        { v: 's2', t: '2 – 5 people' },
        { v: 's6', t: '6 – 15 people' },
        { v: 's16', t: '16 – 50 people' },
        { v: 's50', t: '50+ people' }
      ]
    },
    {
      id: 'revenue', title: 'Roughly, what is your annual revenue?',
      hint: 'This only calibrates your numbers. It stays on this page.',
      opts: [
        { v: 'r0', t: 'Under $100k' },
        { v: 'r1', t: '$100k – $250k' },
        { v: 'r2', t: '$250k – $1M' },
        { v: 'r3', t: '$1M – $5M' },
        { v: 'r4', t: '$5M+' },
        { v: 'rx', t: 'Prefer not to say' }
      ]
    },
    {
      id: 'custVal', title: 'What is one new customer worth to you, on average?',
      hint: 'Think of a typical job, order, or client.',
      opts: [
        { v: 'c0', t: 'Under $100' },
        { v: 'c1', t: '$100 – $500' },
        { v: 'c2', t: '$500 – $2,000' },
        { v: 'c3', t: '$2,000 – $10,000' },
        { v: 'c4', t: '$10,000+' }
      ]
    },
    {
      id: 'leadsWk', title: 'How many new leads or inquiries come in each week?',
      hint: 'Calls, forms, DMs, walk-ins. Your best guess is fine.',
      opts: [
        { v: 'l0', t: 'Under 5' },
        { v: 'l1', t: '5 – 15' },
        { v: 'l2', t: '15 – 40' },
        { v: 'l3', t: '40 – 100' },
        { v: 'l4', t: '100+' }
      ]
    },
    {
      id: 'respTime', title: 'How fast does a new lead usually get a response?',
      opts: [
        { v: 't0', t: 'Within 5 minutes' },
        { v: 't1', t: 'Within the hour' },
        { v: 't2', t: 'Within a few hours' },
        { v: 't3', t: 'Within a day' },
        { v: 't4', t: 'Longer, honestly it varies' }
      ]
    },
    {
      id: 'missedCalls', title: 'What happens when a call comes in and you cannot answer?',
      opts: [
        { v: 'm0', t: 'We answer nearly every call' },
        { v: 'm1', t: 'Voicemail catches them', s: 'Most callers never leave one' },
        { v: 'm2', t: 'They ring out, calls get missed a lot' },
        { v: 'm3', t: 'We barely take calls' }
      ]
    },
    {
      id: 'adminHours', title: 'How many hours a week go to repetitive admin?',
      hint: 'Across your whole team: scheduling, invoicing, follow-ups, data entry, paperwork.',
      opts: [
        { v: 'a0', t: 'Under 5 hours' },
        { v: 'a1', t: '5 – 10 hours' },
        { v: 'a2', t: '10 – 20 hours' },
        { v: 'a3', t: '20 – 40 hours' },
        { v: 'a4', t: '40+ hours' }
      ]
    },
    {
      id: 'timeEaters', title: 'Which of these eat the most time?', multi: true,
      hint: 'Select all that apply.',
      opts: [
        { v: 'calls', t: 'Answering calls & questions' },
        { v: 'chasing', t: 'Chasing & following up leads' },
        { v: 'sched', t: 'Scheduling & booking' },
        { v: 'invoice', t: 'Invoicing & payments' },
        { v: 'content', t: 'Content & social media' },
        { v: 'quotes', t: 'Quotes & estimates' },
        { v: 'data', t: 'Data entry & paperwork' }
      ]
    },
    {
      id: 'content', title: 'How do you handle content and social media?',
      opts: [
        { v: 'agency', t: 'We pay someone or an agency' },
        { v: 'diy', t: 'We do it ourselves' },
        { v: 'barely', t: 'We barely post' },
        { v: 'none', t: 'Not relevant to us' }
      ]
    },
    {
      id: 'awayTest', title: 'If you disappeared for two weeks, what happens?',
      opts: [
        { v: 'fine', t: 'It runs fine without me' },
        { v: 'slows', t: 'Things slow down noticeably' },
        { v: 'breaks', t: 'Things start breaking' },
        { v: 'chaos', t: 'Complete chaos' }
      ]
    },
    {
      id: 'goal', title: 'What do you want most right now?',
      opts: [
        { v: 'time', t: 'Buy back my time' },
        { v: 'sales', t: 'More leads & sales' },
        { v: 'scale', t: 'Scale without hiring' },
        { v: 'auto', t: 'A business that runs without me' }
      ]
    }
  ];

  /* ---------------- BENCHMARK VALUES ---------------- */
  const HOURLY = { r0: 35, r1: 50, r2: 75, r3: 110, r4: 150, rx: 60 };
  const REV_MID = { r0: 60000, r1: 175000, r2: 600000, r3: 2500000, r4: 7000000, rx: 400000 };
  const CUST_MID = { c0: 60, c1: 300, c2: 1200, c3: 5000, c4: 15000 };
  const LEADS_MID = { l0: 3, l1: 10, l2: 27, l3: 70, l4: 130 };
  const SLOW_LOSS = { t0: 0, t1: 0.08, t2: 0.15, t3: 0.24, t4: 0.30 };   // share of leads that go cold from slow response
  const MISS_SHARE = { m0: 0.03, m1: 0.15, m2: 0.30, m3: 0 };            // share of inbound effectively lost to missed calls
  const ADMIN_MID = { a0: 3, a1: 7, a2: 15, a3: 30, a4: 45 };
  const AWAY_FACTOR = { fine: 0, slows: 0.008, breaks: 0.015, chaos: 0.02 };
  const CLOSE_RATE = 0.25;        // conservative close rate on recaptured leads
  const RECAPTURE = 0.6;          // share of lost leads an always-on agent realistically recovers
  const AUTOMATABLE = 0.6;        // share of repetitive admin an agent can take over

  /* ---------------- STATE ---------------- */
  const answers = {};
  let idx = 0;

  const $ = function (id) { return document.getElementById(id); };
  const screens = { intro: $('intro'), quiz: $('quiz'), analyzing: $('analyzing'), report: $('report') };

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].classList.toggle('active', k === name); });
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  function setProgress() {
    $('progressLabel').textContent = Math.min(idx + 1, QUESTIONS.length) + ' / ' + QUESTIONS.length;
    $('progressBar').style.width = ((idx) / QUESTIONS.length * 100) + '%';
  }

  /* ---------------- QUIZ RENDER ---------------- */
  function renderQuestion() {
    const q = QUESTIONS[idx];
    $('qEyebrow').textContent = 'QUESTION ' + (idx + 1) + ' OF ' + QUESTIONS.length;
    $('qTitle').textContent = q.title;
    $('qHint').textContent = q.hint || '';
    $('qHint').style.display = q.hint ? '' : 'none';
    const box = $('qOptions');
    box.innerHTML = '';
    const cur = answers[q.id];
    q.opts.forEach(function (o) {
      const b = document.createElement('button');
      b.className = 'q-opt';
      b.type = 'button';
      b.innerHTML = o.t + (o.s ? '<small>' + o.s + '</small>' : '');
      const isSel = q.multi ? (cur || []).indexOf(o.v) !== -1 : cur === o.v;
      if (isSel) b.classList.add('sel');
      b.addEventListener('click', function () {
        if (q.multi) {
          const arr = answers[q.id] = answers[q.id] || [];
          const at = arr.indexOf(o.v);
          if (at === -1) arr.push(o.v); else arr.splice(at, 1);
          b.classList.toggle('sel');
          $('nextBtn').disabled = arr.length === 0;
        } else {
          answers[q.id] = o.v;
          box.querySelectorAll('.q-opt').forEach(function (x) { x.classList.remove('sel'); });
          b.classList.add('sel');
          $('nextBtn').disabled = false;
          setTimeout(next, 260); // auto-advance on single select
        }
      });
      box.appendChild(b);
    });
    $('nextBtn').disabled = q.multi ? !(cur && cur.length) : !cur;
    $('backBtn').style.visibility = idx === 0 ? 'hidden' : 'visible';
    setProgress();
    window.scrollTo({ top: 0 }); // each question starts at the top of the screen
  }

  function next() {
    if (idx < QUESTIONS.length - 1) { idx++; renderQuestion(); }
    else { runAnalysis(); }
  }
  function back() { if (idx > 0) { idx--; renderQuestion(); } }

  /* ---------------- AUDIT ENGINE ---------------- */
  function computeAudit(a) {
    const hourly = HOURLY[a.revenue] || 60;
    const custVal = CUST_MID[a.custVal] || 300;
    const leadsWk = LEADS_MID[a.leadsWk] || 10;
    const eaters = a.timeEaters || [];

    // Leak 1: missed calls
    var missedDealsWk = leadsWk * (MISS_SHARE[a.missedCalls] || 0) * RECAPTURE * CLOSE_RATE;
    var missedLeak = missedDealsWk * custVal * 52;

    // Leak 2: slow lead follow-up
    var slowDealsWk = leadsWk * (SLOW_LOSS[a.respTime] || 0) * RECAPTURE * CLOSE_RATE;
    var slowLeak = slowDealsWk * custVal * 52;

    // Cap combined lead-side leak so the two channels never double-count
    var leadCap = leadsWk * 0.35 * CLOSE_RATE * custVal * 52;
    var leadTotal = missedLeak + slowLeak;
    if (leadTotal > leadCap && leadTotal > 0) {
      var scale = leadCap / leadTotal;
      missedLeak *= scale; slowLeak *= scale;
    }

    // Leak 3: repetitive admin
    var adminWk = ADMIN_MID[a.adminHours] || 7;
    var savedHrsWk = adminWk * AUTOMATABLE;
    var adminLeak = savedHrsWk * 52 * hourly;

    // Leak 4: content
    var contentLeak = 0, contentHrsWk = 0;
    if (a.content === 'agency') contentLeak = 900 * 12 * 0.5;
    else if (a.content === 'diy') { contentHrsWk = 4; contentLeak = contentHrsWk * hourly * 52 * 0.7; }

    // Leak 5: owner dependence
    var ownerLeak = Math.min((REV_MID[a.revenue] || 400000) * (AWAY_FACTOR[a.awayTest] || 0), 48000);

    var annual = Math.round(missedLeak + slowLeak + adminLeak + contentLeak + ownerLeak);
    var hoursYr = Math.round((savedHrsWk + contentHrsWk) * 52);

    /* system recommendations */
    var systems = [];
    if ((a.missedCalls === 'm1' || a.missedCalls === 'm2') || eaters.indexOf('calls') !== -1) {
      systems.push({ ic: '📞', t: 'AI Voice Agent', p: 'Answers every call in your voice and your rules. Books, quotes, routes. No caller hits voicemail again.', tag: 'PLUGS CALL LEAK' });
    }
    if (a.respTime !== 't0' || eaters.indexOf('chasing') !== -1) {
      systems.push({ ic: '⚡', t: 'Speed-to-Lead Agent', p: 'Replies to every new lead in under 60 seconds and follows up until they book. Responding in 5 minutes converts up to 21x better.', tag: 'PLUGS FOLLOW-UP LEAK' });
    }
    if (adminWk >= 5 || eaters.indexOf('sched') !== -1 || eaters.indexOf('invoice') !== -1 || eaters.indexOf('data') !== -1 || eaters.indexOf('quotes') !== -1) {
      systems.push({ ic: '🗂️', t: 'Ops Automation Suite', p: 'Scheduling, invoicing, quotes, and paperwork handled end to end, the exact way you do it today.', tag: 'PLUGS ADMIN DRAIN' });
    }
    if (a.content === 'agency' || a.content === 'diy' || a.content === 'barely' || eaters.indexOf('content') !== -1) {
      systems.push({ ic: '🎬', t: 'Content Manager Agent', p: 'Plans, writes, and posts in your voice on a schedule. Your presence keeps compounding without your hours.', tag: 'PLUGS CONTENT DRAIN' });
    }
    systems.push({ ic: '🧠', t: 'The Full Operator, your clone', p: 'The flagship. We map how you think and decide, then it runs your departments the way you would. This is the system the others report to.', tag: 'FLAGSHIP' });

    return {
      annual: annual, five: annual * 5, hoursYr: hoursYr,
      leaks: [
        missedLeak > 500 ? { amt: missedLeak, t: 'Missed-call leak', p: 'Callers who never reach you and buy elsewhere. 62% of small business calls go unanswered, and 85% of missed callers never call back.' } : null,
        slowLeak > 500 ? { amt: slowLeak, t: 'Slow follow-up leak', p: 'Leads that went cold before you replied. 78% of customers buy from whoever responds first.' } : null,
        adminLeak > 500 ? { amt: adminLeak, t: 'Admin drain', p: Math.round(savedHrsWk) + ' automatable hours a week going to scheduling, invoicing, and paperwork instead of growth.' } : null,
        contentLeak > 500 ? { amt: contentLeak, t: 'Content drain', p: a.content === 'agency' ? 'What you overpay for content that an agent trained on your voice can produce on schedule.' : 'The value of hours you spend making content yourself.' } : null,
        ownerLeak > 500 ? { amt: ownerLeak, t: 'Owner-dependence drag', p: 'The cost of everything routing through you. The business slows or stops whenever you step away.' } : null
      ].filter(Boolean),
      systems: systems
    };
  }

  /* ---------------- ANALYSIS ANIMATION ---------------- */
  function runAnalysis() {
    show('analyzing');
    $('progressBar').style.width = '100%';
    const steps = Array.prototype.slice.call($('scanSteps').children);
    var i = 0;
    (function tick() {
      steps.forEach(function (li, k) {
        li.classList.toggle('done', k < i);
        li.classList.toggle('now', k === i);
      });
      i++;
      if (i <= steps.length) setTimeout(tick, 620);
      else setTimeout(showReport, 350);
    })();
  }

  /* ---------------- REPORT ---------------- */
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  function countUp(el, target, formatter, dur) {
    dur = dur || 1400;
    var start = performance.now();
    function step(now) {
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatter(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    setTimeout(function () { el.textContent = formatter(target); }, dur + 150);
  }

  function showReport() {
    const r = computeAudit(answers);
    show('report');

    const industryNames = { home: 'home services', trades: 'construction', realestate: 'real estate', ecom: 'e-commerce', agency: 'agency', health: 'health & wellness', food: 'hospitality', other: '' };
    const ind = industryNames[answers.industry] || '';
    $('reportIntro').textContent = 'Based on your answers' + (ind ? ' and benchmarks for ' + ind + ' businesses' : '') +
      ', here is what running everything manually is costing you, and the systems that would win it back.';

    countUp($('totalAnnual'), r.annual, money, 1600);
    $('totalFive').textContent = money(r.five);
    $('totalHours').textContent = r.hoursYr.toLocaleString('en-US') + ' hours';

    const grid = $('leakGrid');
    grid.innerHTML = '';
    r.leaks.forEach(function (lk) {
      const d = document.createElement('div');
      d.className = 'r-leak';
      d.innerHTML = '<div class="amt">' + money(lk.amt) + ' <em>/ yr</em></div><h4>' + lk.t + '</h4><p>' + lk.p + '</p>';
      grid.appendChild(d);
    });

    const sys = $('sysGrid');
    sys.innerHTML = '';
    r.systems.forEach(function (s) {
      const d = document.createElement('div');
      d.className = 'r-sys';
      d.innerHTML = '<div class="ic">' + s.ic + '</div><div><h4>' + s.t + '</h4><p>' + s.p + '</p></div><span class="tag">' + s.tag + '</span>';
      sys.appendChild(d);
    });

    // savings bars
    $('bar1v').textContent = money(r.annual);
    $('bar3v').textContent = money(r.annual * 3);
    $('bar5v').textContent = money(r.five);
    setTimeout(function () {
      $('bar1').style.height = Math.max(18, (r.annual / r.five) * 100) + '%';
      $('bar3').style.height = Math.max(18, (r.annual * 3 / r.five) * 100) + '%';
      $('bar5').style.height = '100%';
    }, 250);
  }

  /* ---------------- WIRING ---------------- */
  $('startBtn').addEventListener('click', function () { idx = 0; show('quiz'); renderQuestion(); });
  $('nextBtn').addEventListener('click', next);
  $('backBtn').addEventListener('click', back);
  $('restartBtn').addEventListener('click', function () {
    Object.keys(answers).forEach(function (k) { delete answers[k]; });
    idx = 0; $('progressBar').style.width = '0%';
    show('quiz'); renderQuestion();
  });

})();
