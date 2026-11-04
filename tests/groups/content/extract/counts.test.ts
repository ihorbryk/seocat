import { describe, expect, it } from 'vitest';
import { extract } from '../../../../src/groups/content/extract';
import { parseHtml } from '../../../helpers';

const doc = (body: string, head = '') =>
  parseHtml(`<!doctype html><html><head>${head}</head><body>${body}</body></html>`);

describe('content extract: words', () => {
  it('виключає піддерева script/style/noscript/template/svg/iframe/object', () => {
    const d = doc(
      `<p>one two</p><script>var a = 1 2 3;</script><style>p { color: red }</style>
       <noscript>hidden ns</noscript><template>tpl words</template>
       <svg><text>svg words</text></svg><iframe>fr words</iframe><object>obj words</object>`,
    );
    expect(extract(d).words).toBe(2);
  });
  it('враховує nav/header/footer/aside і приховані елементи', () => {
    const d = doc(
      `<header>a</header> <nav>b c</nav> <aside>d</aside> <footer>e</footer> <p hidden>f</p> <p style="display:none">g</p>`,
    );
    expect(extract(d).words).toBe(7);
  });
  it('не рахує <head> і атрибути', () => {
    const d = doc(
      `<p title="attr words here" data-x="more words">one</p>`,
      '<title>head words</title>',
    );
    expect(extract(d).words).toBe(1);
  });
  it("п'ять і п’ять = 1 слово, число = 1, веб-сайт = 2", () => {
    expect(extract(doc("<p>п'ять</p>")).words).toBe(1);
    expect(extract(doc('<p>п’ять</p>')).words).toBe(1);
    expect(extract(doc('<p>1488</p>')).words).toBe(1);
    expect(extract(doc('<p>веб-сайт</p>')).words).toBe(2);
  });
  it('сусідні блоки без пробілів між тегами розділяють слова', () => {
    expect(extract(doc('<p>Hello</p><p>world</p>')).words).toBe(2);
  });
  it('<br> розділяє слова', () => {
    expect(extract(doc('one<br>two')).words).toBe(2);
  });
  it('елементи списку без пробілів між тегами', () => {
    expect(extract(doc('<ul><li>one</li><li>two</li><li>three</li></ul>')).words).toBe(3);
  });
  it('порожнє тіло = 0', () => {
    expect(extract(doc('')).words).toBe(0);
  });
});

describe('content extract: headings', () => {
  it('кожен h1–h6 у порядку документа з рівнем і текстом', () => {
    const d = doc(`<h2>b</h2><div><h1>a</h1></div><h6>f</h6><h3>c</h3>`);
    expect(extract(d).headings).toEqual([
      { level: 2, text: 'b', imageAlts: [] },
      { level: 1, text: 'a', imageAlts: [] },
      { level: 6, text: 'f', imageAlts: [] },
      { level: 3, text: 'c', imageAlts: [] },
    ]);
  });
  it('текст зі згорнутими пробілами і alt кожного Image усередині', () => {
    const d = doc(
      `<h1>\n  Hello   <b>big</b>\n world </h1><h2><img alt=" Brand  logo "><img src="x.png"></h2>`,
    );
    expect(extract(d).headings).toEqual([
      { level: 1, text: 'Hello big world', imageAlts: [] },
      { level: 2, text: '', imageAlts: ['Brand logo'] },
    ]);
  });
  it('порожні та приховані враховуються, ARIA-заголовки ні', () => {
    const d = doc(
      `<h1></h1><h1 hidden>x</h1><h3 style="display:none">y</h3><div role="heading" aria-level="2">z</div>`,
    );
    expect(extract(d).headings.map((h) => h.level)).toEqual([1, 1, 3]);
  });
});
