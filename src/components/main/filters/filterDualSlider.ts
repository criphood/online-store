import { FilterBase, filtersTypes } from './filterBase';
import { IProductItem } from '../interface/Iproducts';
import { parseQuery } from '../../../functions/utils';

export class FilterSliderRange extends FilterBase {
  sliderInputOne = document.createElement('input');
  sliderInputOneID = `${this.type}-one`;
  sliderInputTwo = document.createElement('input');
  sliderInputTwoID = `${this.type}-two`;
  sliderValueOne = '';
  sliderValueTwo = '';
  isActive = false;

  constructor(type: filtersTypes, products: IProductItem[]) {
    super(type, products);
    this.setDefaultState();
  }

  getRangeData() {
    const filterItems = this.getFilterFieldList(this.products);
    const rangeArr = (filterItems as number[]).sort((a, b) => a - b);
    const rangeData = [rangeArr[0], rangeArr[rangeArr.length - 1]];
    return rangeData;
  }

  setDefaultState() {
    const valuesData = this.getRangeData();
    const defaultvalueMin = `${valuesData[0]}`;
    const defaultvalueMax = `${valuesData[1]}`;
    this.sliderValueOne = defaultvalueMin;
    this.sliderValueTwo = defaultvalueMax;
    this.sliderInputOne.id = this.sliderInputOneID;
    this.sliderInputOne.type = 'range';
    this.sliderInputOne.min = '0';
    this.sliderInputOne.max = defaultvalueMax;
    this.sliderInputOne.setAttribute('value', defaultvalueMin);
    this.sliderInputOne.name = `${this.type}`;
    this.sliderInputTwo.id = this.sliderInputTwoID;
    this.sliderInputTwo.type = 'range';
    this.sliderInputTwo.min = '0';
    this.sliderInputTwo.max = defaultvalueMax;
    this.sliderInputTwo.setAttribute('value', defaultvalueMax);
    this.sliderInputTwo.name = `${this.type}`;
    if (this.type === 'price') {
      this.sliderInputOne.step = '1';
      this.sliderInputTwo.step = '1';
    }
    if (this.type === 'rating') {
      this.sliderInputOne.step = '0.01';
      this.sliderInputTwo.step = '0.01';
    }
    this.isActive = false;
  }

  render() {
    const initialValues = this.getRangeData();
    const sliderHTML = `
            <div class="filter__slider" id="slider-${this.type}">
            <h3 class="filter__title">${this.type.toUpperCase()}</h3>
            <div class="filter-values" id="${this.type}-values">
              <span class="filter-values__item" id="${this.type}-value-min">
                ${initialValues[0]}
              </span>
              <span class="filter-values__item" id="${this.type}-value-max">
              ${initialValues[1]}
              </span>
            </div>
              <div class="filter__slider-container">
                <div class="filter__slider-track" id="${this.type}-track"></div>
                ${this.sliderInputOne.outerHTML}
                ${this.sliderInputTwo.outerHTML}
              </div>
            </div>`;
    return sliderHTML;
  }

  setValue(value: string, id: string) {
    if (id === this.sliderInputOneID) {
      +value <= +this.sliderInputOne.min
        ? (this.sliderValueOne = `${this.getRangeData()[0]}`)
        : (this.sliderValueOne = value);
    }
    if (id === this.sliderInputTwoID) {
      +value >= +this.sliderInputTwo.max
        ? (this.sliderValueTwo = `${this.getRangeData()[1]}`)
        : (this.sliderValueTwo = value);
    }
  }

  setSavedValues(values: string[]) {
    this.sliderValueOne = values[0];
    this.sliderValueTwo = values[1];
  }

  getValue() {
    return [this.sliderValueOne, this.sliderValueTwo].sort((a, b) => +a - +b);
  }

  setValueSpan() {
    const spanDiv = document.getElementById(`${this.type}-values`);

    if (spanDiv instanceof HTMLElement) {
      spanDiv.innerHTML = `
        <span class="filter-values__item" id="${this.type}-value-min">
                ${this.getValue()[0]} -</span>
              <span class="filter-values__item" id="${this.type}-value-max">
              ${this.getValue()[1]}
              </span>
        `;
    }
  }

  setOneSpan(message: string) {
    const spanDiv = document.getElementById(`${this.type}-values`);
    if (spanDiv instanceof HTMLElement) {
      spanDiv.innerHTML = `
        <span class="filter-value__one-span">
              ${message}
              </span>
        `;
    }
  }

  updatePointers() {
    const currentInputOne = document.getElementById(`${this.sliderInputOneID}`);
    const currentInputTwo = document.getElementById(`${this.sliderInputTwoID}`);

    const min = `${this.getValue()[0]}`;
    const max = `${this.getValue()[1]}`;
    if (currentInputOne instanceof HTMLInputElement && currentInputTwo instanceof HTMLInputElement) {
      currentInputOne.value = min;
      currentInputTwo.value = max;
    }
  }

  updateState(products: IProductItem[]) {
    const key: keyof IProductItem = this.type;
    const productsValues = products.map((item) => +item[key]);

    let minValue;
    let maxValue;
    if (this.isActive) {
      [minValue, maxValue] = [this.getValue()[0], this.getValue()[1]];
      this.isActive = false;
    } else if (
      document.location.search.includes(`${this.type}=`) &&
      !document.location.search.includes('brand') &&
      !document.location.search.includes('category')
    ) {
      [minValue, maxValue] = [parseQuery()[this.type][0], parseQuery()[this.type][1]];
      this.setValue(`${minValue}`, this.sliderInputOneID);
      this.setValue(`${maxValue}`, this.sliderInputTwoID);
    } else {
      if (productsValues.length) {
        minValue = Math.min.apply(Math, [...productsValues]);
        maxValue = Math.max.apply(Math, [...productsValues]);
        this.setValue(`${minValue}`, this.sliderInputOneID);
        this.setValue(`${maxValue}`, this.sliderInputTwoID);
      }
    }

    if (productsValues.length === 0) {
      this.setOneSpan('Products not found!');
    } else if (minValue === maxValue) {
      this.setOneSpan(`${maxValue}`);
    } else {
      this.setValueSpan();
    }
    this.updatePointers();
    this.fillColor();
  }

  fillColor() {
    const sliderTrack = document.getElementById(`${this.type}-track`);
    const sliderMaxValue = +this.sliderInputOne.max;

    if (sliderTrack instanceof HTMLElement) {
      const percent1 = (+this.getValue()[0] / sliderMaxValue) * 100;
      const percent2 = (+this.getValue()[1] / sliderMaxValue) * 100;
      sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , rgb(238, 136, 53) ${percent1}% , rgb(238, 136, 53) ${percent2}%, #dadae5 ${percent2}%)`;
    }
  }
}
