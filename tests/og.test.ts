import { describe, it, expect } from 'vitest';
import { wrapTitle, escXml } from '../src/utils/og';

describe('wrapTitle', () => {
  it('short title fits on one line', () => {
    const lines = wrapTitle('Short title', 42);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('Short title');
  });

  it('long title wraps at word boundaries, each line within maxChars', () => {
    const title = 'This is a very long title that should wrap into multiple lines here';
    const lines = wrapTitle(title, 20);
    expect(lines.length).toBeGreaterThan(1);
    for (const line of lines) {
      expect(line.length).toBeLessThanOrEqual(20);
    }
  });

  it('caps output at 3 lines even when more would fit', () => {
    const text = Array(20).fill('word').join(' ');
    expect(wrapTitle(text, 5)).toHaveLength(3);
  });

  it('empty string returns empty array', () => {
    expect(wrapTitle('', 42)).toEqual([]);
  });

  it('single word longer than maxChars is placed on its own line unsplit', () => {
    const lines = wrapTitle('superlongword', 5);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toBe('superlongword');
  });
});

describe('escXml', () => {
  it('escapes ampersand', () => {
    expect(escXml('A & B')).toBe('A &amp; B');
  });

  it('escapes less-than', () => {
    expect(escXml('<tag>')).toBe('&lt;tag&gt;');
  });

  it('escapes greater-than', () => {
    expect(escXml('a > b')).toBe('a &gt; b');
  });

  it('escapes double quote', () => {
    expect(escXml('"quoted"')).toBe('&quot;quoted&quot;');
  });

  it('escapes all four special characters in one string', () => {
    expect(escXml('Tom & Jerry <br> "test"')).toBe('Tom &amp; Jerry &lt;br&gt; &quot;test&quot;');
  });

  it('returns clean string unchanged', () => {
    expect(escXml('no special chars here')).toBe('no special chars here');
  });

  it('empty string returns empty string', () => {
    expect(escXml('')).toBe('');
  });

  it('ampersand is escaped before less-than to prevent double-escaping', () => {
    // '&<' must become '&amp;&lt;', not '&amp;lt;'
    expect(escXml('&<')).toBe('&amp;&lt;');
  });
});
