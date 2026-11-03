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

describe('content extract: images', () => {
  it('рахує всі <img>, у <picture> лише <img>', () => {
    const d = doc(
      `<img src="a.png"><picture><source srcset="b.webp"><img src="b.png"></picture><img>`,
    );
    expect(extract(d).images).toBe(3);
  });
  it('не рахує inline svg, CSS-фони, input type=image, favicon', () => {
    const d = doc(
      `<svg><image href="x.png"/></svg><div style="background:url(a.png)"></div><input type="image" src="b.png">`,
      '<link rel="icon" href="f.ico">',
    );
    expect(extract(d).images).toBe(0);
  });
});

describe('content extract: links', () => {
  it('рахує <a href> будь-якої схеми, включно з дублікатами', () => {
    const d = doc(
      `<a href="/a">1</a><a href="/a">2</a><a href="#">3</a><a href="mailto:x@y.z">4</a><a href="javascript:void(0)">5</a><a href="">6</a>`,
    );
    expect(extract(d).links).toBe(6);
  });
  it('не рахує <a> без href і <area>', () => {
    const d = doc(`<a name="x">1</a><a>2</a><map><area href="/z"></map>`);
    expect(extract(d).links).toBe(0);
  });
});

describe('content extract: headings', () => {
  it('шість лічильників по рівнях', () => {
    const d = doc(`<h1>a</h1><h2>b</h2><h2>c</h2><h4>d</h4><h6>e</h6><h6>f</h6><h6>g</h6>`);
    expect(extract(d).headings).toEqual([1, 2, 0, 1, 0, 3]);
  });
  it('порожні та приховані враховуються', () => {
    const d = doc(`<h1></h1><h1 hidden>x</h1><h3 style="display:none">y</h3>`);
    expect(extract(d).headings).toEqual([2, 0, 1, 0, 0, 0]);
  });
});
