/* =========================================================
   Vaskeliste Kollektivet - Application Logic
   ========================================================= */

// Calculate current ISO week number (ISO-8601 standard: Monday is first day of week)
function getRealCurrentISOWeek(date = new Date()) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  target.setDate(target.getDate() - dayNr + 3); // Nearest Thursday
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

// Calculate Norwegian date range for any ISO year and week
function calculateISOWeekDateRange(year, week) {
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = new Date(simple);
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }
  const ISOweekEnd = new Date(ISOweekStart);
  ISOweekEnd.setDate(ISOweekStart.getDate() + 6);

  const startMonth = ISOweekStart.toLocaleDateString('no-NO', { month: 'long' });
  const endMonth = ISOweekEnd.toLocaleDateString('no-NO', { month: 'long' });
  const startDay = ISOweekStart.getDate();
  const endDay = ISOweekEnd.getDate();

  return `${startDay}. ${startMonth} – ${endDay}. ${endMonth}`;
}

// Generate full year weeks (Weeks 1 to 52)
function generateYearWeeks(year) {
  const weeks = [];
  // Spring: weeks 1 to 26
  for (let w = 1; w <= 26; w++) {
    weeks.push({
      id: `${year}_${w}`,
      year: year,
      week: w,
      dates: calculateISOWeekDateRange(year, w),
      semester: `Vår ${year}`
    });
  }
  // Autumn: weeks 27 to 52
  for (let w = 27; w <= 52; w++) {
    weeks.push({
      id: `${year}_${w}`,
      year: year,
      week: w,
      dates: calculateISOWeekDateRange(year, w),
      semester: `Høst ${year}`
    });
  }
  return weeks;
}

// Format Date object to 'YYYY-MM-DD'
function formatDateToInputString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Format ISO date string 'YYYY-MM-DD' to Norwegian friendly display
function formatNorwegianDate(dateInput) {
  if (!dateInput) return 'Ikke registrert ennå';
  
  let dateObj;
  if (typeof dateInput === 'string' && dateInput.includes('-')) {
    const parts = dateInput.split('-');
    dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else {
    dateObj = new Date(dateInput);
  }

  if (isNaN(dateObj.getTime())) return 'Ugyldig dato';

  const today = new Date();
  const todayReset = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const targetReset = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  const diffDays = Math.round((todayReset - targetReset) / (1000 * 60 * 60 * 24));

  const standardDateStr = dateObj.toLocaleDateString('no-NO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  if (diffDays === 0) return `I dag (${standardDateStr})`;
  if (diffDays === 1) return `I går (${standardDateStr})`;
  if (diffDays === -1) return `I morgen (${standardDateStr})`;
  if (diffDays > 1 && diffDays <= 14) return `${diffDays} dager siden (${standardDateStr})`;

  return standardDateStr;
}

// Default Roommates
const DEFAULT_ROOMMATES = [
  { id: '1', name: 'Eirik', colorIndex: 1 },
  { id: '2', name: 'Romkamerat 2', colorIndex: 2 },
  { id: '3', name: 'Romkamerat 3', colorIndex: 3 }
];

// Base Semester Weeks: Autumn 2026 expanded through week 52
const BASE_SEMESTER_WEEKS = [
  { id: '2026_36', year: 2026, week: 36, dates: '31. august – 6. september', semester: 'Høst 2026' },
  { id: '2026_37', year: 2026, week: 37, dates: '7. september – 13. september', semester: 'Høst 2026' },
  { id: '2026_38', year: 2026, week: 38, dates: '14. september – 20. september', semester: 'Høst 2026' },
  { id: '2026_39', year: 2026, week: 39, dates: '21. september – 27. september', semester: 'Høst 2026' },
  { id: '2026_40', year: 2026, week: 40, dates: '28. september – 4. oktober', semester: 'Høst 2026' },
  { id: '2026_41', year: 2026, week: 41, dates: '5. oktober – 11. oktober', semester: 'Høst 2026' },
  { id: '2026_42', year: 2026, week: 42, dates: '12. oktober – 18. oktober', semester: 'Høst 2026' },
  { id: '2026_43', year: 2026, week: 43, dates: '19. oktober – 25. oktober', semester: 'Høst 2026' },
  { id: '2026_44', year: 2026, week: 44, dates: '26. oktober – 1. november', semester: 'Høst 2026' },
  { id: '2026_45', year: 2026, week: 45, dates: '2. november – 8. november', semester: 'Høst 2026' },
  { id: '2026_46', year: 2026, week: 46, dates: '9. november – 15. november', semester: 'Høst 2026' },
  { id: '2026_47', year: 2026, week: 47, dates: '16. november – 22. november', semester: 'Høst 2026' },
  { id: '2026_48', year: 2026, week: 48, dates: '23. november – 29. november', semester: 'Høst 2026' },
  { id: '2026_49', year: 2026, week: 49, dates: '30. november – 6. desember', semester: 'Høst 2026' },
  { id: '2026_50', year: 2026, week: 50, dates: '7. desember – 13. desember', semester: 'Høst 2026' },
  { id: '2026_51', year: 2026, week: 51, dates: '14. desember – 20. desember', semester: 'Høst 2026' },
  { id: '2026_52', year: 2026, week: 52, dates: '21. desember – 27. desember', semester: 'Høst 2026' }
];

const DEFAULT_WEEKLY_TASKS = [
  { id: 'k1', category: 'kitchen', title: 'Vaske over kjøkkenbenker, spisebord og vask', tag: 'Kjøkken' },
  { id: 'k3', category: 'kitchen', title: 'Ta ut søppel, matavfall og bytte poser', tag: 'Avfall' },
  { id: 'b1', category: 'bathroom', title: 'Vaske toalettet (både inni og utenpå)', tag: 'Toalett' },
  { id: 'b2', category: 'bathroom', title: 'Vaske vasken og speilet', tag: 'Bad' },
  { id: 'b3', category: 'bathroom', title: 'Skylle og vaske veldig lett over i dusjen', tag: 'Dusj' },
  { id: 'b4', category: 'bathroom', title: 'Støvsuge gulvet på badet', tag: 'Gulv' },
  { id: 'g1', category: 'general', title: 'Støvsuge over alle fellesområder og lister', tag: 'Støvsuging' },
  { id: 'g2', category: 'general', title: 'Enkel støvtørking i fellesareal', tag: 'Støvtørking' }
];

const DEEP_CLEAN_TASKS = [
  { id: 'dc1', icon: '🧹', title: 'Vaske gulv i fellesområdet', desc: 'Vaske og moppe over alle gulv i stue, kjøkken og gang.' },
  { id: 'dc2', icon: '💧', title: 'Rense sluk', desc: 'Rense sluk grundig på bad og sjekke sluk/vannlås på kjøkken.' },
  { id: 'dc3', icon: '🧽', title: 'Dusjvegger grundig', desc: 'Fjerne kalk og såperester fra dusjglass og fliser.' },
  { id: 'dc4', icon: '🔥', title: 'Stekeovn & Mikrobølgeovn', desc: 'Vaske inni mikrobølgeovnen, og rense stekeovnen hvis nødvendig.' },
  { id: 'dc5', icon: '💨', title: 'Kjøkkenvifte & Filter', desc: 'Vaske fettfilter på kjøkkenvifte og tørke over viftehetten.' },
  { id: 'dc6', icon: '🍽️', title: 'Oppvaskmaskin (Filter & rens)', desc: 'Vaske filter i oppvaskmaskinen, vaske inni maskinen og kjøre renseprogram.' },
  { id: 'dc7', icon: '🪟', title: 'Vinduer og vinduskarmer', desc: 'Pusse vinduer i fellesområdene og tørke over karmer.' }
];

// State Manager
class CleaningAppState {
  constructor(collectiveId = 'mitt_kollektiv', collectiveName = 'Mitt Kollektiv') {
    this.collectiveId = collectiveId;
    this.collectiveName = collectiveName;
    this.storagePrefix = `vaske_${this.collectiveId}_`;

    this.roommates = this.load('vaske_roommates', DEFAULT_ROOMMATES);
    this.extraWeeks = this.load('vaske_extra_weeks', []);

    // Combine base weeks with extended/future years
    this.allWeeks = [...BASE_SEMESTER_WEEKS, ...this.extraWeeks];

    this.scheduleAssignments = this.load('vaske_schedule', this.generateInitialSchedule());

    // Dynamically calculate current ISO week and year
    const now = new Date();
    this.realCurrentWeek = getRealCurrentISOWeek(now);
    this.realCurrentYear = now.getFullYear();
    this.realCurrentId = `${this.realCurrentYear}_${this.realCurrentWeek}`;

    // Select current active week
    const currentWeekObj = this.allWeeks.find(w => w.year === this.realCurrentYear && w.week === this.realCurrentWeek);
    if (currentWeekObj) {
      this.activeWeekId = currentWeekObj.id;
    } else {
      this.activeWeekId = this.allWeeks[3]?.id || this.allWeeks[0].id;
    }

    this.semesterWeeks = this.allWeeks.map(w => ({
      ...w,
      isCurrent: w.id === this.realCurrentId || (w.week === this.realCurrentWeek && w.year === this.realCurrentYear)
    }));

    this.selectedSemesterFilter = 'all';
    this.completedTasksByWeek = this.load('vaske_completed_tasks', {});
    this.customTasksByWeek = this.load('vaske_custom_tasks', {});
    this.deepCleanHistory = this.load('vaske_deep_clean_history', {});
  }

  load(key, fallback) {
    try {
      const cleanKey = key.startsWith('vaske_') ? key.substring(6) : key;
      const scopedKey = `${this.storagePrefix}${cleanKey}`;
      const stored = localStorage.getItem(scopedKey);
      if (stored !== null) {
        return JSON.parse(stored);
      }

      // Legacy fallback for 'mitt_kollektiv' or when migrating old single-collective data
      if (this.collectiveId === 'mitt_kollektiv') {
        const legacy = localStorage.getItem(`vaske_${cleanKey}`);
        if (legacy !== null) {
          const parsed = JSON.parse(legacy);
          localStorage.setItem(scopedKey, legacy);
          return parsed;
        }
      }
      return fallback;
    } catch (e) {
      console.warn('LocalStorage load error:', e);
      return fallback;
    }
  }

  save(key, val) {
    try {
      const cleanKey = key.startsWith('vaske_') ? key.substring(6) : key;
      const scopedKey = `${this.storagePrefix}${cleanKey}`;
      localStorage.setItem(scopedKey, JSON.stringify(val));

      // Trigger cloud sync if connected
      if (typeof CloudSyncManager !== 'undefined' && CloudSyncManager.triggerSync) {
        CloudSyncManager.triggerSync(this);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  saveToStorageOnly(key, val) {
    try {
      const cleanKey = key.startsWith('vaske_') ? key.substring(6) : key;
      const scopedKey = `${this.storagePrefix}${cleanKey}`;
      localStorage.setItem(scopedKey, JSON.stringify(val));
    } catch (e) {}
  }

  applyRemoteState(data) {
    if (!data) return;
    let changed = false;

    if (Array.isArray(data.roommates) && JSON.stringify(data.roommates) !== JSON.stringify(this.roommates)) {
      this.roommates = data.roommates;
      this.saveToStorageOnly('roommates', this.roommates);
      changed = true;
    }
    if (data.completedTasks && JSON.stringify(data.completedTasks) !== JSON.stringify(this.completedTasksByWeek)) {
      this.completedTasksByWeek = data.completedTasks;
      this.saveToStorageOnly('completed_tasks', this.completedTasksByWeek);
      changed = true;
    }
    if (data.scheduleAssignments && JSON.stringify(data.scheduleAssignments) !== JSON.stringify(this.scheduleAssignments)) {
      this.scheduleAssignments = data.scheduleAssignments;
      this.saveToStorageOnly('schedule', this.scheduleAssignments);
      changed = true;
    }
    if (data.deepCleanHistory && JSON.stringify(data.deepCleanHistory) !== JSON.stringify(this.deepCleanHistory)) {
      this.deepCleanHistory = data.deepCleanHistory;
      this.saveToStorageOnly('deep_clean_history', this.deepCleanHistory);
      changed = true;
    }
    if (data.customTasks && JSON.stringify(data.customTasks) !== JSON.stringify(this.customTasksByWeek)) {
      this.customTasksByWeek = data.customTasks;
      this.saveToStorageOnly('custom_tasks', this.customTasksByWeek);
      changed = true;
    }
    if (Array.isArray(data.extraWeeks) && JSON.stringify(data.extraWeeks) !== JSON.stringify(this.extraWeeks)) {
      this.extraWeeks = data.extraWeeks;
      this.allWeeks = [...BASE_SEMESTER_WEEKS, ...this.extraWeeks];
      this.semesterWeeks = this.allWeeks.map(w => ({
        ...w,
        isCurrent: w.id === this.realCurrentId || (w.week === this.realCurrentWeek && w.year === this.realCurrentYear)
      }));
      this.saveToStorageOnly('extra_weeks', this.extraWeeks);
      changed = true;
    }

    if (changed && typeof renderAllViews === 'function') {
      renderAllViews();
    }
  }

  generateInitialSchedule() {
    const assignments = {};
    this.allWeeks.forEach((w, index) => {
      const rmIndex = index % this.roommates.length;
      assignments[w.id] = this.roommates[rmIndex].name;
      // Also map numeric week for backwards compatibility
      if (!assignments[w.week]) {
        assignments[w.week] = this.roommates[rmIndex].name;
      }
    });
    return assignments;
  }

  autoRotateSchedule() {
    this.semesterWeeks.forEach((w, index) => {
      const rmIndex = index % this.roommates.length;
      this.scheduleAssignments[w.id] = this.roommates[rmIndex].name;
      this.scheduleAssignments[w.week] = this.roommates[rmIndex].name;
    });
    this.save('vaske_schedule', this.scheduleAssignments);
  }

  getAssigneeForWeek(weekObjOrId) {
    if (!weekObjOrId) return this.roommates[0]?.name || 'Ingen';
    const id = typeof weekObjOrId === 'object' ? weekObjOrId.id : String(weekObjOrId);
    const numeric = typeof weekObjOrId === 'object' ? weekObjOrId.week : (id.includes('_') ? Number(id.split('_')[1]) : Number(id));

    const assigned = this.scheduleAssignments[id] || this.scheduleAssignments[numeric];
    if (assigned !== undefined && assigned !== null && assigned !== '') {
      return assigned;
    }
    return this.roommates[0]?.name || 'Ingen';
  }

  isTaskDone(weekId, taskId) {
    const id = String(weekId);
    const numeric = id.includes('_') ? id.split('_')[1] : id;
    const store = this.completedTasksByWeek[id] || this.completedTasksByWeek[numeric];
    return !!(store && store[taskId]);
  }

  toggleTask(weekId, taskId) {
    const id = String(weekId);
    if (!this.completedTasksByWeek[id]) {
      this.completedTasksByWeek[id] = {};
    }
    const current = !!this.completedTasksByWeek[id][taskId];
    this.completedTasksByWeek[id][taskId] = !current;
    this.save('vaske_completed_tasks', this.completedTasksByWeek);
    return !current;
  }

  setAllTasks(weekId, allDone) {
    const id = String(weekId);
    if (!this.completedTasksByWeek[id]) {
      this.completedTasksByWeek[id] = {};
    }
    const tasks = this.getTasksForWeek(id);
    tasks.forEach(t => {
      this.completedTasksByWeek[id][t.id] = allDone;
    });
    this.save('vaske_completed_tasks', this.completedTasksByWeek);
  }

  getTasksForWeek(weekId) {
    const id = String(weekId);
    const customs = this.customTasksByWeek[id] || [];
    return [...DEFAULT_WEEKLY_TASKS, ...customs];
  }

  addCustomTask(weekId, category, title) {
    const id = String(weekId);
    if (!this.customTasksByWeek[id]) {
      this.customTasksByWeek[id] = [];
    }
    const newTask = {
      id: 'custom_' + Date.now(),
      category: category,
      title: title,
      tag: 'Ekstra'
    };
    this.customTasksByWeek[id].push(newTask);
    this.save('vaske_custom_tasks', this.customTasksByWeek);
    return newTask;
  }

  saveDeepCleanEntry(taskId, dateString, completedByName, note = '') {
    this.deepCleanHistory[taskId] = {
      dateInput: dateString,
      displayDate: formatNorwegianDate(dateString),
      completedBy: completedByName || this.roommates[0].name,
      note: note.trim(),
      updatedAt: Date.now()
    };
    this.save('vaske_deep_clean_history', this.deepCleanHistory);
  }

  clearDeepCleanEntry(taskId) {
    delete this.deepCleanHistory[taskId];
    this.save('vaske_deep_clean_history', this.deepCleanHistory);
  }

  // Expand schedule to next year
  expandToNextYear() {
    const currentMaxYear = Math.max(...this.semesterWeeks.map(w => w.year));
    const nextYear = currentMaxYear + 1;

    const newWeeks = generateYearWeeks(nextYear);

    // Continue rotation from the last assigned roommate
    const lastWeek = this.semesterWeeks[this.semesterWeeks.length - 1];
    const lastPerson = this.getAssigneeForWeek(lastWeek);
    const lastIdx = this.roommates.findIndex(r => r.name === lastPerson);
    const startIdx = lastIdx >= 0 ? (lastIdx + 1) % this.roommates.length : 0;

    newWeeks.forEach((w, i) => {
      const rmIdx = (startIdx + i) % this.roommates.length;
      this.scheduleAssignments[w.id] = this.roommates[rmIdx].name;
    });

    this.extraWeeks.push(...newWeeks);
    this.save('vaske_extra_weeks', this.extraWeeks);
    this.save('vaske_schedule', this.scheduleAssignments);

    this.allWeeks = [...BASE_SEMESTER_WEEKS, ...this.extraWeeks];
    this.semesterWeeks = this.allWeeks.map(w => ({
      ...w,
      isCurrent: w.id === this.realCurrentId || (w.week === this.realCurrentWeek && w.year === this.realCurrentYear)
    }));

    renderSemesterFilterBar();
    renderScheduleTable();
    updateExpandButton();
    if (window.confetti) window.confetti({ particleCount: 75, spread: 70 });
  }

  removeYear(yearToRemove) {
    if (confirm(`Vil du fjerne alle uker for ${yearToRemove}?`)) {
      this.extraWeeks = this.extraWeeks.filter(w => w.year !== yearToRemove);
      this.save('vaske_extra_weeks', this.extraWeeks);

      this.allWeeks = [...BASE_SEMESTER_WEEKS, ...this.extraWeeks];
      this.semesterWeeks = this.allWeeks.map(w => ({
        ...w,
        isCurrent: w.id === this.realCurrentId || (w.week === this.realCurrentWeek && w.year === this.realCurrentYear)
      }));

      if (!this.semesterWeeks.some(w => w.id === this.activeWeekId)) {
        this.activeWeekId = this.semesterWeeks.find(w => w.isCurrent)?.id || this.semesterWeeks[0].id;
      }

      renderSemesterFilterBar();
      renderScheduleTable();
      renderCurrentWeek();
      renderWeeklyTasks();
      updateExpandButton();
    }
  }
}

// Global App Instance
let app = null;

// Helpers
function escapeHTML(str) {
  if (!str) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

function slugifyCollective(name) {
  let slug = (name || '').trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9æøåÆØÅ_-]/g, '')
    .slice(0, 60);
  return slug || ('Kollektiv_' + Date.now());
}

function generateCollectiveId(name) {
  return slugifyCollective(name);
}

// Collective Authentication & Management
const CollectiveAuthManager = {
  STORAGE_REGISTRY_KEY: 'vaske_collectives_registry',
  STORAGE_ACTIVE_ID_KEY: 'vaske_active_collective_id',

  getRegistry() {
    let list = [];
    try {
      const raw = localStorage.getItem(this.STORAGE_REGISTRY_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) list = parsed;
      }
    } catch (e) {
      console.warn('Failed to parse collective registry', e);
    }

    // Check if mitt_kollektiv is an un-customized dummy placeholder
    const hasCustomMittData = Boolean(
      localStorage.getItem('vaske_mitt_kollektiv_completed_tasks') ||
      (localStorage.getItem('vaske_completed_tasks') && localStorage.getItem(this.STORAGE_ACTIVE_ID_KEY) === 'mitt_kollektiv')
    );

    // Strictly deduplicate by case-sensitive ID and exact name, and purge dummy placeholder
    const seenIds = new Set();
    const seenNames = new Set();
    const cleanList = [];
    for (const item of list) {
      if (!item || !item.id) continue;
      // Do not suggest auto-seeded dummy placeholder on devices that never used it
      if (item.id.toLowerCase() === 'mitt_kollektiv' && !hasCustomMittData) {
        continue;
      }
      const trimmedName = (item.name || '').trim();
      if (!seenIds.has(item.id) && !seenNames.has(trimmedName)) {
        seenIds.add(item.id);
        if (trimmedName) seenNames.add(trimmedName);
        cleanList.push(item);
      }
    }

    // Save cleaned registry if items were purged or deduplicated
    if (cleanList.length !== list.length) {
      this.saveRegistry(cleanList);
    }

    return cleanList;
  },

  saveRegistry(registry) {
    try {
      localStorage.setItem(this.STORAGE_REGISTRY_KEY, JSON.stringify(registry));
    } catch (e) {
      console.warn('Failed to save collective registry', e);
    }
  },

  getActiveId() {
    return localStorage.getItem(this.STORAGE_ACTIVE_ID_KEY);
  },

  setActiveId(id) {
    if (id) {
      localStorage.setItem(this.STORAGE_ACTIVE_ID_KEY, id);
    } else {
      localStorage.removeItem(this.STORAGE_ACTIVE_ID_KEY);
    }
  },

  login(nameOrAddress) {
    if (!nameOrAddress || !nameOrAddress.trim()) return;
    const cleanName = nameOrAddress.trim();
    const id = slugifyCollective(cleanName);

    localStorage.setItem('vaske_app_has_initialized', 'true');
    const registry = this.getRegistry();

    // If registry only contains the untouched placeholder 'mitt_kollektiv', replace it!
    const isUntouchedDefault = registry.length === 1 && 
      registry[0].id === 'mitt_kollektiv' && 
      !localStorage.getItem('vaske_completed_tasks') &&
      !localStorage.getItem('vaske_mitt_kollektiv_completed_tasks');

    if (isUntouchedDefault && id !== 'mitt_kollektiv') {
      registry.length = 0;
    }

    const existing = registry.find(c => c.id === id || (c.name || '').trim() === cleanName);
    if (existing) {
      existing.id = id;
      existing.name = cleanName; // Keep latest casing
      existing.lastActive = Date.now();
    } else {
      registry.unshift({
        id: id,
        name: cleanName,
        lastActive: Date.now()
      });
    }
    this.saveRegistry(registry);
    this.setActiveId(id);
    this.switchToApp(id, cleanName);
  },

  loginWithId(id) {
    const registry = this.getRegistry();
    const found = registry.find(c => c.id === id);
    if (found) {
      found.lastActive = Date.now();
      this.saveRegistry(registry);
      this.setActiveId(id);
      this.switchToApp(found.id, found.name);
    }
  },

  async deleteCollective(id, collectiveName = '') {
    if (!id) return;
    const cleanId = String(id).trim();
    const cleanName = String(collectiveName || id).trim();

    // 1. Immediately flag and detach active cloud listener
    if (typeof CloudSyncManager !== 'undefined') {
      CloudSyncManager.isDeletingOrRenaming = true;
      if (CloudSyncManager.activeUnsubscribe) {
        try {
          CloudSyncManager.activeUnsubscribe();
        } catch (e) {}
        CloudSyncManager.activeUnsubscribe = null;
      }
    }

    // 2. Handle active collective: destroy in-memory app instance so nothing can re-push
    const currentActiveId = this.getActiveId();
    const isCurrentlyActive = (currentActiveId && (currentActiveId === cleanId || currentActiveId.toLowerCase() === cleanId.toLowerCase())) ||
      (app && (app.collectiveId === cleanId || (app.collectiveId && app.collectiveId.toLowerCase() === cleanId.toLowerCase())));

    if (isCurrentlyActive) {
      this.setActiveId(null);
      app = null;
    }

    // 3. Delete from Firestore (all case variants and slugs)
    if (typeof CloudSyncManager !== 'undefined' && CloudSyncManager.db) {
      const db = CloudSyncManager.db;
      const docIds = new Set([
        cleanId,
        cleanId.toLowerCase(),
        slugifyCollective(cleanId),
        slugifyCollective(cleanName),
        cleanName
      ]);
      try {
        docIds.add(decodeURIComponent(cleanId));
        docIds.add(decodeURIComponent(cleanName));
        docIds.add(decodeURIComponent(cleanId).toLowerCase());
      } catch (e) {}
      if (cleanId.toLowerCase() === 'mitt_kollektiv' || cleanName.toLowerCase() === 'mitt kollektiv') {
        docIds.add('mitt_kollektiv');
      }

      const deletes = [];
      docIds.forEach(dId => {
        if (dId) {
          deletes.push(
            db.collection('vaskelister').doc(dId).delete()
              .catch(err => console.warn(`Firestore delete warning for ${dId}:`, err))
          );
        }
      });

      try {
        await Promise.all(deletes);
      } catch (err) {
        console.warn('Batch firestore deletion error:', err);
      }
    }

    // 4. Clean all LocalStorage keys
    const allKeys = Object.keys(localStorage);
    const prefixes = [
      `vaske_${cleanId}_`,
      `vaske_${cleanId.toLowerCase()}_`,
      `vaske_${slugifyCollective(cleanName)}_`,
      `vaske_${slugifyCollective(cleanId)}_`
    ];

    allKeys.forEach(k => {
      if (prefixes.some(p => k.startsWith(p))) {
        localStorage.removeItem(k);
      }
    });

    if (cleanId.toLowerCase() === 'mitt_kollektiv' || cleanName.toLowerCase() === 'mitt kollektiv') {
      const legacyKeys = ['roommates', 'semester_weeks', 'deep_clean_tasks', 'regular_tasks', 'active_week_id', 'schedule', 'completed_tasks', 'custom_tasks', 'deep_clean_history', 'extra_weeks'];
      legacyKeys.forEach(lk => localStorage.removeItem(`vaske_${lk}`));
    }

    // 5. Update Registry: remove all matching entries
    const registry = this.getRegistry();
    const updated = registry.filter(c => {
      if (!c) return false;
      const cId = (c.id || '').trim();
      const cName = (c.name || '').trim();
      const matchesId = cId === cleanId || cId.toLowerCase() === cleanId.toLowerCase();
      const matchesSlug = cId === slugifyCollective(cleanName) || cId === slugifyCollective(cleanId);
      const matchesName = cName.toLowerCase() === cleanName.toLowerCase();
      return !matchesId && !matchesSlug && !matchesName;
    });
    this.saveRegistry(updated);

    // 6. If this was active, switch to next collective or login view
    if (isCurrentlyActive) {
      if (updated.length > 0) {
        this.loginWithId(updated[0].id);
      } else {
        this.showLoginView();
      }
    }

    // 7. Refresh all views
    if (typeof renderSwitchModalList === 'function') {
      renderSwitchModalList();
    }
    if (typeof this.renderLoginView === 'function') {
      this.renderLoginView();
    }
    if (typeof DeveloperManager !== 'undefined' && DeveloperManager.loadAllCollectives) {
      await DeveloperManager.loadAllCollectives();
    }

    if (typeof CloudSyncManager !== 'undefined') {
      setTimeout(() => {
        CloudSyncManager.isDeletingOrRenaming = false;
      }, 500);
    }
  },

  renameCollective(oldNameInput, newNameInput) {
    if (!app) throw new Error('Ingen aktiv kollektiv-økt.');
    const currentName = app.collectiveName || '';
    const currentId = app.collectiveId || '';

    const cleanOld = (oldNameInput || '').trim();
    const cleanNew = (newNameInput || '').trim();

    if (!cleanOld) {
      throw new Error('Vennligst oppgi nåværende (gammelt) kollektivnavn.');
    }
    if (!cleanNew) {
      throw new Error('Vennligst oppgi nytt kollektivnavn eller adresse.');
    }

    // Check if cleanOld matches currentName (or currentId or slug)
    const matchesName = cleanOld === currentName || cleanOld.toLowerCase() === currentName.toLowerCase();
    const oldSlug = slugifyCollective(cleanOld);
    const matchesId = oldSlug === currentId || cleanOld === currentId || cleanOld.toLowerCase() === currentId.toLowerCase();

    if (!matchesName && !matchesId) {
      throw new Error(`Det gamle navnet stemmer ikke. Du oppga «${cleanOld}», men aktivt kollektiv er «${currentName}».`);
    }

    if (cleanNew === currentName) {
      throw new Error('Det nye navnet kan ikke være helt identisk med det gamle.');
    }

    const newId = slugifyCollective(cleanNew);

    // 1. Snapshot all keys and copy data safely to new prefix
    const oldPrefix = `vaske_${currentId}_`;
    const oldSlugPrefix = `vaske_${oldSlug}_`;
    const newPrefix = `vaske_${newId}_`;

    const allKeys = Object.keys(localStorage);

    allKeys.forEach(key => {
      let suffix = null;
      if (key.startsWith(oldPrefix)) {
        suffix = key.substring(oldPrefix.length);
      } else if (key.startsWith(oldSlugPrefix)) {
        suffix = key.substring(oldSlugPrefix.length);
      }
      if (suffix) {
        const val = localStorage.getItem(key);
        localStorage.setItem(`${newPrefix}${suffix}`, val);
      }
    });

    // Also migrate legacy keys if renaming from 'mitt_kollektiv'
    const legacyKeys = ['roommates', 'schedule', 'completed_tasks', 'custom_tasks', 'deep_clean_tasks', 'deep_clean_history', 'extra_weeks', 'regular_tasks', 'active_week_id', 'semester_weeks'];
    if (currentId.toLowerCase() === 'mitt_kollektiv' || oldSlug.toLowerCase() === 'mitt_kollektiv') {
      legacyKeys.forEach(lk => {
        const legacyVal = localStorage.getItem(`vaske_${lk}`);
        if (legacyVal !== null) {
          if (localStorage.getItem(`${newPrefix}${lk}`) === null) {
            localStorage.setItem(`${newPrefix}${lk}`, legacyVal);
          }
          localStorage.removeItem(`vaske_${lk}`);
        }
      });
    }

    // 2. Clean up and remove all old scoped keys
    allKeys.forEach(key => {
      if (key.startsWith(oldPrefix) || key.startsWith(oldSlugPrefix)) {
        localStorage.removeItem(key);
      }
    });

    // 3. Update registry: strictly replace the old collective with the new one
    const registry = this.getRegistry();

    // Filter OUT any entries that matched the old collective OR match the new one
    const filtered = registry.filter(c => {
      if (!c) return false;
      const cName = (c.name || '').trim();
      const isOldMatch = c.id === currentId || 
                         c.id === oldSlug || 
                         c.id === slugifyCollective(currentName) ||
                         cName === cleanOld || 
                         cName === currentName ||
                         cName.toLowerCase() === currentName.toLowerCase();
      const isNewMatch = c.id === newId || cName === cleanNew;
      return !isOldMatch && !isNewMatch;
    });

    // If the old one was 'mitt_kollektiv', ensure no placeholder remains
    const cleanedRegistry = (currentId.toLowerCase() === 'mitt_kollektiv' || oldSlug.toLowerCase() === 'mitt_kollektiv')
      ? filtered.filter(c => (c.id || '').toLowerCase() !== 'mitt_kollektiv')
      : filtered;

    cleanedRegistry.unshift({
      id: newId,
      name: cleanNew,
      lastActive: Date.now()
    });

    this.saveRegistry(cleanedRegistry);
    this.setActiveId(newId);

    // 4. Update Cloud Firestore if connected
    if (typeof CloudSyncManager !== 'undefined' && CloudSyncManager.db) {
      const db = CloudSyncManager.db;
      CloudSyncManager.isDeletingOrRenaming = true;
      if (CloudSyncManager.activeUnsubscribe) {
        CloudSyncManager.activeUnsubscribe();
        CloudSyncManager.activeUnsubscribe = null;
      }
      const payload = {
        name: cleanNew,
        roommates: app.roommates || [],
        completedTasks: app.completedTasksByWeek || {},
        customTasks: app.customTasksByWeek || {},
        deepCleanHistory: app.deepCleanHistory || {},
        scheduleAssignments: app.scheduleAssignments || {},
        extraWeeks: app.extraWeeks || []
      };
      if (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) {
        payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      }
      db.collection('vaskelister').doc(newId).set(payload, { merge: true })
        .then(() => {
          const deletes = [];
          if (currentId && currentId !== newId) {
            deletes.push(db.collection('vaskelister').doc(currentId).delete());
          }
          if (oldSlug && oldSlug !== newId && oldSlug !== currentId) {
            deletes.push(db.collection('vaskelister').doc(oldSlug).delete());
          }
          // Also delete lowercase variant if casing was changed
          const oldLower = currentId.toLowerCase();
          if (oldLower !== newId && oldLower !== currentId) {
            deletes.push(db.collection('vaskelister').doc(oldLower).delete());
          }
          if ((currentId.toLowerCase() === 'mitt_kollektiv' || oldSlug.toLowerCase() === 'mitt_kollektiv') && newId.toLowerCase() !== 'mitt_kollektiv') {
            deletes.push(db.collection('vaskelister').doc('mitt_kollektiv').delete());
          }
          return Promise.all(deletes);
        })
        .then(() => {
          setTimeout(() => { CloudSyncManager.isDeletingOrRenaming = false; }, 800);
        })
        .catch(err => {
          CloudSyncManager.isDeletingOrRenaming = false;
          console.warn('Firestore rename sync warning:', err);
        });
    }

    // 5. Update app state
    this.switchToApp(newId, cleanNew);

    // 6. Update URL parameter
    if (window.history && window.history.replaceState) {
      const newUrl = window.location.pathname + '?kollektiv=' + encodeURIComponent(newId);
      window.history.replaceState({}, '', newUrl);
    }

    // 7. Refresh lists
    if (typeof renderSwitchModalList === 'function') {
      renderSwitchModalList();
    }
    if (typeof this.renderLoginView === 'function') {
      this.renderLoginView();
    }

    return { newId, newName: cleanNew };
  },

  logout() {
    this.setActiveId(null);
    this.showLoginView();
  },

  switchToApp(id, name) {
    // Instantiate scoped app state
    app = new CleaningAppState(id, name);

    // Update Header Display
    const nameDisplay = document.getElementById('activeCollectiveNameDisplay');
    if (nameDisplay) {
      nameDisplay.textContent = name;
      nameDisplay.title = name;
    }
    const dropName = document.getElementById('dropdownCurrentName');
    if (dropName) {
      dropName.textContent = name;
    }

    // Hide login view, show main app
    const loginView = document.getElementById('loginViewContainer');
    const mainApp = document.getElementById('mainAppContainer');
    if (loginView) loginView.style.display = 'none';
    if (mainApp) mainApp.style.display = 'block';

    // Render all components
    renderAllViews();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Connect cloud listener for this collective if configured
    if (typeof CloudSyncManager !== 'undefined') {
      CloudSyncManager.subscribe(id);
    }

    if (window.confetti) {
      window.confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
    }
  },

  showLoginView() {
    const loginView = document.getElementById('loginViewContainer');
    const mainApp = document.getElementById('mainAppContainer');
    if (mainApp) mainApp.style.display = 'none';
    if (loginView) {
      loginView.style.display = 'flex';
      this.renderLoginView();
      const input = document.getElementById('inputCollectiveName');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 150);
      }
    }
  },

  renderLoginView() {
    const listContainer = document.getElementById('savedCollectivesList');
    const section = document.getElementById('savedCollectivesSection');
    if (!listContainer || !section) return;

    const registry = this.getRegistry();
    if (!registry || registry.length === 0) {
      section.style.display = 'none';
      return;
    }

    section.style.display = 'block';
    listContainer.innerHTML = '';

    // Sort by most recently active
    const sorted = [...registry].sort((a, b) => (b.lastActive || 0) - (a.lastActive || 0));

    sorted.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'saved-collective-card';
      
      // Get roommate count preview if available
      let rmCount = 3;
      try {
        const stored = localStorage.getItem(`vaske_${item.id}_roommates`) || 
          (item.id === 'mitt_kollektiv' ? localStorage.getItem('vaske_roommates') : null);
        if (stored) rmCount = JSON.parse(stored).length;
      } catch (e) {}

      const lastActiveDate = item.lastActive ? new Date(item.lastActive) : null;
      let timeText = 'Nylig opprettet';
      if (lastActiveDate) {
        timeText = formatNorwegianDate(formatDateToInputString(lastActiveDate));
      }

      card.innerHTML = `
        <div class="col-card-left">
          <div class="col-card-icon">🏠</div>
          <div class="col-card-info">
            <h4 class="col-card-name">${escapeHTML(item.name)}</h4>
            <p class="col-card-meta">
              <span>👥 ${rmCount} beboere</span>
              <span class="meta-dot">•</span>
              <span>${index === 0 ? 'Sist brukt' : 'Aktiv'}: ${timeText}</span>
            </p>
          </div>
        </div>
        <div class="col-card-actions">
          <button type="button" class="btn-card-enter" title="Åpne ${escapeHTML(item.name)}">
            <span>Åpne</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      `;

      card.addEventListener('click', () => {
        this.loginWithId(item.id);
      });

      listContainer.appendChild(card);
    });
  }
};

// Cloud Synchronization Manager (Google Firebase Firestore)
const CloudSyncManager = {
  db: null,
  activeUnsubscribe: null,
  syncTimeout: null,
  isInitialized: false,
  isDeletingOrRenaming: false,

  init() {
    this.initModal();

    if (typeof isFirebaseConfigured === 'function' && isFirebaseConfigured()) {
      this.connectFirebase();
    } else {
      this.updateStatusBadge(false);
    }
  },

  connectFirebase() {
    try {
      if (typeof firebase === 'undefined') {
        console.warn('Firebase SDK not available');
        this.updateStatusBadge(false);
        return;
      }

      const config = getActiveFirebaseConfig();
      if (!firebase.apps.length) {
        firebase.initializeApp(config);
      }
      this.db = firebase.firestore();
      this.isInitialized = true;
      this.updateStatusBadge(true);

      // Subscribe to active collective if already opened
      if (app && app.collectiveId) {
        this.subscribe(app.collectiveId);
      }
    } catch (e) {
      console.warn('Firebase init error:', e);
      this.updateStatusBadge(false);
    }
  },

  subscribe(collectiveId) {
    if (!this.db || !collectiveId) return;

    if (this.activeUnsubscribe) {
      this.activeUnsubscribe();
      this.activeUnsubscribe = null;
    }

    try {
      this.activeUnsubscribe = this.db.collection('vaskelister').doc(collectiveId)
        .onSnapshot(doc => {
          if (doc.exists) {
            const data = doc.data();
            if (app && app.collectiveId === collectiveId) {
              if (data.name && data.name !== app.collectiveName) {
                app.collectiveName = data.name;
                const nameDisplay = document.getElementById('activeCollectiveNameDisplay');
                if (nameDisplay) nameDisplay.textContent = data.name;
                const dropName = document.getElementById('dropdownCurrentName');
                if (dropName) dropName.textContent = data.name;
              }
              app.applyRemoteState(data);
            }
          } else {
            // Document does not exist or was deleted: DO NOT re-push!
          }
        }, err => {
          console.warn('Firestore onSnapshot error:', err);
        });
    } catch (e) {
      console.warn('Could not listen to Firestore document:', e);
    }
  },

  triggerSync(appInstance) {
    if (!this.isInitialized || !this.db || !appInstance || this.isDeletingOrRenaming) return;

    if (this.syncTimeout) {
      clearTimeout(this.syncTimeout);
    }
    this.syncTimeout = setTimeout(() => {
      this.pushToCloud(appInstance);
    }, 350);
  },

  pushToCloud(appInstance) {
    if (!this.db || !appInstance || !appInstance.collectiveId || this.isDeletingOrRenaming) return;

    // Safety check: Never push if the collective was deleted from local registry
    if (typeof CollectiveAuthManager !== 'undefined') {
      const reg = CollectiveAuthManager.getRegistry();
      const inReg = reg.some(c => c && (c.id === appInstance.collectiveId || slugifyCollective(c.name || '') === appInstance.collectiveId));
      if (!inReg && appInstance.collectiveId !== 'mitt_kollektiv') {
        return;
      }
    }

    const payload = {
      name: appInstance.collectiveName || 'Mitt Kollektiv',
      roommates: appInstance.roommates || [],
      completedTasks: appInstance.completedTasksByWeek || {},
      customTasks: appInstance.customTasksByWeek || {},
      deepCleanHistory: appInstance.deepCleanHistory || {},
      scheduleAssignments: appInstance.scheduleAssignments || {},
      extraWeeks: appInstance.extraWeeks || []
    };

    if (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) {
      payload.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
    }

    this.db.collection('vaskelister').doc(appInstance.collectiveId)
      .set(payload, { merge: true })
      .catch(err => console.warn('Firestore write warning:', err));
  },

  updateStatusBadge(isOnline = false) {
    const dot = document.getElementById('syncIndicatorDot');
    const label = document.getElementById('syncStatusLabel');
    if (!dot || !label) return;

    const configured = typeof isFirebaseConfigured === 'function' && isFirebaseConfigured();
    if (configured && isOnline) {
      dot.className = 'sync-indicator-dot sync-online';
      label.textContent = 'Sky (Aktiv)';
    } else {
      dot.className = 'sync-indicator-dot sync-offline';
      label.textContent = 'Lokal';
    }
  },

  initModal() {
    const modal = document.getElementById('cloudSyncModal');
    const btnOpen = document.getElementById('btnCloudSyncStatus');
    const btnClose = document.getElementById('btnCloseSyncModal');
    const btnCloseOk = document.getElementById('btnCloseSyncModalOk');

    if (!modal) return;

    const openModal = () => {
      this.renderModalStatus();
      modal.classList.add('active');
    };
    const closeModal = () => modal.classList.remove('active');

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnCloseOk) btnCloseOk.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  },

  renderModalStatus() {
    const banner = document.getElementById('syncStatusBanner');
    const icon = document.getElementById('syncBannerIcon');
    const title = document.getElementById('syncBannerTitle');
    const desc = document.getElementById('syncBannerDesc');
    const colNameEl = document.getElementById('syncModalCollectiveName');
    const configured = typeof isFirebaseConfigured === 'function' && isFirebaseConfigured();

    if (colNameEl && app && app.collectiveName) {
      colNameEl.textContent = app.collectiveName;
    }

    if (configured) {
      if (banner) banner.classList.add('connected');
      if (icon) icon.textContent = '☁️';
      if (title) title.textContent = 'Tilkoblet og aktiv';
      if (desc) desc.textContent = 'Vaskeplanen, avkryssinger og oppgaver synkroniseres automatisk i sanntid. Når noen krysser av en oppgave på sin mobil, oppdateres det umiddelbart for alle andre i kollektivet.';
    } else {
      if (banner) banner.classList.remove('connected');
      if (icon) icon.textContent = '📱';
      if (title) title.textContent = 'Lokal modus';
      if (desc) desc.textContent = 'Endringer lagres lokalt på denne enheten.';
    }
  }
};

function initCollectiveAuth() {
  const form = document.getElementById('formCollectiveLogin');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('inputCollectiveName');
      const val = input.value.trim();
      if (!val) return;

      // Shortcut: If user enters 'admin' or 'dev', open developer dashboard
      const lower = val.toLowerCase();
      if (lower === 'admin' || lower === 'dev' || lower === 'developer') {
        input.value = '';
        DeveloperManager.openDevModal();
        return;
      }

      CollectiveAuthManager.login(val);
    });
  }



  const btnShare = document.getElementById('btnShareCollective');
  if (btnShare) {
    btnShare.addEventListener('click', () => {
      if (!app || !app.collectiveId) return;
      const shareUrl = `${window.location.origin}${window.location.pathname}?kollektiv=${encodeURIComponent(app.collectiveId)}`;
      
      const copySuccess = () => {
        const label = document.getElementById('btnShareLabel');
        if (label) {
          const original = label.textContent;
          label.textContent = 'Kopiert! ✓';
          setTimeout(() => { label.textContent = original; }, 2200);
        }
        if (window.confetti) window.confetti({ particleCount: 30, spread: 50 });
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(copySuccess).catch(() => {
          prompt('Kopier denne lenken for å dele kollektivet:', shareUrl);
        });
      } else {
        prompt('Kopier denne lenken for å dele kollektivet:', shareUrl);
      }
    });
  }
}

function initRenameCollectiveModal() {
  const modal = document.getElementById('renameCollectiveModal');
  const btnOpen = document.getElementById('btnRenameCollective');
  const btnClose = document.getElementById('btnCloseRenameModal');
  const btnCancel = document.getElementById('btnCancelRenameModal');
  const form = document.getElementById('formRenameCollective');
  const oldInput = document.getElementById('inputOldCollectiveName');
  const newInput = document.getElementById('inputNewCollectiveName');
  const errorBanner = document.getElementById('renameErrorBanner');

  if (!modal || !form) return;

  const openModal = () => {
    if (errorBanner) {
      errorBanner.style.display = 'none';
      errorBanner.textContent = '';
    }
    if (oldInput) {
      oldInput.value = '';
      if (app && app.collectiveName) {
        oldInput.placeholder = `Skriv "${app.collectiveName}" for å bekrefte`;
      }
    }
    if (newInput) {
      newInput.value = '';
    }
    modal.classList.add('active');
    setTimeout(() => {
      if (oldInput) oldInput.focus();
    }, 120);
  };

  const closeModal = () => {
    modal.classList.remove('active');
    if (errorBanner) {
      errorBanner.style.display = 'none';
    }
  };

  if (btnOpen) btnOpen.addEventListener('click', openModal);
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (errorBanner) {
      errorBanner.style.display = 'none';
      errorBanner.textContent = '';
    }

    try {
      const res = CollectiveAuthManager.renameCollective(oldInput.value, newInput.value);
      closeModal();
      if (window.confetti) {
        window.confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
      alert(`Kollektivet er nå omdøpt til «${res.newName}»! Del gjerne den nye lenken med romkameratene dine.`);
    } catch (err) {
      if (errorBanner) {
        errorBanner.textContent = err.message || 'Kunne ikke endre navn på kollektivet.';
        errorBanner.style.display = 'block';
      } else {
        alert(err.message || 'Kunne ikke endre navn på kollektivet.');
      }
    }
  });
}

function openDeleteCollectiveModal(targetId, targetName) {
  const modal = document.getElementById('deleteCollectiveModal');
  const targetLabel = document.getElementById('deleteTargetCollectiveName');
  const input = document.getElementById('inputDeleteConfirmName');
  const checkbox = document.getElementById('checkDeleteConfirm');
  const btnSubmit = document.getElementById('btnConfirmDelete');
  const warningDesc = document.getElementById('deleteModalWarningDesc');
  if (!modal) return;

  modal.dataset.targetId = targetId;
  modal.dataset.targetName = targetName;

  if (targetLabel) targetLabel.textContent = targetName;
  if (warningDesc) {
    warningDesc.textContent = `Alle oppgaver, avkryssinger, historikk og beboere for «${targetName}» slettes permanent både på denne enheten og i skyen. Handlingen kan ikke angres.`;
  }
  if (input) {
    input.value = '';
    input.placeholder = `Skriv nøyaktig "${targetName}"`;
  }
  if (checkbox) checkbox.checked = false;
  if (btnSubmit) btnSubmit.disabled = true;

  const validate = () => {
    const nameMatches = input && input.value.trim().toLowerCase() === targetName.trim().toLowerCase();
    const isChecked = checkbox && checkbox.checked;
    if (btnSubmit) {
      btnSubmit.disabled = !(nameMatches && isChecked);
    }
  };

  input.oninput = validate;
  checkbox.onchange = validate;

  modal.classList.add('active');
  setTimeout(() => { if (input) input.focus(); }, 120);
}

function initDeleteCollectiveModal() {
  const modal = document.getElementById('deleteCollectiveModal');
  const btnClose = document.getElementById('btnCloseDeleteModal');
  const btnCancel = document.getElementById('btnCancelDeleteModal');
  const form = document.getElementById('formDeleteCollective');
  const btnDirectHeaderDelete = document.getElementById('btnDeleteCollective');

  if (!modal || !form) return;

  const closeModal = () => modal.classList.remove('active');

  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnCancel) btnCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Direct trigger from header action pill
  if (btnDirectHeaderDelete) {
    btnDirectHeaderDelete.addEventListener('click', () => {
      if (!app || !app.collectiveId) return;
      openDeleteCollectiveModal(app.collectiveId, app.collectiveName || 'Mitt Kollektiv');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const targetId = modal.dataset.targetId;
    const targetName = modal.dataset.targetName || 'kollektivet';
    if (!targetId) return;

    if (!confirm(`SISTE ADVARSEL: Er du helt sikker på at du vil slette «${targetName}» for godt? Alle data slettes umiddelbart.`)) {
      return;
    }

    closeModal();
    const switchModal = document.getElementById('switchCollectiveModal');
    if (switchModal) switchModal.classList.remove('active');

    await CollectiveAuthManager.deleteCollective(targetId, targetName);
    alert(`Kollektivet «${targetName}» er nå slettet.`);
  });
}

function renderSwitchModalList() {
  const listEl = document.getElementById('switchCollectivesList');
  if (!listEl) return;
  const registry = CollectiveAuthManager.getRegistry();
  const currentId = app ? app.collectiveId : CollectiveAuthManager.getActiveId();

  if (!registry || registry.length === 0) {
    listEl.innerHTML = '<p class="text-muted" style="font-size: 0.85rem; padding: 12px;">Ingen lagrede kollektiv funnet.</p>';
    return;
  }

  listEl.innerHTML = '';
  registry.forEach(item => {
    const isActive = item.id === currentId;
    let rmCount = 3;
    try {
      const stored = localStorage.getItem(`vaske_${item.id}_roommates`) || 
        (item.id === 'mitt_kollektiv' ? localStorage.getItem('vaske_roommates') : null);
      if (stored) rmCount = JSON.parse(stored).length;
    } catch (e) {}

    const lastActiveDate = item.lastActive ? new Date(item.lastActive) : null;
    let timeText = 'Nylig';
    if (lastActiveDate) {
      timeText = formatNorwegianDate(formatDateToInputString(lastActiveDate));
    }

    const row = document.createElement('div');
    row.className = `switch-col-item ${isActive ? 'active-col-item' : ''}`;
    row.innerHTML = `
      <div class="switch-col-left">
        <span class="switch-col-icon">🏠</span>
        <div class="switch-col-info">
          <div class="switch-col-name-row">
            <strong>${escapeHTML(item.name)}</strong>
            ${isActive ? '<span class="active-col-badge">Aktiv nå ✓</span>' : ''}
          </div>
          <p class="switch-col-meta">👥 ${rmCount} beboere • ${timeText}</p>
        </div>
      </div>
      <div class="switch-col-actions">
        ${!isActive ? `<button type="button" class="btn btn-sm btn-glass btn-switch-to" data-id="${item.id}">Bytt</button>` : ''}
        <button type="button" class="btn-danger-ghost btn-trigger-delete" data-id="${item.id}" data-name="${escapeHTML(item.name)}" title="Slett dette kollektivet">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span>Slett...</span>
        </button>
      </div>
    `;

    // Handle Switch
    const btnSwitchTo = row.querySelector('.btn-switch-to');
    if (btnSwitchTo) {
      btnSwitchTo.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = document.getElementById('switchCollectiveModal');
        if (modal) modal.classList.remove('active');
        CollectiveAuthManager.loginWithId(item.id);
      });
    }

    // Handle Delete Trigger (opens double confirmation)
    const btnDel = row.querySelector('.btn-trigger-delete');
    if (btnDel) {
      btnDel.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteCollectiveModal(item.id, item.name);
      });
    }

    listEl.appendChild(row);
  });
}

function initSwitchCollectiveModal() {
  const modal = document.getElementById('switchCollectiveModal');
  const btnOpen = document.getElementById('btnSwitchCollective');
  const btnClose = document.getElementById('btnCloseSwitchModal');
  const btnOpenOther = document.getElementById('btnSwitchOpenOther');

  if (!modal) return;

  const openModal = () => {
    renderSwitchModalList();
    modal.classList.add('active');
  };

  const closeModal = () => modal.classList.remove('active');

  if (btnOpen) {
    btnOpen.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal();
    });
  }
  if (btnClose) btnClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (btnOpenOther) {
    btnOpenOther.addEventListener('click', () => {
      closeModal();
      CollectiveAuthManager.showLoginView();
    });
  }
}

function initColMoreToggle() {
  const toggleBtn = document.getElementById('btnToggleColMore');
  const hiddenActions = document.getElementById('colBarHiddenActions');
  const toggleText = document.getElementById('btnToggleColMoreText');
  const pill = document.getElementById('activeCollectivePill');
  if (!toggleBtn || !hiddenActions) return;

  const closeActions = () => {
    hiddenActions.style.display = 'none';
    toggleBtn.classList.remove('active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    if (toggleText) toggleText.textContent = 'Mer';
  };

  const openActions = () => {
    hiddenActions.style.display = 'flex';
    toggleBtn.classList.add('active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    if (toggleText) toggleText.textContent = 'Mindre';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = hiddenActions.style.display === 'none' || !hiddenActions.style.display;
    if (isHidden) {
      openActions();
    } else {
      closeActions();
    }
  });

  // When clicking any action inside hidden actions, close it
  hiddenActions.querySelectorAll('.btn-col-action').forEach(btn => {
    btn.addEventListener('click', () => {
      closeActions();
    });
  });

  // Close when clicking outside collective bar
  document.addEventListener('click', (e) => {
    if (pill && !pill.contains(e.target)) {
      closeActions();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeActions();
    }
  });
}

// Developer / Admin Dashboard Manager
const DeveloperManager = {
  DEV_PINS: ['admin', 'eirik', 'dev123', 'admin2026'],
  collectivesData: [],

  init() {
    this.initAuthModal();
    this.initJsonModal();

    const btnOpen = document.getElementById('btnOpenDevModal');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => this.openDevModal());
    }

    const btnClose = document.getElementById('btnCloseDevView');
    if (btnClose) {
      btnClose.addEventListener('click', () => this.hideDevView());
    }

    const btnRefresh = document.getElementById('btnRefreshDevList');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => this.loadAllCollectives());
    }

    const searchInput = document.getElementById('inputDevSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.renderCollectivesList(e.target.value));
    }
  },

  openDevModal() {
    if (sessionStorage.getItem('vaske_dev_auth') === 'true') {
      this.showDevView();
      return;
    }

    const modal = document.getElementById('devAuthModal');
    if (modal) {
      modal.classList.add('active');
      const input = document.getElementById('inputDevPin');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 150);
      }
    }
  },

  closeDevModal() {
    const modal = document.getElementById('devAuthModal');
    if (modal) modal.classList.remove('active');
  },

  initAuthModal() {
    const modal = document.getElementById('devAuthModal');
    const btnClose = document.getElementById('btnCloseDevAuthModal');
    const btnCancel = document.getElementById('btnCancelDevAuth');
    const form = document.getElementById('formDevAuth');

    if (!modal) return;
    if (btnClose) btnClose.addEventListener('click', () => this.closeDevModal());
    if (btnCancel) btnCancel.addEventListener('click', () => this.closeDevModal());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeDevModal();
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = document.getElementById('inputDevPin').value.trim();
        const customPin = localStorage.getItem('vaske_custom_dev_pin');

        if (this.DEV_PINS.includes(pin.toLowerCase()) || (customPin && pin === customPin)) {
          sessionStorage.setItem('vaske_dev_auth', 'true');
          this.closeDevModal();
          this.showDevView();
        } else {
          alert('Feil utvikler-PIN eller passord.');
          document.getElementById('inputDevPin').focus();
        }
      });
    }
  },

  showDevView() {
    const devView = document.getElementById('devViewContainer');
    const loginView = document.getElementById('loginViewContainer');
    const mainApp = document.getElementById('mainAppContainer');

    if (loginView) loginView.style.display = 'none';
    if (mainApp) mainApp.style.display = 'none';
    if (devView) {
      devView.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.loadAllCollectives();
    }
  },

  hideDevView() {
    const devView = document.getElementById('devViewContainer');
    if (devView) devView.style.display = 'none';

    if (app && app.collectiveId) {
      const mainApp = document.getElementById('mainAppContainer');
      if (mainApp) mainApp.style.display = 'block';
    } else {
      CollectiveAuthManager.showLoginView();
    }
  },

  async loadAllCollectives() {
    const grid = document.getElementById('devCollectivesGrid');
    if (grid) {
      grid.innerHTML = '<div style="color: var(--text-muted); padding: 20px;">Laster inn alle kollektiv...</div>';
    }

    const collectivesMap = new Map();
    let isCloud = false;

    // 1. Fetch from Firestore if initialized
    if (CloudSyncManager.isInitialized && CloudSyncManager.db) {
      try {
        const snap = await CloudSyncManager.db.collection('vaskelister').get();
        snap.forEach(doc => {
          collectivesMap.set(doc.id, {
            id: doc.id,
            source: 'cloud',
            ...doc.data()
          });
        });
        isCloud = true;
      } catch (err) {
        console.warn('Could not read cloud collectives:', err);
      }
    }

    // 2. Fetch from Local Storage registry
    const localReg = CollectiveAuthManager.getRegistry();
    localReg.forEach(item => {
      if (!collectivesMap.has(item.id)) {
        let roommates = DEFAULT_ROOMMATES;
        let completedTasks = {};
        let deepCleanHistory = {};
        let scheduleAssignments = {};
        try {
          const rm = localStorage.getItem(`vaske_${item.id}_roommates`);
          if (rm) roommates = JSON.parse(rm);
          const tasks = localStorage.getItem(`vaske_${item.id}_completed_tasks`);
          if (tasks) completedTasks = JSON.parse(tasks);
          const dc = localStorage.getItem(`vaske_${item.id}_deep_clean_history`);
          if (dc) deepCleanHistory = JSON.parse(dc);
          const sc = localStorage.getItem(`vaske_${item.id}_schedule`);
          if (sc) scheduleAssignments = JSON.parse(sc);
        } catch (e) {}

        collectivesMap.set(item.id, {
          id: item.id,
          name: item.name,
          source: 'local',
          roommates,
          completedTasks,
          deepCleanHistory,
          scheduleAssignments,
          lastActive: item.lastActive
        });
      }
    });

    this.collectivesData = Array.from(collectivesMap.values());

    // Update stat counters
    const countEl = document.getElementById('statDevCollectivesCount');
    const rmEl = document.getElementById('statDevRoommatesCount');
    const srcEl = document.getElementById('statDevSource');

    if (countEl) countEl.textContent = this.collectivesData.length;
    if (rmEl) {
      const totalRms = this.collectivesData.reduce((acc, c) => acc + (Array.isArray(c.roommates) ? c.roommates.length : 0), 0);
      rmEl.textContent = totalRms;
    }
    if (srcEl) {
      srcEl.textContent = isCloud ? 'Firebase Sky (Sanntid)' : 'Lokal lagring';
      srcEl.style.color = isCloud ? 'var(--color-accent-light)' : '#cbd5e1';
    }

    this.renderCollectivesList();
  },

  renderCollectivesList(searchFilter = '') {
    const grid = document.getElementById('devCollectivesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filter = (searchFilter || '').trim().toLowerCase();
    const filtered = this.collectivesData.filter(c => {
      if (!filter) return true;
      const name = (c.name || '').toLowerCase();
      const id = (c.id || '').toLowerCase();
      return name.includes(filter) || id.includes(filter);
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          Ingen kollektiv funnet som matcher «${escapeHTML(filter)}»
        </div>
      `;
      return;
    }

    filtered.forEach(col => {
      const card = document.createElement('div');
      card.className = 'dev-col-card';

      const roommates = Array.isArray(col.roommates) ? col.roommates : [];
      const deepCleanCount = col.deepCleanHistory ? Object.keys(col.deepCleanHistory).length : 0;

      const now = new Date();
      const currentWeekNum = getRealCurrentISOWeek(now);
      const currentYear = now.getFullYear();
      const currentWeekKey = `${currentYear}_${currentWeekNum}`;
      const completedThisWeek = (col.completedTasks && (col.completedTasks[currentWeekKey] || col.completedTasks[currentWeekNum]))
        ? Object.values(col.completedTasks[currentWeekKey] || col.completedTasks[currentWeekNum]).filter(Boolean).length
        : 0;

      card.innerHTML = `
        <div>
          <div class="dev-card-top">
            <div class="dev-card-title-wrap">
              <h3 class="dev-card-name" title="${escapeHTML(col.name || col.id)}">${escapeHTML(col.name || col.id)}</h3>
              <span class="dev-card-slug">ID: ${escapeHTML(col.id)}</span>
            </div>
            <span class="dev-card-source-badge ${col.source === 'cloud' ? 'badge-cloud' : 'badge-local'}">
              ${col.source === 'cloud' ? '☁️ Sky' : '📱 Lokal'}
            </span>
          </div>

          <div style="margin: 14px 0 10px;">
            <div class="dev-roommates-chips">
              ${roommates.map((rm, i) => `
                <span class="dev-rm-chip">
                  <span class="dev-rm-dot avatar-color-${(i % 8) + 1}"></span>
                  ${escapeHTML(rm.name || 'Beboer')}
                </span>
              `).join('')}
            </div>
          </div>

          <div class="dev-meta-list">
            <div class="dev-meta-row">
              <span>Beboere:</span>
              <span class="val">${roommates.length} stk</span>
            </div>
            <div class="dev-meta-row">
              <span>Uke ${currentWeekNum} fremgang:</span>
              <span class="val">${completedThisWeek} av 8 fullført</span>
            </div>
            <div class="dev-meta-row">
              <span>Dypvask logget:</span>
              <span class="val">${deepCleanCount} oppgaver</span>
            </div>
          </div>
        </div>

        <div class="dev-card-actions">
          <button type="button" class="btn-dev-action primary btn-open-collective" title="Åpne og se dette kollektivet">
            <span>Åpne</span>
          </button>
          <button type="button" class="btn-dev-action secondary btn-copy-link" title="Kopier delelenke">
            <span>Lenke</span>
          </button>
          <button type="button" class="btn-dev-action secondary btn-inspect-json" title="Se JSON rådata">
            <span>JSON</span>
          </button>
          <button type="button" class="btn-dev-action danger btn-delete-col" title="Slett dette kollektivet permanent">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            <span>Slett</span>
          </button>
        </div>
      `;

      // Open collective
      card.querySelector('.btn-open-collective').addEventListener('click', () => {
        this.hideDevView();
        CollectiveAuthManager.loginWithId(col.id);
      });

      // Copy link
      card.querySelector('.btn-copy-link').addEventListener('click', (e) => {
        const link = `${window.location.origin}${window.location.pathname}?kollektiv=${encodeURIComponent(col.id)}`;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(link).then(() => {
            const btn = e.target.closest('button');
            const orig = btn.innerHTML;
            btn.innerHTML = '<span>Kopiert! ✓</span>';
            setTimeout(() => { btn.innerHTML = orig; }, 1600);
          });
        } else {
          prompt('Delelenke:', link);
        }
      });

      // Inspect JSON
      card.querySelector('.btn-inspect-json').addEventListener('click', () => {
        this.showJsonModal(col);
      });

      // Delete from Admin Dashboard
      const btnDel = card.querySelector('.btn-delete-col');
      if (btnDel) {
        btnDel.addEventListener('click', async (e) => {
          e.stopPropagation();
          const targetName = col.name || col.id;
          if (!confirm(`Er du sikker på at du vil slette «${targetName}»? Dette fjerner kollektivet permanent både fra skyen og på denne enheten.`)) {
            return;
          }

          btnDel.disabled = true;
          btnDel.style.opacity = '0.5';

          await CollectiveAuthManager.deleteCollective(col.id, targetName);
        });
      }

      grid.appendChild(card);
    });
  },

  showJsonModal(data) {
    const modal = document.getElementById('jsonInspectorModal');
    const title = document.getElementById('jsonInspectorTitle');
    const code = document.getElementById('jsonInspectorCode');

    if (title) title.textContent = `${data.name || data.id} (Rådata)`;
    if (code) code.textContent = JSON.stringify(data, null, 2);
    if (modal) modal.classList.add('active');
  },

  initJsonModal() {
    const modal = document.getElementById('jsonInspectorModal');
    const btnClose = document.getElementById('btnCloseJsonModal');
    const btnAction = document.getElementById('btnCloseJsonAction');
    const btnCopy = document.getElementById('btnCopyJson');
    const code = document.getElementById('jsonInspectorCode');

    if (!modal) return;
    const closeModal = () => modal.classList.remove('active');

    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (btnAction) btnAction.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        if (code && navigator.clipboard) {
          navigator.clipboard.writeText(code.textContent).then(() => {
            btnCopy.textContent = 'Kopiert! ✓';
            setTimeout(() => { btnCopy.textContent = 'Kopier JSON'; }, 1500);
          });
        }
      });
    }
  }
};

function initLegalModal() {
  const modal = document.getElementById('legalModal');
  const btnClose = document.getElementById('btnCloseLegalModal');
  const btnConfirm = document.getElementById('btnConfirmCloseLegal');
  const tabButtons = document.querySelectorAll('.legal-tab-btn');
  const contents = {
    privacy: document.getElementById('legalContentPrivacy'),
    terms: document.getElementById('legalContentTerms'),
    cookies: document.getElementById('legalContentCookies')
  };

  if (!modal) return;
  const closeModal = () => modal.classList.remove('active');

  const switchTab = (tabName) => {
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    Object.keys(contents).forEach(key => {
      if (contents[key]) {
        contents[key].style.display = key === tabName ? 'block' : 'none';
      }
    });
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Attach listener to all trigger buttons across app (footer, login, dev)
  document.querySelectorAll('[data-legal-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = btn.getAttribute('data-legal-tab') || 'privacy';
      switchTab(targetTab);
      modal.classList.add('active');
    });
  });

  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnConfirm) btnConfirm.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function renderAllViews() {
  if (!app) return;
  renderHeaderRoommates();
  renderCurrentWeek();
  renderWeeklyTasks();
  renderDeepClean();
  renderSemesterFilterBar();
  renderScheduleTable();
  updateExpandButton();
}

// DOM Initializer
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initRoommatesModal();
  initCalendarModal();
  initDeepCleanViewToggle();
  initScheduleExpansion();
  initHeroAssigneeSelect();
  initAddTaskForm();
  initCollectiveAuth();
  initRenameCollectiveModal();
  initColMoreToggle();
  initSwitchCollectiveModal();
  initDeleteCollectiveModal();
  CloudSyncManager.init();
  DeveloperManager.init();
  initLegalModal();

  // Check URL query parameters for direct collective sharing or developer view
  const urlParams = new URLSearchParams(window.location.search);
  const sharedCol = urlParams.get('kollektiv') || urlParams.get('c');
  const isDevParam = urlParams.get('dev') || urlParams.get('admin');

  if (isDevParam) {
    DeveloperManager.openDevModal();
  } else if (sharedCol) {
    CollectiveAuthManager.login(sharedCol);
  } else {
    const activeId = CollectiveAuthManager.getActiveId();
    const registry = CollectiveAuthManager.getRegistry();
    if (activeId && registry.some(c => c.id === activeId)) {
      CollectiveAuthManager.loginWithId(activeId);
    } else {
      CollectiveAuthManager.showLoginView();
    }
  }
});

/* --- UI Renderers --- */

function renderHeaderRoommates() {
  const container = document.getElementById('roommatesQuickList');
  if (container) {
    container.innerHTML = '';
    app.roommates.forEach((rm, idx) => {
      const badge = document.createElement('div');
      badge.className = `roommate-avatar-badge avatar-color-${(idx % 8) + 1}`;
      badge.innerText = rm.name.charAt(0).toUpperCase();
      badge.title = rm.name;
      badge.addEventListener('click', () => {
        document.getElementById('btnEditRoommates').click();
      });
      container.appendChild(badge);
    });
  }

  const subtitle = document.getElementById('brandSubtitle');
  if (subtitle) {
    subtitle.textContent = `Høst 2026 • ${app.roommates.length} Beboere`;
  }
  const btnLabel = document.getElementById('btnRoommatesLabel');
  if (btnLabel) {
    btnLabel.textContent = `Beboere (${app.roommates.length})`;
  }
}

function renderCurrentWeek() {
  const weekData = app.semesterWeeks.find(w => w.id === app.activeWeekId) || app.semesterWeeks[0];
  const assigneeName = app.getAssigneeForWeek(weekData);
  const isRealCurrent = weekData.isCurrent;
  const isHoliday = assigneeName === 'Ingen';

  // Hero Card update
  const pill = document.getElementById('currentWeekPill');
  pill.textContent = `Uke ${weekData.week} (${weekData.year})`;

  const liveTag = document.getElementById('heroLiveTag');
  if (liveTag) {
    liveTag.style.display = isRealCurrent ? 'inline-flex' : 'none';
    if (isHoliday) {
      liveTag.innerHTML = `<span class="dot-pulse"></span>🏖️ Aktiv uke (Ferie)`;
    } else {
      liveTag.innerHTML = `<span class="dot-pulse"></span>Aktiv uke`;
    }
  }

  document.getElementById('currentDateRange').textContent = `${weekData.dates} • ${weekData.semester}`;

  const heroCard = document.getElementById('heroCard');
  if (heroCard) {
    if (isHoliday) {
      heroCard.classList.add('hero-holiday');
    } else {
      heroCard.classList.remove('hero-holiday');
    }
  }

  const heroAvatar = document.getElementById('heroAvatar');
  const heroName = document.getElementById('heroAssigneeName');
  const heroSub = document.getElementById('heroAssigneeSub');

  if (isHoliday) {
    heroName.textContent = 'Ingen (Ferie)';
    heroSub.textContent = 'Ferieuke – ingen har vaskeansvar denne uken 🏖️';
    heroAvatar.textContent = '🏖️';
    heroAvatar.className = 'assignee-avatar avatar-holiday';
  } else {
    heroName.textContent = assigneeName;
    heroSub.textContent = 'Hovedansvar for ukentlig renhold';
    heroAvatar.textContent = assigneeName.charAt(0).toUpperCase();
    const rmIndex = app.roommates.findIndex(r => r.name === assigneeName);
    const colorNum = rmIndex >= 0 ? (rmIndex % 8) + 1 : 1;
    heroAvatar.className = `assignee-avatar avatar-color-${colorNum}`;
  }

  // Populate heroAssigneeSelect
  const heroSelect = document.getElementById('heroAssigneeSelect');
  if (heroSelect) {
    heroSelect.innerHTML = `
      <option value="Ingen" ${isHoliday ? 'selected' : ''}>🏖️ Ingen (Ferie / Fri)</option>
      <optgroup label="Beboere">
        ${app.roommates.map(rm => `
          <option value="${rm.name}" ${rm.name === assigneeName ? 'selected' : ''}>
            ${rm.name}
          </option>
        `).join('')}
      </optgroup>
    `;
  }

  // Week Selector Bar
  document.getElementById('selectedWeekNum').textContent = `Uke ${weekData.week} (${weekData.year})`;
  document.getElementById('selectedWeekDates').textContent = `${weekData.dates}`;
  document.getElementById('selectedWeekPerson').textContent = isHoliday ? 'Ansvarlig: Ingen (Ferie)' : `Ansvarlig: ${assigneeName}`;

  // "Gå til nåværende uke" shortcut button
  const jumpBtn = document.getElementById('btnJumpToCurrentWeek');
  if (jumpBtn) {
    jumpBtn.style.display = isRealCurrent ? 'none' : 'inline-flex';
    jumpBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
      <span>Gå til nåværende uke (${app.realCurrentWeek})</span>
    `;
  }

  updateProgress();
}

function updateProgress() {
  const weekData = app.semesterWeeks.find(w => w.id === app.activeWeekId) || app.semesterWeeks[0];
  const isHoliday = app.getAssigneeForWeek(weekData) === 'Ingen';

  const tasks = app.getTasksForWeek(app.activeWeekId);
  const completedCount = tasks.filter(t => app.isTaskDone(app.activeWeekId, t.id)).length;
  const totalCount = tasks.length;
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const progressFill = document.getElementById('progressFill');
  const progressPct = document.getElementById('progressPct');
  const progressCounter = document.getElementById('progressCounter');
  const btnToggleAllText = document.getElementById('btnToggleAllText');

  if (progressFill) progressFill.style.width = isHoliday && completedCount === 0 ? '0%' : `${pct}%`;
  if (progressPct) {
    progressPct.textContent = isHoliday && completedCount === 0 ? 'Ferie' : `${pct}%`;
  }
  if (progressCounter) {
    if (isHoliday && completedCount === 0) {
      progressCounter.textContent = 'Ferieuke – ingen vaskeoppgaver påkrevd 🏖️';
    } else if (isHoliday) {
      progressCounter.textContent = `${completedCount} av ${totalCount} fullført (valgfritt under ferie)`;
    } else {
      progressCounter.textContent = `${completedCount} av ${totalCount} oppgaver fullført`;
    }
  }
  if (btnToggleAllText) {
    btnToggleAllText.textContent = completedCount === totalCount && totalCount > 0 ? 'Fjern markering' : 'Merk alle fullført';
  }

  // Update Category Badges
  ['kitchen', 'bathroom', 'general'].forEach(cat => {
    const catTasks = tasks.filter(t => t.category === cat);
    const catCompleted = catTasks.filter(t => app.isTaskDone(app.activeWeekId, t.id)).length;
    const badge = document.getElementById(`badge${cat.charAt(0).toUpperCase() + cat.slice(1)}`);
    if (badge) {
      badge.textContent = `${catCompleted}/${catTasks.length}`;
      if (catCompleted === catTasks.length && catTasks.length > 0) {
        badge.classList.add('all-done');
      } else {
        badge.classList.remove('all-done');
      }
    }
  });

  // Confetti trigger if 100% completed
  if (pct === 100 && totalCount > 0 && window.confetti && !isHoliday) {
    window.confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  }

  // Refresh schedule table if present to reflect historical progress count
  renderScheduleTable();
}

function renderWeeklyTasks() {
  const categories = {
    kitchen: document.getElementById('taskListKitchen'),
    bathroom: document.getElementById('taskListBathroom'),
    general: document.getElementById('taskListGeneral')
  };

  Object.values(categories).forEach(el => { if (el) el.innerHTML = ''; });

  const tasks = app.getTasksForWeek(app.activeWeekId);

  tasks.forEach(task => {
    const targetUl = categories[task.category] || categories.general;
    if (!targetUl) return;

    const isDone = app.isTaskDone(app.activeWeekId, task.id);
    const li = document.createElement('li');
    li.className = `task-item ${isDone ? 'completed' : ''}`;
    li.id = `task-${task.id}`;

    li.innerHTML = `
      <div class="custom-checkbox">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div class="task-details">
        <span class="task-text">${task.title}</span>
        <div class="task-tag-row">
          <span class="task-tag">${task.tag || 'Oppgave'}</span>
        </div>
      </div>
    `;

    li.addEventListener('click', () => {
      const nowDone = app.toggleTask(app.activeWeekId, task.id);
      li.classList.toggle('completed', nowDone);
      updateProgress();
    });

    targetUl.appendChild(li);
  });
}

function renderDeepClean() {
  const container = document.getElementById('deepCleanGrid');
  if (!container) return;
  container.innerHTML = '';

  const todayStr = formatDateToInputString(new Date());

  DEEP_CLEAN_TASKS.forEach(item => {
    const record = app.deepCleanHistory[item.id];
    const isCompleted = !!record;
    const formattedDate = record ? formatNorwegianDate(record.dateInput) : 'Ikke registrert ennå';
    const completedByStr = record?.completedBy ? `Utført av: <strong>${record.completedBy}</strong>` : '';
    const noteStr = record?.note ? `<span class="dc-note-pill">"${record.note}"</span>` : '';

    const card = document.createElement('div');
    card.className = `deep-clean-card ${isCompleted ? 'has-record' : ''}`;
    card.id = `dc-card-${item.id}`;

    card.innerHTML = `
      <div>
        <div class="dc-top">
          <span class="dc-icon">${item.icon}</span>
          <div class="dc-meta">
            <h4 class="dc-title">${item.title}</h4>
            <p class="dc-desc">${item.desc}</p>
          </div>
        </div>
      </div>

      <div class="dc-status-bar" data-action="open-cal">
        <div class="dc-status-text">
          <span class="dc-date-indicator">Sist gjort: <strong>${formattedDate}</strong></span>
          ${completedByStr ? `<span class="dc-by-indicator">${completedByStr}</span>` : ''}
          ${noteStr}
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="dc-footer">
        <button class="btn btn-accent btn-sm-dc btn-quick-today" data-id="${item.id}" title="Registrer som fullført i dag">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>Gjort i dag</span>
        </button>

        <button class="btn btn-glass btn-sm-dc btn-open-cal-view" data-id="${item.id}" title="Åpne kalendervisning for å velge dato">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <span>${isCompleted ? 'Endre dato' : 'Velg dato (Kalender)'}</span>
        </button>

        ${isCompleted ? `
          <button class="btn btn-icon-only btn-clear-dc" data-id="${item.id}" title="Fjern registrering">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ` : ''}
      </div>
    `;

    // 1. Quick "Gjort i dag" button
    const btnToday = card.querySelector('.btn-quick-today');
    btnToday.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentAssignee = app.getAssigneeForWeek(app.activeWeekId);
      app.saveDeepCleanEntry(item.id, todayStr, currentAssignee);
      renderDeepClean();
      if (window.confetti) window.confetti({ particleCount: 40, spread: 50 });
    });

    // 2. Open Calendar View
    const btnCal = card.querySelector('.btn-open-cal-view');
    btnCal.addEventListener('click', () => {
      openCalendarModal(item.id);
    });

    // Also click status bar to view/edit in calendar
    const statusBar = card.querySelector('.dc-status-bar');
    statusBar.style.cursor = 'pointer';
    statusBar.title = 'Klikk for å åpne kalendervisning';
    statusBar.addEventListener('click', () => {
      openCalendarModal(item.id);
    });

    // 3. Clear registration if needed
    const btnClear = card.querySelector('.btn-clear-dc');
    if (btnClear) {
      btnClear.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Fjerne registreringen for "${item.title}"?`)) {
          app.clearDeepCleanEntry(item.id);
          renderDeepClean();
        }
      });
    }

    container.appendChild(card);
  });

  // Also synchronize the full calendar view
  renderDeepCleanFullCalendar();
}

/* =========================================================
   Full Calendar View for Rare Tasks (Dypvask)
   ========================================================= */
let dcCalViewYear = new Date().getFullYear();
let dcCalViewMonth = new Date().getMonth();

function initDeepCleanViewToggle() {
  const btnCards = document.getElementById('btnDcViewCards');
  const btnCalendar = document.getElementById('btnDcViewCalendar');
  const cardsContainer = document.getElementById('deepCleanGrid');
  const calContainer = document.getElementById('deepCleanCalendarView');

  if (!btnCards || !btnCalendar) return;

  const setViewMode = (mode) => {
    if (mode === 'calendar') {
      btnCalendar.classList.add('active');
      btnCards.classList.remove('active');
      if (cardsContainer) cardsContainer.style.display = 'none';
      if (calContainer) calContainer.style.display = 'block';
      renderDeepCleanFullCalendar();
    } else {
      btnCards.classList.add('active');
      btnCalendar.classList.remove('active');
      if (cardsContainer) cardsContainer.style.display = 'grid';
      if (calContainer) calContainer.style.display = 'none';
    }
    localStorage.setItem('vaske_dc_view_mode', mode);
  };

  btnCards.addEventListener('click', () => setViewMode('cards'));
  btnCalendar.addEventListener('click', () => setViewMode('calendar'));

  // Month navigation in the full calendar view
  document.getElementById('btnDcCalPrev')?.addEventListener('click', () => {
    dcCalViewMonth--;
    if (dcCalViewMonth < 0) {
      dcCalViewMonth = 11;
      dcCalViewYear--;
    }
    renderDeepCleanFullCalendar();
  });

  document.getElementById('btnDcCalNext')?.addEventListener('click', () => {
    dcCalViewMonth++;
    if (dcCalViewMonth > 11) {
      dcCalViewMonth = 0;
      dcCalViewYear++;
    }
    renderDeepCleanFullCalendar();
  });

  document.getElementById('btnDcCalToday')?.addEventListener('click', () => {
    const now = new Date();
    dcCalViewYear = now.getFullYear();
    dcCalViewMonth = now.getMonth();
    renderDeepCleanFullCalendar();
  });

  const savedMode = localStorage.getItem('vaske_dc_view_mode') || 'cards';
  setViewMode(savedMode);
}

function renderDeepCleanFullCalendar() {
  const monthTitle = document.getElementById('dcCalCurrentMonth');
  if (monthTitle) {
    monthTitle.textContent = `${NORWEGIAN_MONTHS[dcCalViewMonth]} ${dcCalViewYear}`;
  }

  const legend = document.getElementById('dcCalLegend');
  if (legend) {
    legend.innerHTML = DEEP_CLEAN_TASKS.map(t => `
      <span class="legend-item" title="${t.title}">
        <span>${t.icon}</span>
        <span>${t.title.split(' ')[0]}</span>
      </span>
    `).join('');
  }

  const grid = document.getElementById('dcFullCalGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const today = new Date();
  const isThisMonth = today.getFullYear() === dcCalViewYear && today.getMonth() === dcCalViewMonth;
  const todayDate = today.getDate();

  const firstDayIndex = (new Date(dcCalViewYear, dcCalViewMonth, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(dcCalViewYear, dcCalViewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(dcCalViewYear, dcCalViewMonth, 0).getDate();

  const buildCell = (year, month, day, isOtherMonth) => {
    const cell = document.createElement('div');
    cell.className = `dc-cal-cell ${isOtherMonth ? 'other-month' : ''}`;
    
    const isTodayCell = !isOtherMonth && isThisMonth && day === todayDate;
    if (isTodayCell) cell.classList.add('is-today');

    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const header = document.createElement('div');
    header.className = 'cell-day-header';
    header.innerHTML = `
      <span class="cell-day-num ${isTodayCell ? 'today-circle' : ''}">${day}</span>
    `;
    cell.appendChild(header);

    const matchingTasks = [];
    DEEP_CLEAN_TASKS.forEach(t => {
      const rec = app.deepCleanHistory[t.id];
      if (rec && rec.dateInput === dayStr) {
        matchingTasks.push({ task: t, record: rec });
      }
    });

    matchingTasks.forEach(({ task, record }) => {
      const pill = document.createElement('div');
      pill.className = 'dc-event-pill';
      pill.title = `${task.title} • Utført av ${record.completedBy || ''} ${record.note ? `("${record.note}")` : ''}`;
      pill.innerHTML = `
        <span class="event-pill-icon">${task.icon}</span>
        <span class="event-pill-text">${task.title}</span>
        <span class="event-pill-person">${record.completedBy ? record.completedBy.charAt(0) : ''}</span>
      `;
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        openCalendarModal(task.id);
      });
      cell.appendChild(pill);
    });

    cell.addEventListener('click', () => {
      const defaultTask = matchingTasks.length > 0 ? matchingTasks[0].task.id : DEEP_CLEAN_TASKS[0].id;
      openCalendarModal(defaultTask);
      selectCalendarDate(new Date(year, month, day));
    });

    return cell;
  };

  // Previous month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = dcCalViewMonth === 0 ? 11 : dcCalViewMonth - 1;
    const prevYear = dcCalViewMonth === 0 ? dcCalViewYear - 1 : dcCalViewYear;
    grid.appendChild(buildCell(prevYear, prevMonth, day, true));
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    grid.appendChild(buildCell(dcCalViewYear, dcCalViewMonth, d, false));
  }

  // Next month padding
  const totalRendered = firstDayIndex + daysInMonth;
  const remaining = totalRendered <= 35 ? 35 - totalRendered : (totalRendered <= 42 ? 42 - totalRendered : 0);
  for (let d = 1; d <= remaining; d++) {
    const nextMonth = dcCalViewMonth === 11 ? 0 : dcCalViewMonth + 1;
    const nextYear = dcCalViewMonth === 11 ? dcCalViewYear + 1 : dcCalViewYear;
    grid.appendChild(buildCell(nextYear, nextMonth, d, true));
  }

  renderStatusStrip();
}

function renderStatusStrip() {
  const strip = document.getElementById('dcTasksStatusStrip');
  if (!strip) return;
  strip.innerHTML = '';

  const now = Date.now();
  DEEP_CLEAN_TASKS.forEach(t => {
    const rec = app.deepCleanHistory[t.id];
    const isDone = !!rec;
    const daysAgo = rec ? Math.round((now - (rec.updatedAt || rec.timestamp || now)) / (1000 * 60 * 60 * 24)) : 999;
    const isWarn = !isDone || daysAgo > 30;

    const chip = document.createElement('div');
    chip.className = `status-chip ${isWarn ? 'status-chip-warn' : 'status-chip-ok'}`;
    chip.style.cursor = 'pointer';
    chip.title = 'Klikk for å registrere eller endre dato i kalenderen';
    chip.innerHTML = `
      <span>${t.icon}</span>
      <strong>${t.title}:</strong>
      <span>${isDone ? rec.displayDate : 'Ikke gjort'}</span>
      ${rec?.completedBy ? `<span>(${rec.completedBy})</span>` : ''}
    `;
    chip.addEventListener('click', () => {
      openCalendarModal(t.id);
    });
    strip.appendChild(chip);
  });
}

/* =========================================================
   Schedule & Semester Management
   ========================================================= */

function initHeroAssigneeSelect() {
  const select = document.getElementById('heroAssigneeSelect');
  if (!select) return;

  select.addEventListener('change', (e) => {
    const val = e.target.value;
    if (!val) return;
    const weekData = app.semesterWeeks.find(w => w.id === app.activeWeekId) || app.semesterWeeks[0];
    app.scheduleAssignments[weekData.id] = val;
    app.scheduleAssignments[weekData.week] = val;
    app.save('vaske_schedule', app.scheduleAssignments);
    renderCurrentWeek();
    renderScheduleTable();
    if (val === 'Ingen' && window.confetti) {
      window.confetti({ particleCount: 35, spread: 50 });
    }
  });
}

function initScheduleExpansion() {
  const btnExpand = document.getElementById('btnExpandNextYear');
  if (btnExpand) {
    btnExpand.addEventListener('click', () => {
      const maxYear = Math.max(...app.semesterWeeks.map(w => w.year));
      const nextYear = maxYear + 1;
      if (confirm(`Vil du utvide vaskeplanen til neste år (${nextYear}) for alle ${app.roommates.length} beboerne?`)) {
        app.expandToNextYear();
      }
    });
  }
  updateExpandButton();
}

function updateExpandButton() {
  if (!app || !app.semesterWeeks || app.semesterWeeks.length === 0) return;
  const maxYear = Math.max(...app.semesterWeeks.map(w => w.year));
  const btnText = document.getElementById('btnExpandText');
  if (btnText) {
    btnText.textContent = `+ Utvid til neste år (${maxYear + 1})`;
  }
}

function renderSemesterFilterBar() {
  const bar = document.getElementById('semesterFilterBar');
  if (!bar) return;
  bar.innerHTML = '';

  // Find unique semesters
  const semesters = [];
  app.semesterWeeks.forEach(w => {
    if (!semesters.includes(w.semester)) {
      semesters.push(w.semester);
    }
  });

  // "Alle" pill
  const allPill = document.createElement('button');
  allPill.className = `sem-pill ${app.selectedSemesterFilter === 'all' ? 'active' : ''}`;
  allPill.textContent = `Alle (${app.semesterWeeks.length} uker)`;
  allPill.addEventListener('click', () => {
    app.selectedSemesterFilter = 'all';
    renderSemesterFilterBar();
    renderScheduleTable();
  });
  bar.appendChild(allPill);

  // Individual semester pills
  semesters.forEach(sem => {
    const semWeeksCount = app.semesterWeeks.filter(w => w.semester === sem).length;
    const pill = document.createElement('button');
    pill.className = `sem-pill ${app.selectedSemesterFilter === sem ? 'active' : ''}`;
    pill.textContent = `${sem} (${semWeeksCount} uker)`;
    pill.addEventListener('click', () => {
      app.selectedSemesterFilter = sem;
      renderSemesterFilterBar();
      renderScheduleTable();
    });
    bar.appendChild(pill);
  });

  // If there are extra years added (beyond 2026), provide a remove option
  const years = [...new Set(app.semesterWeeks.map(w => w.year))];
  years.filter(y => y > 2026).forEach(y => {
    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove-roommate';
    removeBtn.style.marginTop = '0';
    removeBtn.style.height = '28px';
    removeBtn.style.width = 'auto';
    removeBtn.style.padding = '0 8px';
    removeBtn.style.fontSize = '0.75rem';
    removeBtn.title = `Fjern ${y} fra vaskeplanen`;
    removeBtn.textContent = `Fjern ${y} ✕`;
    removeBtn.addEventListener('click', () => {
      app.removeYear(y);
    });
    bar.appendChild(removeBtn);
  });
}

function renderScheduleTable() {
  const tbody = document.getElementById('scheduleTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  // Filter weeks based on selected semester filter
  const filteredWeeks = app.selectedSemesterFilter === 'all'
    ? app.semesterWeeks
    : app.semesterWeeks.filter(w => w.semester === app.selectedSemesterFilter);

  filteredWeeks.forEach(w => {
    const tr = document.createElement('tr');
    if (w.id === app.activeWeekId) {
      tr.className = 'current-week-row';
    }

    const assignedPerson = app.getAssigneeForWeek(w);
    const isHoliday = assignedPerson === 'Ingen';
    const isRealCurrent = w.isCurrent;
    const weekTasks = app.getTasksForWeek(w.id);
    const totalCount = weekTasks.length;
    const completedCount = weekTasks.filter(t => app.isTaskDone(w.id, t.id)).length;
    const isAllDone = totalCount > 0 && completedCount === totalCount;
    const isPartial = completedCount > 0 && completedCount < totalCount;

    if (w.id === app.activeWeekId) {
      tr.className = isHoliday ? 'current-week-row holiday-week-row' : 'current-week-row';
    } else if (isHoliday) {
      tr.className = 'holiday-week-row';
    }

    let statusBadge = '';
    if (isHoliday) {
      if (isRealCurrent) {
        statusBadge = `<span class="task-tag tag-holiday"><span class="dot-pulse"></span>🏖️ Ferieuke</span>`;
      } else {
        statusBadge = `<span class="task-tag tag-holiday">🏖️ Ferie</span>`;
      }
    } else if (isRealCurrent) {
      if (isAllDone) {
        statusBadge = `<span class="status-live-tag"><span class="dot-pulse"></span>Denne uken: Fullført (${completedCount}/${totalCount})</span>`;
      } else {
        statusBadge = `<span class="status-live-tag"><span class="dot-pulse"></span>Denne uken (${completedCount}/${totalCount})</span>`;
      }
    } else if (isAllDone) {
      statusBadge = `<span class="task-tag tag-done">✓ Fullført (${completedCount}/${totalCount})</span>`;
    } else if (isPartial) {
      statusBadge = `<span class="task-tag tag-partial">Påbegynt (${completedCount}/${totalCount})</span>`;
    } else if (w.year < app.realCurrentYear || (w.year === app.realCurrentYear && w.week < app.realCurrentWeek)) {
      statusBadge = `<span class="task-tag tag-empty">Ikke fullført (${completedCount}/${totalCount})</span>`;
    } else {
      statusBadge = `<span class="task-tag tag-empty">Kommende uke</span>`;
    }

    tr.innerHTML = `
      <td>
        <strong>Uke ${w.week}</strong>
        <span class="sem-badge">${w.semester}</span>
      </td>
      <td>${w.dates}</td>
      <td>
        <div class="person-select-wrap">
          <select data-week-id="${w.id}">
            <option value="Ingen" ${isHoliday ? 'selected' : ''}>🏖️ Ingen (Ferie / Fri)</option>
            <optgroup label="Beboere">
              ${app.roommates.map(rm => `
                <option value="${rm.name}" ${rm.name === assignedPerson ? 'selected' : ''}>
                  ${rm.name}
                </option>
              `).join('')}
            </optgroup>
          </select>
        </div>
      </td>
      <td>
        ${statusBadge}
      </td>
      <td>
        <button class="btn btn-glass-secondary btn-select-week" data-week-id="${w.id}">
          ${w.id === app.activeWeekId ? 'Valgt nå' : 'Se uke'}
        </button>
      </td>
    `;

    const select = tr.querySelector('select');
    select.addEventListener('change', (e) => {
      app.scheduleAssignments[w.id] = e.target.value;
      app.scheduleAssignments[w.week] = e.target.value;
      app.save('vaske_schedule', app.scheduleAssignments);
      renderScheduleTable();
      if (w.id === app.activeWeekId) {
        renderCurrentWeek();
      }
    });

    const btnSelect = tr.querySelector('.btn-select-week');
    btnSelect.addEventListener('click', () => {
      app.activeWeekId = w.id;
      renderCurrentWeek();
      renderWeeklyTasks();
      renderScheduleTable();
      document.querySelector('[data-tab="weekly"]').click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    tbody.appendChild(tr);
  });
}

/* =========================================================
   Interactive Mini Calendar Modal Controller
   ========================================================= */
let calCurrentTaskId = null;
let calSelectedDate = new Date();
let calViewYear = calSelectedDate.getFullYear();
let calViewMonth = calSelectedDate.getMonth();

const NORWEGIAN_MONTHS = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
];

function initCalendarModal() {
  const modal = document.getElementById('calendarModal');
  const btnClose = document.getElementById('btnCloseCalModal');
  const btnCancel = document.getElementById('btnCancelCalModal');
  const btnSave = document.getElementById('btnSaveCalEntry');
  const btnPrev = document.getElementById('btnCalPrevMonth');
  const btnNext = document.getElementById('btnCalNextMonth');

  const closeModal = () => modal.classList.remove('active');
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Month navigation
  btnPrev.addEventListener('click', () => {
    calViewMonth--;
    if (calViewMonth < 0) {
      calViewMonth = 11;
      calViewYear--;
    }
    renderMiniCalendar();
  });

  btnNext.addEventListener('click', () => {
    calViewMonth++;
    if (calViewMonth > 11) {
      calViewMonth = 0;
      calViewYear++;
    }
    renderMiniCalendar();
  });

  // Presets
  document.getElementById('presetToday').addEventListener('click', () => {
    selectCalendarDate(new Date(), 'Today');
  });

  document.getElementById('presetYesterday').addEventListener('click', () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    selectCalendarDate(d, 'Yesterday');
  });

  document.getElementById('preset2Days').addEventListener('click', () => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    selectCalendarDate(d, '2Days');
  });

  document.getElementById('presetLastSunday').addEventListener('click', () => {
    const d = new Date();
    const day = d.getDay(); // 0 is Sunday
    const diff = day === 0 ? 7 : day;
    d.setDate(d.getDate() - diff);
    selectCalendarDate(d, 'LastSunday');
  });

  // Save
  btnSave.addEventListener('click', () => {
    if (!calCurrentTaskId) return;
    const person = document.getElementById('calPersonSelect').value;
    const note = document.getElementById('calNoteInput').value;
    const dateStr = formatDateToInputString(calSelectedDate);

    app.saveDeepCleanEntry(calCurrentTaskId, dateStr, person, note);
    renderDeepClean();
    closeModal();
    if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
  });
}

function selectCalendarDate(date, presetId = null) {
  calSelectedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  calViewYear = calSelectedDate.getFullYear();
  calViewMonth = calSelectedDate.getMonth();

  document.querySelectorAll('.preset-chip').forEach(chip => chip.classList.remove('active'));
  if (presetId) {
    const chip = document.getElementById(`preset${presetId}`);
    if (chip) chip.classList.add('active');
  }

  updateSelectedDisplay();
  renderMiniCalendar();
}

function updateSelectedDisplay() {
  const display = document.getElementById('calSelectedDisplay');
  if (display) {
    display.textContent = formatNorwegianDate(formatDateToInputString(calSelectedDate));
  }
}

function openCalendarModal(taskId) {
  calCurrentTaskId = taskId;
  const taskObj = DEEP_CLEAN_TASKS.find(t => t.id === taskId);
  const record = app.deepCleanHistory[taskId];

  document.getElementById('calModalTitle').textContent = taskObj ? taskObj.title : 'Velg dato';
  document.getElementById('calModalTaskSubtitle').textContent = taskObj ? taskObj.desc : 'Registrer når oppgaven ble utført';

  const select = document.getElementById('calPersonSelect');
  select.innerHTML = app.roommates.map(rm => `
    <option value="${rm.name}" ${record?.completedBy === rm.name ? 'selected' : ''}>
      ${rm.name}
    </option>
  `).join('');

  document.getElementById('calNoteInput').value = record?.note || '';

  if (record && record.dateInput) {
    const parts = record.dateInput.split('-');
    calSelectedDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  } else {
    calSelectedDate = new Date();
  }

  calViewYear = calSelectedDate.getFullYear();
  calViewMonth = calSelectedDate.getMonth();

  document.querySelectorAll('.preset-chip').forEach(chip => chip.classList.remove('active'));

  updateSelectedDisplay();
  renderMiniCalendar();

  document.getElementById('calendarModal').classList.add('active');
}

function renderMiniCalendar() {
  const title = document.getElementById('calMonthTitle');
  if (title) {
    title.textContent = `${NORWEGIAN_MONTHS[calViewMonth]} ${calViewYear}`;
  }

  const grid = document.getElementById('calDaysGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const today = new Date();
  const isThisMonth = today.getFullYear() === calViewYear && today.getMonth() === calViewMonth;
  const todayDate = today.getDate();

  const selYear = calSelectedDate.getFullYear();
  const selMonth = calSelectedDate.getMonth();
  const selDay = calSelectedDate.getDate();

  const firstDayIndex = (new Date(calViewYear, calViewMonth, 1).getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(calViewYear, calViewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(calViewYear, calViewMonth, 0).getDate();

  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day-btn other-month';
    btn.textContent = dayNum;
    btn.addEventListener('click', () => {
      selectCalendarDate(new Date(calViewYear, calViewMonth - 1, dayNum));
    });
    grid.appendChild(btn);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day-btn';
    btn.textContent = d;

    if (isThisMonth && d === todayDate) {
      btn.classList.add('today');
      btn.title = 'I dag';
    }

    if (calViewYear === selYear && calViewMonth === selMonth && d === selDay) {
      btn.classList.add('selected');
    }

    btn.addEventListener('click', () => {
      selectCalendarDate(new Date(calViewYear, calViewMonth, d));
    });

    grid.appendChild(btn);
  }

  const totalRendered = firstDayIndex + daysInMonth;
  const remaining = totalRendered <= 35 ? 35 - totalRendered : (totalRendered <= 42 ? 42 - totalRendered : 0);
  for (let d = 1; d <= remaining; d++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cal-day-btn other-month';
    btn.textContent = d;
    btn.addEventListener('click', () => {
      selectCalendarDate(new Date(calViewYear, calViewMonth + 1, d));
    });
    grid.appendChild(btn);
  }
}

/* --- Navigation & Interaction Handlers --- */

function initNavigation() {
  // Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      if (targetTab === 'weekly') document.getElementById('tabContentWeekly').classList.add('active');
      if (targetTab === 'deepclean') document.getElementById('tabContentDeepClean').classList.add('active');
      if (targetTab === 'schedule') {
        renderScheduleTable();
        document.getElementById('tabContentSchedule').classList.add('active');
      }
    });
  });

  // Week Switcher Controls
  document.getElementById('btnPrevWeek').addEventListener('click', () => {
    const currentIndex = app.semesterWeeks.findIndex(w => w.id === app.activeWeekId);
    if (currentIndex > 0) {
      app.activeWeekId = app.semesterWeeks[currentIndex - 1].id;
      renderCurrentWeek();
      renderWeeklyTasks();
      renderScheduleTable();
    }
  });

  document.getElementById('btnNextWeek').addEventListener('click', () => {
    const currentIndex = app.semesterWeeks.findIndex(w => w.id === app.activeWeekId);
    if (currentIndex < app.semesterWeeks.length - 1) {
      app.activeWeekId = app.semesterWeeks[currentIndex + 1].id;
      renderCurrentWeek();
      renderWeeklyTasks();
      renderScheduleTable();
    }
  });

  // Jump to Current Week button
  const jumpBtn = document.getElementById('btnJumpToCurrentWeek');
  if (jumpBtn) {
    jumpBtn.addEventListener('click', () => {
      const current = app.semesterWeeks.find(w => w.isCurrent);
      if (current) {
        app.activeWeekId = current.id;
      } else {
        app.activeWeekId = app.semesterWeeks[0].id;
      }
      renderCurrentWeek();
      renderWeeklyTasks();
      renderScheduleTable();
    });
  }

  // Hero Buttons
  document.getElementById('btnToggleAll').addEventListener('click', () => {
    const tasks = app.getTasksForWeek(app.activeWeekId);
    const completedCount = tasks.filter(t => app.isTaskDone(app.activeWeekId, t.id)).length;
    const shouldMarkAll = completedCount !== tasks.length;
    app.setAllTasks(app.activeWeekId, shouldMarkAll);
    renderWeeklyTasks();
    updateProgress();
  });

  document.getElementById('btnResetWeek').addEventListener('click', () => {
    const activeWeekObj = app.semesterWeeks.find(w => w.id === app.activeWeekId);
    const weekLabel = activeWeekObj ? `uke ${activeWeekObj.week}` : 'denne uken';
    if (confirm(`Vil du nullstille avkryssingene for ${weekLabel}?`)) {
      app.setAllTasks(app.activeWeekId, false);
      renderWeeklyTasks();
      updateProgress();
    }
  });

  document.getElementById('btnAutoRotate').addEventListener('click', () => {
    if (confirm('Vil du auto-fordele de beboerne rullerende over hele vaskeplanen?')) {
      app.autoRotateSchedule();
      renderCurrentWeek();
      renderScheduleTable();
    }
  });
}

function initAddTaskForm() {
  const form = document.getElementById('formAddTask');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = document.getElementById('inputNewTask');
    const categorySelect = document.getElementById('selectTaskCategory');
    const title = input.value.trim();
    if (!title) return;

    app.addCustomTask(app.activeWeekId, categorySelect.value, title);
    input.value = '';
    renderWeeklyTasks();
    updateProgress();
  });
}

function initRoommatesModal() {
  const modal = document.getElementById('roommatesModal');
  const btnOpen = document.getElementById('btnEditRoommates');
  const btnClose = document.getElementById('btnCloseModal');
  const btnCancel = document.getElementById('btnCancelModal');
  const form = document.getElementById('formRoommates');

  const countDisplay = document.getElementById('roommateCountDisplay');
  const btnDec = document.getElementById('btnDecrementRoommates');
  const btnInc = document.getElementById('btnIncrementRoommates');
  const btnAddRow = document.getElementById('btnAddRoommateRow');
  const container = document.getElementById('roommatesInputsContainer');

  let workingRoommates = [];

  const renderInputs = () => {
    if (countDisplay) countDisplay.textContent = workingRoommates.length;
    if (!container) return;
    container.innerHTML = '';

    workingRoommates.forEach((rm, index) => {
      const colorNum = (index % 8) + 1;
      const group = document.createElement('div');
      group.className = 'roommate-input-group';
      group.innerHTML = `
        <div class="avatar-tag avatar-color-${colorNum}">${index + 1}</div>
        <div class="input-wrap">
          <label for="rm-input-${index}">Beboer ${index + 1}</label>
          <input type="text" id="rm-input-${index}" class="rm-name-input" data-index="${index}" value="${rm.name}" placeholder="Navn på beboer..." required>
        </div>
        ${workingRoommates.length > 2 ? `
          <button type="button" class="btn-remove-roommate" data-index="${index}" title="Fjern denne beboeren">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ` : ''}
      `;

      const input = group.querySelector('.rm-name-input');
      input.addEventListener('input', (e) => {
        workingRoommates[index].name = e.target.value;
      });

      const btnRemove = group.querySelector('.btn-remove-roommate');
      if (btnRemove) {
        btnRemove.addEventListener('click', () => {
          if (workingRoommates.length > 2) {
            workingRoommates.splice(index, 1);
            renderInputs();
          }
        });
      }

      container.appendChild(group);
    });
  };

  const addRoommate = () => {
    if (workingRoommates.length >= 10) return;
    const newIdx = workingRoommates.length + 1;
    workingRoommates.push({
      id: String(Date.now() + Math.random()),
      name: `Romkamerat ${newIdx}`,
      colorIndex: (workingRoommates.length % 8) + 1
    });
    renderInputs();
  };

  const removeRoommate = () => {
    if (workingRoommates.length > 2) {
      workingRoommates.pop();
      renderInputs();
    }
  };

  if (btnInc) btnInc.addEventListener('click', addRoommate);
  if (btnAddRow) btnAddRow.addEventListener('click', addRoommate);
  if (btnDec) btnDec.addEventListener('click', removeRoommate);

  const openModal = () => {
    workingRoommates = app.roommates.map((r, i) => ({
      id: r.id || String(i + 1),
      name: r.name,
      colorIndex: (i % 8) + 1
    }));
    renderInputs();
    modal.classList.add('active');
  };

  const closeModal = () => modal.classList.remove('active');

  btnOpen.addEventListener('click', openModal);
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const cleanRoommates = workingRoommates.map((rm, idx) => ({
      id: rm.id || String(idx + 1),
      name: rm.name.trim() || `Beboer ${idx + 1}`,
      colorIndex: (idx % 8) + 1
    }));

    const oldNames = [...app.roommates.map(r => r.name)];
    app.roommates = cleanRoommates;
    app.save('vaske_roommates', app.roommates);

    app.semesterWeeks.forEach((w, index) => {
      const current = app.scheduleAssignments[w.id];
      if (current === 'Ingen') {
        return; // Bevar ferieuker uendret
      }
      const matchIdx = oldNames.indexOf(current);
      if (matchIdx !== -1 && matchIdx < app.roommates.length) {
        app.scheduleAssignments[w.id] = app.roommates[matchIdx].name;
      } else {
        const rmIndex = index % app.roommates.length;
        app.scheduleAssignments[w.id] = app.roommates[rmIndex].name;
      }
    });
    app.save('vaske_schedule', app.scheduleAssignments);

    renderHeaderRoommates();
    renderCurrentWeek();
    renderDeepClean();
    renderScheduleTable();
    closeModal();
    if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
  });
}
