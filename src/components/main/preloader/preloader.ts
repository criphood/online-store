export class Preloader {
  preloaderComponent = document.createElement('div');

  setPreloader() {
    this.preloaderComponent.className = 'preloader-animation';
    const element = document.querySelector('.main-content') as HTMLElement;
    element.before(this.preloaderComponent);
  }

  removePreloader() {
    this.preloaderComponent.remove();
  }
}
