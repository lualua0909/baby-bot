import { describe, it, expect } from 'vitest';
import { sanitizeLLMText } from './utils';

describe('sanitizeLLMText', () => {
  it('strips leading "User Safety: safe" line', () => {
    expect(sanitizeLLMText('User Safety: safe\nXin chào bé!')).toBe('Xin chào bé!');
  });

  it('strips trailing safety line', () => {
    expect(sanitizeLLMText('Xin chào bé!\nUser Safety: safe')).toBe('Xin chào bé!');
  });

  it('strips bare "Safety: safe"', () => {
    expect(sanitizeLLMText('Safety: safe\nMình là cún con.')).toBe('Mình là cún con.');
  });

  it('strips markdown-wrapped safety line', () => {
    expect(sanitizeLLMText('**Safety:** safe\nHôm nay vui không?')).toBe('Hôm nay vui không?');
  });

  it('strips parenthesised content-safety line', () => {
    expect(sanitizeLLMText('(Content Safety: safe)\nÀ ừ.')).toBe('À ừ.');
  });

  it('strips moderation / classification / rating variants', () => {
    expect(sanitizeLLMText('Moderation: flagged\nA')).toBe('A');
    expect(sanitizeLLMText('Classification: benign\nB')).toBe('B');
    expect(sanitizeLLMText('Safety rating: low\nC')).toBe('C');
    expect(sanitizeLLMText('- Safety status: ok\nD')).toBe('D');
  });

  it('strips trailing JSON stat block', () => {
    const input = 'Mình đói quá!\n{"hunger": -3, "emotion": "sad"}';
    expect(sanitizeLLMText(input)).toBe('Mình đói quá!');
  });

  it('strips both safety line and JSON stat block', () => {
    const input = 'User Safety: safe\nMình vui lắm!\n{"happiness": 5, "emotion": "happy"}';
    expect(sanitizeLLMText(input)).toBe('Mình vui lắm!');
  });

  it('collapses blank lines left behind', () => {
    expect(sanitizeLLMText('A\nUser Safety: safe\nB')).toBe('A\n\nB');
  });

  it('leaves normal kid-friendly text untouched', () => {
    const text = 'Chào bé! Hôm nay mình rất an toàn và vui vẻ.';
    expect(sanitizeLLMText(text)).toBe(text);
  });

  it('does not strip a sentence that merely contains the word safe', () => {
    const text = 'Bé nhớ qua đường an toàn nhé!';
    expect(sanitizeLLMText(text)).toBe(text);
  });
});
