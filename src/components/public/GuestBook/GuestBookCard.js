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
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-gray-100">
      {/* Message - rendered as text only, supports emojis */}
      <p className="cormorant-garamond-regular text-lg text-gray-700 leading-relaxed mb-4 italic whitespace-pre-wrap" style={{ wordSpacing: '0.05em' }}>
        &ldquo;{convertEmoticons(message)}&rdquo;
      </p>

      {/* Name and Date */}
      <div className="flex items-center justify-between">
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
