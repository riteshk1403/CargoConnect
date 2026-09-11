/**
 * CargoConnect Notification Sound Utility
 * 
 * Provides professional, subtle audio chime feedback for important logistics notifications.
 * Features:
 * - HTML5 Audio playback with Web Audio API synthesizer fallback
 * - LocalStorage persistence for user sound preferences (enabled/disabled, volume)
 * - Strict duplicate suppression (per notification ID)
 * - Initial load protection (prevents ringing on historical notifications)
 * - Multi-tab coordination
 * - Silent error handling for browser autoplay restrictions
 */

const STORAGE_KEYS = {
  SOUND_ENABLED: 'cargoconnect_notification_sound_enabled',
  SOUND_VOLUME: 'cargoconnect_notification_sound_volume',
  PLAYED_IDS: 'cargoconnect_played_notifications',
  LAST_TRIGGER: 'cargoconnect_last_sound_trigger'
};

// In-memory set of already played notification IDs during this session
const playedNotificationIds = new Set();
let isSystemInitialized = false;

// Audio instance cache
let audioInstance = null;
let audioContextInstance = null;

/**
 * Get whether notification sound is enabled (Default: true)
 */
export const isNotificationSoundEnabled = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED);
    return saved !== null ? saved === 'true' : true;
  } catch {
    return true;
  }
};

/**
 * Set notification sound enabled state
 */
export const setNotificationSoundEnabled = (enabled) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, String(enabled));
  } catch (err) {
    console.warn('Failed to save sound enabled preference:', err);
  }
};

/**
 * Get notification sound volume (0 - 100, Default: 60)
 */
export const getNotificationSoundVolume = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_VOLUME);
    if (saved !== null) {
      const vol = parseInt(saved, 10);
      if (!isNaN(vol) && vol >= 0 && vol <= 100) {
        return vol;
      }
    }
    return 60;
  } catch {
    return 60;
  }
};

/**
 * Set notification sound volume (0 - 100)
 */
export const setNotificationSoundVolume = (volume) => {
  try {
    const clamped = Math.max(0, Math.min(100, Math.round(volume)));
    localStorage.setItem(STORAGE_KEYS.SOUND_VOLUME, String(clamped));
  } catch (err) {
    console.warn('Failed to save sound volume preference:', err);
  }
};

/**
 * Load played notification IDs from localStorage into in-memory Set
 */
const loadPlayedIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLAYED_IDS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => playedNotificationIds.add(id));
      }
    }
  } catch {
    // Ignore localStorage parse errors
  }
};

/**
 * Persist played notification ID to memory and localStorage (retaining last 100)
 */
const markNotificationPlayed = (id) => {
  if (id === null || id === undefined) return;
  playedNotificationIds.add(id);

  try {
    const list = Array.from(playedNotificationIds).slice(-100);
    localStorage.setItem(STORAGE_KEYS.PLAYED_IDS, JSON.stringify(list));
  } catch {
    // Ignore storage errors
  }
};

/**
 * Check if a notification ID has already triggered audio
 */
export const hasNotificationPlayed = (id) => {
  if (id === null || id === undefined) return false;
  if (playedNotificationIds.size === 0) {
    loadPlayedIds();
  }
  return playedNotificationIds.has(id);
};

/**
 * Synthesizes a clean, harmonic 4-chord ascending chime using Web Audio API
 * (Used as seamless primary/fallback engine)
 */
const synthesizeChime = (volumeDecimal) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!audioContextInstance || audioContextInstance.state === 'closed') {
      audioContextInstance = new AudioCtx();
    }

    if (audioContextInstance.state === 'suspended') {
      audioContextInstance.resume().catch(() => {});
    }

    const ctx = audioContextInstance;
    const now = ctx.currentTime;

    // Master Gain for volume
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(Math.max(0.001, volumeDecimal * 0.4), now);
    masterGain.connect(ctx.destination);

    // Harmonic Chord Notes: D5 (587.33Hz), F#5 (739.99Hz), A5 (880.00Hz), D6 (1174.66Hz)
    const notes = [
      { freq: 587.33, start: 0.00, dur: 0.6 },
      { freq: 739.99, start: 0.10, dur: 0.65 },
      { freq: 880.00, start: 0.20, dur: 0.75 },
      { freq: 1174.66, start: 0.32, dur: 0.85 }
    ];

    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + start);

      // Soft envelope (Gentle 15ms attack, smooth exponential decay)
      noteGain.gain.setValueAtTime(0.0001, now + start);
      noteGain.gain.linearRampToValueAtTime(0.7, now + start + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start(now + start);
      osc.stop(now + start + dur + 0.05);
    });
  } catch (err) {
    // Non-blocking development warning only
    console.debug('Web Audio synthesis prevented:', err?.message);
  }
};

/**
 * Internal sound player
 */
const executeSoundPlayback = (volumePercent) => {
  const volumeDecimal = Math.max(0, Math.min(1, volumePercent / 100));
  if (volumeDecimal <= 0) return;

  try {
    if (!audioInstance) {
      audioInstance = new Audio('/sounds/notification.mp3');
      audioInstance.preload = 'auto';
    }

    audioInstance.volume = volumeDecimal;
    audioInstance.currentTime = 0;

    const playPromise = audioInstance.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If HTML5 audio playback fails (autoplay restrictions or network), fallback to Web Audio API
        synthesizeChime(volumeDecimal);
      });
    }
  } catch {
    synthesizeChime(volumeDecimal);
  }
};

/**
 * Play the notification chime for a test
 */
export const playTestNotificationSound = () => {
  const vol = getNotificationSoundVolume();
  executeSoundPlayback(vol);
};

/**
 * Determine if a notification is important / actionable and eligible for ringtone
 */
export const isImportantNotification = (notification) => {
  if (!notification) return false;

  const type = String(notification.type || '').toUpperCase();
  const title = String(notification.title || '').toLowerCase();
  const message = String(notification.message || '').toLowerCase();

  // Types that ALWAYS trigger sound
  const importantTypes = [
    'ALERT',
    'WARNING',
    'URGENT',
    'ACTION_REQUIRED',
    'NEW_SHIPMENT_OFFER',
    'NEW_OFFER',
    'OFFER',
    'COMMISSION_PAYMENT_REQUIRED',
    'COMMISSION',
    'SHIPMENT_DELAYED',
    'DELIVERY_FAILED',
    'REASSIGNMENT_REQUIRED',
    'BREAKDOWN',
    'COMPLAINT',
    'CALL_REQUEST',
    'PAYMENT_REQUIRED',
    'PAYMENT_FAILED'
  ];

  if (importantTypes.some(t => type === t || type.includes(t))) {
    return true;
  }

  // Keywords that denote urgent actionable events
  const urgentKeywords = [
    'urgent',
    'new shipment offer',
    'broadcast offer',
    'action required',
    'commission payment',
    'gate paused',
    'transit breakdown',
    'reassignment',
    'delivery failed',
    'delayed',
    'emergency',
    'payment failed',
    'new complaint',
    'call request'
  ];

  if (urgentKeywords.some(k => title.includes(k) || message.includes(k))) {
    return true;
  }

  // If type is explicitly INFO / SUCCESS / READ / GENERAL without urgent keywords, do not ring
  const informationalTypes = ['INFO', 'SUCCESS', 'READ', 'GENERAL', 'GENERAL_UPDATE'];
  if (informationalTypes.includes(type)) {
    return false;
  }

  return false;
};

/**
 * Check multi-tab coordination to prevent duplicate audio across open tabs
 */
const canPlayInThisTab = (notificationId) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_TRIGGER);
    if (raw) {
      const { id, timestamp } = JSON.parse(raw);
      if (id === notificationId && Date.now() - timestamp < 3000) {
        return false; // Another tab played this notification within 3 seconds
      }
    }
    localStorage.setItem(STORAGE_KEYS.LAST_TRIGGER, JSON.stringify({
      id: notificationId,
      timestamp: Date.now()
    }));
    return true;
  } catch {
    return true;
  }
};

/**
 * Play notification sound for an incoming notification if enabled, important, and unplayed
 */
export const playNotificationSound = (notification) => {
  if (!isNotificationSoundEnabled()) return;
  if (!notification || !notification.id) return;

  if (hasNotificationPlayed(notification.id)) return;
  if (!isImportantNotification(notification)) {
    markNotificationPlayed(notification.id);
    return;
  }

  if (!canPlayInThisTab(notification.id)) {
    markNotificationPlayed(notification.id);
    return;
  }

  markNotificationPlayed(notification.id);
  const vol = getNotificationSoundVolume();
  executeSoundPlayback(vol);
};

/**
 * Initialize / observe notification list from polling or fetch.
 * - On first load: Marks all existing historical notifications as seen (NO ringing).
 * - On subsequent calls: Detects newly added notifications and rings for important ones.
 */
export const processIncomingNotifications = (notifications = []) => {
  if (!Array.isArray(notifications) || notifications.length === 0) {
    isSystemInitialized = true;
    return;
  }

  if (playedNotificationIds.size === 0) {
    loadPlayedIds();
  }

  // 1. First Load Protection: seed existing notifications without playing sound
  if (!isSystemInitialized) {
    notifications.forEach(n => {
      if (n?.id) {
        playedNotificationIds.add(n.id);
      }
    });
    try {
      const list = Array.from(playedNotificationIds).slice(-100);
      localStorage.setItem(STORAGE_KEYS.PLAYED_IDS, JSON.stringify(list));
    } catch {}
    isSystemInitialized = true;
    return;
  }

  // 2. Subsequent Updates: Find brand new notifications not yet in playedNotificationIds
  const unreadNew = notifications.filter(n => n && n.id && !playedNotificationIds.has(n.id) && !n.readStatus);

  if (unreadNew.length > 0) {
    // Pick the most recent important notification to play sound once per batch
    const importantOnes = unreadNew.filter(isImportantNotification);
    if (importantOnes.length > 0) {
      playNotificationSound(importantOnes[0]);
    }
    // Mark all new ones as played so they won't trigger later
    unreadNew.forEach(n => markNotificationPlayed(n.id));
  }
};
