/**
 * ============================================================================
 * FILE: GuestBookCard.js
 * LOCATION: src/components/public/GuestBook/GuestBookCard.js
 * PURPOSE: Display a single guest book signature
 * 
 * PROPS:
 * ======
 * @param {string} name - Guest's name
 * @param {string} message - Guest's message
 * @param {string|Date} createdAt - Timestamp of signature
 * 
 * ============================================================================
 */

import { useState } from 'react';

const MAX_LENGTH = 200;

/**
 * Convert common text emoticons to their emoji equivalents.
 */
function convertEmoticons(text) {
  if (!text) return '';
  const map = [
    [/<3/g, '❤️'],
    [/:'\)/g, '😂'],
    [/:\)/g, '😊'],
    [/;\)/g, '😉'],
    [/:D/g, '😃'],
    [/:P/g, '😛'],
    [/:p/g, '😛'],
    [/:\(/g, '😞'],
    [/:O/g, '😮'],
    [/:o/g, '😮'],
    [/;\(/g, '😢'],
    [/XD/g, '😆'],
    [/xD/g, '😆'],
    [/B\)/g, '😎'],
    [/:\/\//g, '😕'],
    [/<\/3/g, '💔'],
    [/:\*/g, '😘'],
    [/\^_\^/g, '😊'],
    [/>:</g, '😠'],
    [/O:\)/g, '😇'],
    [/o:\)/g, '😇'],
    [/:\|/g, '😐'],
  ];
  let result = text;
  for (const [pattern, emoji] of map) {
    result = result.replace(pattern, emoji);
  }
  return result;
}

export default function GuestBookCard({ name, message, createdAt }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = message && message.length > MAX_LENGTH;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const displayMessage = isLong && !expanded
    ? message.slice(0, MAX_LENGTH) + '...'
    : message;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
      {/* Message - rendered as text only, supports emojis */}
      <p className="cormorant-garamond-regular text-lg text-gray-700 leading-relaxed mb-2 italic whitespace-pre-wrap" style={{ wordSpacing: '0.05em' }}>
        &ldquo;{convertEmoticons(displayMessage)}&rdquo;
      </p>

      {/* Show More / Show Less */}
      {isLong && (
        <button
          onClick={() => setExpanded(prev => !prev)}
          className="cormorant-garamond-semibold text-sm text-slate-800 hover:text-blue-800 mb-4 transition-colors border-solid border-b border-slate-800 hover:border-blue-800"
        >
          {expanded ? 'Show Less' : 'Show More'}
        </button>
      )}

      {/* Name and Date */}
      <div className="flex items-center justify-between mt-2">
        <p className="cormorant-garamond-semibold text-base text-gray-800">
          — {convertEmoticons(name)}
        </p>
        {formattedDate && (
          <p className="cormorant-garamond-regular text-sm text-gray-500">
            {formattedDate}
          </p>
        )}
      </div>
    </div>
  );
}
