import html2canvas from 'html2canvas';

const onClick = () => {
  const textElm: HTMLInputElement | null = document.querySelector('input#text');
  const colorElm: HTMLInputElement | null = document.querySelector(
    'input#color'
  );

  if (!textElm || !colorElm) {
    throw new Error('element not found');
  }

  const text = textElm.value;
  const color = colorElm.value;

  const div = document.createElement('div');
  const _text = document.createElement('div');
  _text.textContent = text;
  div.appendChild(_text);
  div.style.display = 'flex';
  div.style.justifyContent = 'center';
  div.style.alignItems = 'center';
  div.style.width = '640px';
  div.style.height = '360px';
  div.style.backgroundColor = color;
  document.body.appendChild(div);

  html2canvas(div).then((canvas) => {
    document.body.removeChild(div);
    const url = canvas.toDataURL();
    console.log('url', url);

    const imageElm = document.querySelector('img');

    if (!imageElm) {
      throw new Error('element not found');
    }

    imageElm.src = url;
  });
};

const generate = document.querySelector('button.generate');
generate!.addEventListener('click', onClick);
