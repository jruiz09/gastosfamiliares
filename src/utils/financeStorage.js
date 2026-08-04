const STORAGE_KEYS = {
  budgets: 'gastos-familiares-budgets',
  goals: 'gastos-familiares-goals',
  reminders: 'gastos-familiares-reminders',
  movementMeta: 'gastos-familiares-movement-meta',
};

function readStorage(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getBudgets() {
  return readStorage(STORAGE_KEYS.budgets, []);
}

export function saveBudgets(budgets) {
  writeStorage(STORAGE_KEYS.budgets, budgets);
}

export function getGoals() {
  return readStorage(STORAGE_KEYS.goals, []);
}

export function saveGoals(goals) {
  writeStorage(STORAGE_KEYS.goals, goals);
}

export function getReminders() {
  return readStorage(STORAGE_KEYS.reminders, []);
}

export function saveReminders(reminders) {
  writeStorage(STORAGE_KEYS.reminders, reminders);
}

export function getMovementMeta() {
  return readStorage(STORAGE_KEYS.movementMeta, {});
}

export function saveMovementMeta(meta) {
  writeStorage(STORAGE_KEYS.movementMeta, meta);
}

export function upsertMovementMeta(movementId, payload) {
  const meta = getMovementMeta();
  const nextMeta = {
    ...meta,
    [movementId]: {
      ...(meta[movementId] || {}),
      ...payload,
    },
  };
  saveMovementMeta(nextMeta);
  return nextMeta;
}

export function getMovementMetaById(movementId) {
  const meta = getMovementMeta();
  return meta[movementId] || {};
}

export function getMovementMetaList(movements = []) {
  return movements.map((movement) => ({
    ...movement,
    ...getMovementMetaById(movement.id),
  }));
}

export function getBudgetAlerts(budgets = [], gastos = []) {
  const totalsByCategory = gastos.reduce((acc, item) => {
    const category = item.categoria?.nombre || item.Categoria?.nombre || 'Sin categoría';
    acc[category] = (acc[category] || 0) + Number(item.monto || 0);
    return acc;
  }, {});

  return budgets
    .map((budget) => {
      const spent = totalsByCategory[budget.category] || 0;
      const progress = budget.amount > 0 ? Math.min(100, Math.round((spent / budget.amount) * 100)) : 0;
      return {
        ...budget,
        spent,
        progress,
        isOver: spent > budget.amount,
      };
    })
    .filter((item) => item.progress > 0 || item.isOver);
}
