import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Project root resolution
const projectRoot = path.resolve(__dirname, '..', '..', '..');
const dbDir = path.resolve(projectRoot, 'database');
const messagesFile = path.resolve(dbDir, 'community_messages.json');

const MAX_HISTORY = 100;
const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds
const RATE_LIMIT_MAX_MESSAGES = 5;

// Initial student conversation seed for a friendly empty state
const SEED_MESSAGES = [
  {
    id: 'seed-1',
    name: 'Anamika',
    author: 'Anamika',
    message: 'Welcome to the JC Notes Anonymous Community! Ask exam doubts, share subject tips, or discuss topics freely.',
    text: 'Welcome to the JC Notes Anonymous Community! Ask exam doubts, share subject tips, or discuss topics freely.',
    timestamp: Date.now() - 3600000 * 2,
    formattedTime: new Date(Date.now() - 3600000 * 2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'seed-2',
    name: 'Anamika',
    author: 'Anamika',
    message: 'Does anyone have the Unit 3 notes for Data Structures (24CS330)?',
    text: 'Does anyone have the Unit 3 notes for Data Structures (24CS330)?',
    timestamp: Date.now() - 3600000 * 1.5,
    formattedTime: new Date(Date.now() - 3600000 * 1.5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'seed-3',
    name: 'Anamika',
    author: 'Anamika',
    message: 'Yes! Check the PDF Notes tab under 24CS330, Unit 3 is uploaded with all the tree diagrams and code.',
    text: 'Yes! Check the PDF Notes tab under 24CS330, Unit 3 is uploaded with all the tree diagrams and code.',
    timestamp: Date.now() - 3600000 * 1.2,
    formattedTime: new Date(Date.now() - 3600000 * 1.2).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'seed-4',
    name: 'Anamika',
    author: 'Anamika',
    message: 'Can someone explain question 4 from the 2024 DSD exam paper?',
    text: 'Can someone explain question 4 from the 2024 DSD exam paper?',
    timestamp: Date.now() - 1800000,
    formattedTime: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

let messages = [];

// Supabase REST client configuration for persistent cloud storage
const supabaseUrl = process.env.SUPABASE_URL ? process.env.SUPABASE_URL.replace(/\/+$/, '') : '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseKey);
}

async function fetchSupabaseMessages(limit = 100) {
  if (!isSupabaseConfigured()) return null;
  try {
    const endpoint = `${supabaseUrl}/rest/v1/community_messages?select=*&order=timestamp.asc&limit=${limit}`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) {
      console.warn(`Supabase messages fetch returned status ${res.status}`);
      return null;
    }
    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map(m => ({
        id: m.id,
        name: 'Anamika',
        author: 'Anamika',
        message: m.message || m.text || '',
        text: m.text || m.message || '',
        file: m.file || undefined,
        timestamp: Number(m.timestamp),
        formattedTime: m.formatted_time || m.formattedTime
      }));
    }
  } catch (err) {
    console.warn('Failed to fetch messages from Supabase:', err.message);
  }
  return null;
}

async function insertSupabaseMessage(msg) {
  if (!isSupabaseConfigured() || !msg) return false;
  try {
    const endpoint = `${supabaseUrl}/rest/v1/community_messages`;
    const payload = {
      id: msg.id,
      name: 'Anamika',
      author: 'Anamika',
      message: msg.message || msg.text || '',
      text: msg.text || msg.message || '',
      file: msg.file || null,
      timestamp: msg.timestamp,
      formatted_time: msg.formattedTime || msg.formatted_time || ''
    };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.warn('Failed to insert message into Supabase:', err.message);
    return false;
  }
}

function loadLocalMessages() {
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        messages = parsed.map(m => ({
          ...m,
          name: 'Anamika',
          author: 'Anamika',
          message: m.message || m.text || '',
          text: m.text || m.message || ''
        }));
        return;
      }
    }
  } catch (err) {
    console.error('Failed to load local community messages:', err);
  }
  messages = [...SEED_MESSAGES];
  saveLocalMessages();
}

// Load messages from Supabase (if configured) or local JSON fallback
export async function loadMessages() {
  if (isSupabaseConfigured()) {
    try {
      const remote = await fetchSupabaseMessages(MAX_HISTORY);
      if (remote && remote.length > 0) {
        messages = remote;
        saveLocalMessages();
        console.log(`Loaded ${messages.length} community messages from Supabase PostgreSQL.`);
        return;
      }
    } catch (e) {
      console.warn('Supabase initial fetch failed, falling back to local JSON:', e.message);
    }
  }
  loadLocalMessages();
}

function saveLocalMessages() {
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    if (messages.length > MAX_HISTORY) {
      messages = messages.slice(-MAX_HISTORY);
    }
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save local community messages:', err);
  }
}

function saveMessages(newMessage = null) {
  saveLocalMessages();
  if (newMessage && isSupabaseConfigured()) {
    insertSupabaseMessage(newMessage).catch(err => {
      console.warn('Background Supabase insert error:', err.message);
    });
  }
}

// In-memory rate limiting map: socketId -> [timestamps]
const rateLimits = new Map();

function isRateLimited(key) {
  const now = Date.now();
  const timestamps = rateLimits.get(key) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_MESSAGES) {
    return true;
  }
  recent.push(now);
  rateLimits.set(key, recent);
  return false;
}

// Basic XSS & HTML escaping
function sanitizeText(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function getRecentMessages(limit = 50) {
  if (messages.length === 0) {
    loadMessages();
  }
  return messages.slice(-limit);
}

export function createMessage(rawText = '', file = null, rateLimitKey = 'default') {
  if (isRateLimited(rateLimitKey)) {
    return {
      error: 'Rate limit exceeded. Please wait a few seconds before sending another message.'
    };
  }

  const textTrimmed = typeof rawText === 'string' ? rawText.trim() : '';

  // Either text or a file must be present
  if (!textTrimmed && !file) {
    return { error: 'Please enter a message or attach a file.' };
  }

  if (textTrimmed.length > MAX_MESSAGE_LENGTH) {
    return { error: `Message is too long (maximum ${MAX_MESSAGE_LENGTH} characters).` };
  }

  const sanitized = sanitizeText(textTrimmed);
  const now = Date.now();
  const timeString = new Date(now).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // STRICT REQUIREMENT: Name and Author must ALWAYS be "Anamika"
  const newMessage = {
    id: `msg_${now}_${Math.random().toString(36).substring(2, 9)}`,
    name: 'Anamika',
    author: 'Anamika',
    message: sanitized,
    text: sanitized,
    timestamp: now,
    formattedTime: timeString
  };

  if (file && typeof file === 'object') {
    newMessage.file = {
      name: file.name || 'document',
      url: file.url || '',
      type: file.type || 'file',
      size: file.size || '',
      sizeBytes: file.sizeBytes || 0,
      relPath: file.relPath || '',
      isExisting: Boolean(file.isExisting)
    };
  }

  messages.push(newMessage);
  saveMessages(newMessage);

  return { message: newMessage };
}

let activeIO = null;

export function initCommunityChat(io) {
  activeIO = io;
  loadMessages();

  io.on('connection', (socket) => {
    // Send initial history and online count to connected client
    const recent = getRecentMessages(60);
    const onlineCount = io.engine.clientsCount || 1;

    socket.emit('chat:init', {
      messages: recent,
      onlineCount
    });

    // Notify all clients of new online count
    io.emit('chat:online_count', onlineCount);

    // Client requests message sending
    socket.on('chat:send', (data, callback) => {
      const rateKey = socket.id || socket.handshake.address || 'socket';
      const rawText = data && typeof data === 'object' ? data.text : data;
      const fileData = data && typeof data === 'object' ? data.file : null;

      const result = createMessage(rawText, fileData, rateKey);

      if (result.error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: result.error });
        } else {
          socket.emit('chat:error', { error: result.error });
        }
        return;
      }

      // Broadcast to ALL connected clients immediately in real-time
      io.emit('chat:message', result.message);

      if (typeof callback === 'function') {
        callback({ success: true, message: result.message });
      }
    });

    // Client attaches an existing website file
    socket.on('chat:attach_existing', (data, callback) => {
      const rateKey = socket.id || socket.handshake.address || 'socket';
      const rawText = data && typeof data === 'object' ? data.text : '';
      const fileData = data && typeof data === 'object' ? data.file : null;

      const result = createMessage(rawText, fileData, rateKey);

      if (result.error) {
        if (typeof callback === 'function') {
          callback({ success: false, error: result.error });
        } else {
          socket.emit('chat:error', { error: result.error });
        }
        return;
      }

      // Broadcast to ALL connected clients immediately in real-time
      io.emit('chat:message', result.message);

      if (typeof callback === 'function') {
        callback({ success: true, message: result.message });
      }
    });

    socket.on('disconnect', () => {
      rateLimits.delete(socket.id);
      const updatedCount = io.engine.clientsCount || 1;
      io.emit('chat:online_count', updatedCount);
    });
  });

  return io;
}

export function broadcastMessage(message) {
  if (activeIO) {
    activeIO.emit('chat:message', message);
  }
}

export function broadcastPdfRegistered(doc) {
  if (activeIO && doc) {
    activeIO.emit('pdf:new', doc);
  }
}
