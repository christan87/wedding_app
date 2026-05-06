/**
 * ============================================================================
 * FILE: GuestBookForm.js
 * LOCATION: src/components/public/GuestBook/GuestBookForm.js
 * PURPOSE: Form component for guests to sign the guest book
 * 
 * PROPS:
 * ======
 * @param {Function} onSignatureAdded - Callback when a new signature is created
 * 
 * ============================================================================
 */

import { useState, useRef } from 'react';

/**
 * Sanitize input by stripping HTML tags, script content, and dangerous patterns.
 * Preserves emojis and normal text characters.
 */
function sanitize(input) {
  if (!input) return '';
  return input
    // Remove script tags and their content
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    // Remove all HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove javascript: protocol patterns
    .replace(/javascript:/gi, '')
    // Remove on* event handlers (e.g., onclick, onerror)
    .replace(/on\w+\s*=/gi, '')
    // Remove data: protocol patterns
    .replace(/data:/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Validate form input for safety and content.
 * Returns an error message string or null if valid.
 */
function validateInput(name, message) {
  if (!name.trim()) return 'Name is required.';
  if (!message.trim()) return 'Message is required.';
  if (name.length > 100) return 'Name must be 100 characters or fewer.';
  if (message.length > 500) return 'Message must be 500 characters or fewer.';

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /javascript:/i,
    /on\w+\s*=/i,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(name) || pattern.test(message)) {
      return 'Invalid characters detected. Please use only text and emojis.';
    }
  }

  return null;
}

const EMOJI_CATEGORIES = {
  'Smileys': ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','😊','😇','🥰','😍','🤩','😘','😗','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🫢','🫣','🤫','🤔','🫡','🤐','🤨','😐','😑','😶','🫥','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐','😕','🫤','😟','🙁','😮','😯','😲','😳','🥺','🥹','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾','🤖'],
  'Gestures': ['👋','🤚','🖐️','✋','🖖','🫱','🫲','🫳','🫴','👌','🤌','🤏','✌️','🤞','🫰','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','🫵','👍','👎','✊','👊','🤛','🤜','👏','🙌','🫶','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀','�️','👅','👄'],
  'Hearts': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','🩷','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','💗','💖','💘','💝','💟','♥️','🫶','😍','🥰','😘','💋','💏','💑'],
  'Animals': ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐈‍⬛','🪶','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','�️','🦔'],
  'Food': ['🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','�','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠','🫘','🥐','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧','🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🥛','🍼','🫖','☕','🍵','🧃','🥤','🧋','🍶','🍺','🍻','�','🍷','🫗','🥃','🍸','🍹','🧉','🍾','🧊','🥄','🍴','🥣','🥡','🥢','🧂'],
  'Activities': ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🏑','🥍','🏏','🪃','🥅','⛳','🪁','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛼','🛷','⛸️','🥌','🎿','⛷️','🏂','🪂','🏋️','🤼','🤸','🤺','⛹️','🤾','🏌️','🏇','🧘','🏄','🏊','🤽','🚣','🧗','🚵','�','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎗️','🎫','🎟️','🎪','🎭','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🪗','🎸','🪕','🎻','🪈','🎲','♟️','🎯','🎳','🎮','�','🧩'],
  'Travel': ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','�','🚲','🛴','🛺','🚨','🚔','🚍','🚘','🚖','🛞','🚡','🚠','🚟','🚃','🚋','🚞','🚝','🚄','🚅','🚈','🚂','🚆','🚇','🚊','🚉','✈️','🛫','🛬','🛩️','💺','🛰️','🚀','🛸','🚁','🛶','⛵','🚤','🛥️','🛳️','⛴️','🚢','⚓','�','⛽','�','�','🚥','🗺️','🗿','🗽','🗼','🏰','🏯','🏟️','🎡','🎢','🎠','⛲','⛱️','🏖️','🏝️','🏜️','🌋','⛰️','🏔️','🗻','🏕️','⛺','🏠','🏡','🏘️','🏚️','🏗️','🏭','🏢','🏬','🏣','🏤','🏥','🏦','🏨','🏪','🏫','🏩','💒','🏛️','⛪','🕌','�','🛕','�','⛩️'],
  'Objects': ['⌚','📱','📲','💻','⌨️','🖥️','🖨️','🖱️','🖲️','💽','💾','💿','📀','🧮','🎥','🎞️','📽️','🎬','📺','📷','📸','📹','📼','🔍','🔎','🕯️','💡','🔦','🏮','🪔','📔','📕','📖','📗','📘','📙','📚','📓','📒','📃','📜','📄','📰','🗞️','📑','🔖','🏷️','💰','🪙','💴','💵','💶','💷','💸','💳','🧾','💹','✉️','📧','📨','📩','📤','📥','📦','📫','📪','📬','📭','📮','🗳️','✏️','✒️','🖋️','🖊️','🖌️','🖍️','📝','💼','📁','📂','🗂️','📅','📆','🗒️','🗓️','📇','📈','📉','📊','📋','📌','📍','📎','🖇️','📏','📐','✂️','🗃️','🗄️','🗑️','🔒','🔓','🔏','🔐','🔑','🗝️','🔨','🪓','⛏️','⚒️','🛠️','🗡️','⚔️','🔫','🪃','�','🛡️','🪚','🔧','🪛','🔩','⚙️','🗜️','⚖️','�','��','⛓️','🪝','🧰','🧲','🪜','⚗️','🧪','🧫','🧬','🔬','🔭','📡','💉','🩸','💊','🩹','🩼','🩺','🩻','🚪','🛗','🪞','🪟','🛏️','🛋️','🪑','🚽','🪠','🚿','🛁','🪤','🪒','🧴','🧷','🧹','🧺','🧻','🪣','🧼','🫧','🪥','🧽','🧯','🛒','🚬','⚰️','🪦','⚱️','🗿','🪧','🪬'],
  'Symbols': ['❤️','🧡','💛','💚','💙','�','�','🤍','🤎','💔','❤️‍🔥','❤️‍🩹','❣️','💕','💞','💓','��','💖','💘','💝','💟','☮️','✝️','☪️','🕉️','☸️','✡️','🔯','🕎','☯️','☦️','🛐','⛎','♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓','🆔','⚛️','🉑','☢️','☣️','📴','📳','🈶','🈚','🈸','🈺','🈷️','✴️','🆚','💮','🉐','㊙️','㊗️','🈴','🈵','🈹','🈲','🅰️','🅱️','🆎','🆑','🅾️','🆘','❌','⭕','🛑','⛔','📛','🚫','💯','💢','♨️','🚷','🚯','🚳','🚱','🔞','📵','🚭','❗','❕','❓','❔','‼️','⁉️','🔅','🔆','〽️','⚠️','🚸','🔱','⚜️','🔰','♻️','✅','🈯','💹','❇️','✳️','❎','🌐','💠','Ⓜ️','🌀','💤','🏧','🚾','♿','🅿️','🛗','🈳','🈂️','🛂','🛃','🛄','🛅','🚹','🚺','🚼','⚧️','🚻','🚮','🎦','📶','🈁','🔣','ℹ️','🔤','🔡','🔠','🆖','🆗','🆙','🆒','🆕','🆓','0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','🔢','#️⃣','*️⃣','⏏️','▶️','⏸️','⏯️','⏹️','⏺️','⏭️','⏮️','⏩','⏪','⏫','⏬','◀️','🔼','🔽','➡️','⬅️','⬆️','⬇️','↗️','↘️','↙️','↖️','↕️','↔️','↪️','↩️','⤴️','⤵️','🔀','🔁','🔂','🔄','🔃','🎵','🎶','➕','➖','➗','✖️','🟰','♾️','💲','💱','™️','©️','®️','👁️‍🗨️','🔚','🔙','🔛','🔝','🔜','〰️','➰','➿','✔️','☑️','🔘','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','🔺','🔻','🔸','🔹','🔶','🔷','🔳','🔲','▪️','▫️','◾','◽','◼️','◻️','🟥','🟧','🟨','🟩','🟦','🟪','⬛','⬜','🟫','🔈','🔇','🔉','🔊','🔔','🔕','📣','📢','👁️‍🗨️','💬','💭','🗯️','♠️','♣️','♥️','♦️','🃏','🎴','🀄','🕐','🕑','🕒','🕓','🕔','🕕','🕖','🕗','🕘','🕙','🕚','🕛'],
  'Nature': ['🌵','🎄','🌲','🌳','🌴','🪵','🌱','🌿','☘️','🍀','🎍','🪴','🎋','🍃','🍂','🍁','🪺','🪹','🍄','🌾','💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻','🌞','🌝','🌛','🌜','🌚','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔','🌙','🌎','🌍','🌏','🪐','💫','⭐','🌟','✨','⚡','☄️','💥','🔥','🌪️','🌈','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️','💨','💧','💦','🫧','☔','☂️','🌊','🌫️'],
  'Flags': ['🏳️','🏴','🏁','�','🏳️‍🌈','🏳️‍⚧️','🇺🇸','🇬🇧','🇨🇦','🇦🇺','🇫🇷','🇩🇪','🇮🇹','🇪🇸','🇧🇷','🇲🇽','🇯🇵','🇰🇷','🇨🇳','🇮🇳','🇷🇺','🇿🇦','🇳🇬','🇰🇪','🇪🇬','🇦🇷','🇨🇴','🇵🇪','🇨🇱','🇻🇪','🇵🇭','🇻🇳','🇹🇭','🇮🇩','🇲🇾','🇸🇬','🇳🇿','🇮🇪','🇳🇱','🇧🇪','🇨🇭','🇦🇹','🇸🇪','🇳🇴','🇩🇰','🇫🇮','🇵🇱','🇺🇦','🇹🇷','🇬🇷','🇵🇹','🇯🇲','🇹🇹','🇭🇹','🇩🇴','🇵🇷','🇨🇺'],
};

const CATEGORY_ICONS = {
  'Smileys': '😀',
  'Gestures': '�',
  'Hearts': '❤️',
  'Animals': '🐶',
  'Food': '�',
  'Activities': '⚽',
  'Travel': '✈️',
  'Objects': '�',
  'Symbols': '🔣',
  'Nature': '�',
  'Flags': '�',
};

export default function GuestBookForm({ onSignatureAdded }) {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState('Smileys');
  const [emojiSearch, setEmojiSearch] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Sanitize inputs
    const cleanName = sanitize(formData.name);
    const cleanMessage = sanitize(formData.message);

    // Validate
    const validationError = validateInput(cleanName, cleanMessage);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, message: cleanMessage }),
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ name: '', message: '' });
        if (onSignatureAdded) {
          onSignatureAdded(data.data);
        }
      } else {
        setError(data.errors?.join(', ') || 'Failed to sign guest book');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {/* Name Input */}
      <div className="mb-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Your Name"
          required
          maxLength={100}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cormorant-garamond-regular text-lg text-gray-700"
        />
      </div>

      {/* Message Textarea with Emoji Picker */}
      <div className="mb-4 relative">
        <textarea
          ref={textareaRef}
          name="message"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Leave a message for the couple... emojis welcome! 🎉💍"
          required
          rows="3"
          maxLength={500}
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cormorant-garamond-regular text-lg text-gray-700 resize-none"
        />

        {/* Emoji Toggle Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(prev => !prev)}
          className="absolute top-3 right-3 text-2xl hover:scale-110 transition-transform"
          title="Add emoji"
        >
          😊
        </button>

        {/* Emoji Picker Dropdown */}
        {showEmojiPicker && (
          <div className="absolute right-0 top-12 z-20 bg-white border border-gray-200 rounded-lg shadow-lg w-80">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 px-1 pt-1">
              {Object.keys(EMOJI_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setEmojiCategory(cat); setEmojiSearch(''); }}
                  className={`flex-shrink-0 p-2 text-lg rounded-t transition-colors ${
                    emojiCategory === cat ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                  title={cat}
                >
                  {CATEGORY_ICONS[cat]}
                </button>
              ))}
            </div>

            {/* Emoji Grid */}
            <div className="h-48 overflow-y-auto p-2">
              <div className="grid grid-cols-8 gap-1">
                {EMOJI_CATEGORIES[emojiCategory].map((emoji, i) => (
                  <button
                    key={`${emoji}-${i}`}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, message: prev.message + emoji }));
                      textareaRef.current?.focus();
                    }}
                    className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-right text-sm text-gray-400 mt-1">
          {formData.message.length}/500
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-gray-700 text-white cormorant-garamond-semibold text-lg rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSubmitting ? 'Signing...' : 'Sign Guest Book'}
        </button>
      </div>
    </form>
  );
}
