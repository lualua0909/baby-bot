import { Emotion } from './emotionEngine';

// Keyword → emotion mapping for instant detection from chat messages
// Supports Vietnamese and English
const EMOTION_KEYWORDS: { keywords: string[]; emotion: Emotion }[] = [
  // Sleeping / Sleepy
  {
    keywords: ['buồn ngủ', 'ngủ', 'sleepy', 'sleeping', 'ngáp', 'mệt quá', '졸려', 'zzz', 'nap', 'giấc ngủ', 'ngủ đi', 'ru ngủ', 'chúc ngủ'],
    emotion: 'sleeping',
  },
  // Happy
  {
    keywords: ['vui', 'happy', 'haha', 'hihi', 'hehe', 'yay', 'tuyệt', 'xuất sắc', 'tốt lắm', 'giỏi', 'thích', 'love', 'yêu', 'cưng', 'dễ thương', 'cute'],
    emotion: 'happy',
  },
  // Glee / Excited
  {
    keywords: ['quá vui', 'hype', 'excited', 'phấn khích', 'wow', 'amazing', 'tuyệt vời', 'siêu', 'cực kỳ', 'omg', 'ôi trời', 'đỉnh', 'slay'],
    emotion: 'glee',
  },
  // Sad
  {
    keywords: ['buồn', 'sad', 'grustno', 'khóc', 'cry', 'tệ', 'chán', 'thất vọng', 'đau', 'nhớ', 'cô đơn', 'lonely', 'một mình'],
    emotion: 'sad_down',
  },
  // Angry
  {
    keywords: ['tức', 'giận', 'angry', 'ghét', 'hate', 'bực', 'điên', 'ức', 'khó chịu'],
    emotion: 'angry',
  },
  // Furious
  {
    keywords: ['rất tức', 'tức chết', 'furious', 'rage', 'nổi điên', 'phát điên'],
    emotion: 'furious',
  },
  // Scared
  {
    keywords: ['sợ', 'scared', 'afraid', 'kinh', 'rùng', 'hãi', 'fear', 'hoảng', 'ma', 'ghost', 'creepy'],
    emotion: 'scared',
  },
  // Surprised
  {
    keywords: ['bất ngờ', 'surprise', 'hả', 'thật á', 'thật hả', 'seriously', 'không tin', 'what', 'cái gì', 'ủa'],
    emotion: 'surprised',
  },
  // Worried
  {
    keywords: ['lo', 'worried', 'lo lắng', 'lo âu', 'anxiety', 'băn khoăn', 'sao đây', 'làm sao'],
    emotion: 'worried',
  },
  // Awe
  {
    keywords: ['đẹp quá', 'beautiful', 'ngất ngây', 'mê', 'gorgeous', 'stunning', 'trời ơi đẹp', 'choáng'],
    emotion: 'awe',
  },
  // Annoyed
  {
    keywords: ['phiền', 'annoyed', 'annoying', 'chán ghét', 'mệt mỏi', 'ugh', 'ôi dào'],
    emotion: 'annoyed',
  },
  // Skeptic
  {
    keywords: ['thật không', 'really', 'skeptic', 'hoài nghi', 'nghi ngờ', 'chắc chưa', 'hmm', 'liệu'],
    emotion: 'skeptic',
  },
  // Frustrated
  {
    keywords: ['nản', 'frustrated', 'chán nản', 'bỏ cuộc', 'thôi', 'hết muốn'],
    emotion: 'frustrated',
  },
  // Suspicious
  {
    keywords: ['lạ', 'suspicious', 'sus', 'đáng ngờ', 'kỳ lạ', 'weird', 'strange'],
    emotion: 'suspicious',
  },
  // Focused
  {
    keywords: ['tập trung', 'focus', 'nghiêm túc', 'serious', 'làm việc', 'work', 'học', 'study'],
    emotion: 'focused',
  },
  // Unimpressed
  {
    keywords: ['bình thường', 'meh', 'tầm thường', 'boring', 'nhạt', 'vậy thôi'],
    emotion: 'unimpressed',
  },
  // Hungry (maps to worried expression)
  {
    keywords: ['đói', 'hungry', 'ăn', 'food', 'thức ăn', 'bữa', 'cơm', 'đồ ăn'],
    emotion: 'worried',
  },
];

/**
 * Detect emotion from a chat message instantly (client-side, no API needed).
 * Returns null if no emotion detected.
 */
export function detectEmotionFromMessage(message: string): Emotion | null {
  const lower = message.toLowerCase().trim();
  if (!lower) return null;

  // Check each emotion group — longer keywords first for better matching
  for (const group of EMOTION_KEYWORDS) {
    for (const keyword of group.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        return group.emotion;
      }
    }
  }

  return null;
}
