import { getDataBase64 } from '../../../functions/utils';
import { getSelector, appendImage } from '../../../functions/utils';

async function loadThumbnail(url: string): Promise<void> {
  await fetch(url)
    .then((data) => data.blob())
    .then(getDataBase64())
    .then((res) => {
      appendImage('.head__image', 'thumbnail', <string>res);
      addImageChanger();
    });
}

async function loadImages(array: string[]): Promise<void> {
  const arr: unknown[] = [];

  for (let i = 0; i < array.length; i++) {
    await fetch(array[i])
      .then((data) => data.blob())
      .then(getDataBase64())
      .then((blob) => arr.push(blob));
  }

  Promise.all(arr).then((res) => {
    const unique = res.filter((item, index) => {
      return res.indexOf(item) === index;
    });

    for (let i = 0; i < unique.length; i++) {
      appendImage('.side__images', 'side__images-item', <string>unique[i]);
    }
  });
}

function addImageChanger() {
  const sideImages = getSelector(document, '.side__images'),
    thumbnail = getSelector(document, '.thumbnail');

  sideImages.addEventListener('click', (e) => {
    const target = e.target;

    if (!(target instanceof HTMLImageElement) || !(thumbnail instanceof HTMLImageElement)) {
      throw new Error('It is not the picture');
    }

    if (target?.matches('.side__images-item')) {
      thumbnail.src = target.src;
    }
  });
}

export { loadThumbnail, loadImages };
