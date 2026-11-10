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

// Load messages from disk or initialize with seed
function loadMessages() {
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    if (fs.existsSync(messagesFile)) {
      const data = fs.readFileSync(messagesFile, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Enforce anonymity on any historical messages as well
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
    console.error('Failed to load community messages:', err);
  }
  messages = [...SEED_MESSAGES];
  saveMessages();
}

function saveMessages() {
  try {
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    // Limit to MAX_HISTORY
    if (messages.length > MAX_HISTORY) {
      messages = messages.slice(-MAX_HISTORY);
    }
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save community messages:', err);
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
  saveMessages();

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
