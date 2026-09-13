export interface BugMeta {
  color: string;
  icon: string;
}

export const STATUS_META: Record<string, BugMeta> = {
  Open: { color: '#2563EB', icon: 'circle' },
  'In Progress': { color: '#D97706', icon: 'refresh-cw' },
  'In Test': { color: '#7C3AED', icon: 'activity' },
  Resolved: { color: '#059669', icon: 'check-circle' },
  Closed: { color: '#6B7280', icon: 'x-circle' },
  'On Hold': { color: '#B45309', icon: 'pause-circle' },
  'Needs Support': { color: '#DC2626', icon: 'life-buoy' },
  'Not an issue': { color: '#9CA3AF', icon: 'slash' }
};

export const IMPACT_META: Record<string, BugMeta> = {
  Cosmetic: { color: '#9CA3AF', icon: 'eye' },
  Minor: { color: '#3B82F6', icon: 'alert-circle' },
  Major: { color: '#F59E0B', icon: 'alert-triangle' },
  Critical: { color: '#EF4444', icon: 'zap' },
  Blocker: { color: '#7F1D1D', icon: 'alert-octagon' }
};
