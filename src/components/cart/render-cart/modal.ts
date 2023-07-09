import { getSelector, checkLength, allowOnlyDigits, reductLength } from '../../../functions/utils';
import { loadMainPage } from '../../main';
import { cartStatement, setState, showTotalCost } from '../local-storage/cart-storage';
import { renderCartIcon } from '../cart-icon/icon';
import { loadCartPage } from '..';

const regDigits = /^\d+$/;

function renderModal() {
  const buttonBuy = getSelector(document, '.product__options-buy'),
    body = getSelector(document, 'body');

  buttonBuy.addEventListener('click', () => {
    const modal = document.createElement('div');

    modal.classList.add('modal');
    modal.innerHTML = `
      <form class="modal__container">
        <h3 class="modal__header">Personal details:</h3>
        <div class="input-wrapper">
          <input class="modal__info wrong" placeholder="Name" id="name">
          <div class="input-error hide">error</div>
        </div>
        <div class="input-wrapper">
          <input class="modal__info wrong" placeholder="Phone number" id="phone">
          <div class="input-error hide">error</div>
        </div>
        <div class="input-wrapper">
          <input class="modal__info wrong" placeholder="Delivery address" id="address">
          <div class="input-error hide">error</div>
        </div>
        <div class="input-wrapper">
          <input class="modal__info wrong" placeholder="E-mail" id="email">
          <div class="input-error hide">error</div>
        </div>
        <h3 class="modal__header">Credit card details:</h3>
        <div class="credit-card">
          <div class="credit-card__top">
            <div class="logo"></div>
            <div class="input-wrapper">
              <input class="credit-card__info wrong" placeholder="Card Number" id="number">
              <div class="input-error hide">error</div>
            </div>
          </div>
          <div class="credit-card__bottom">
            <div class="credit-card__valid">
              <div class="info-title">
                Valid:
              </div>
              <div class="input-wrapper">
                <input class="credit-card__info wrong" placeholder="MM/DD" id="valid">
                <div class="input-error hide">error</div>
              </div>
            </div>
            <div class="credit-card__valid">
              <div class="info-title">CVV:</div>
              <div class="input-wrapper">
                <input class="credit-card__info wrong" placeholder="CVV" id="cvv">
                <div class="input-error hide">error</div>
              </div>
            </div>
          </div>
        </div>

        <button class="confirm">CONFIRM</button>
      </form>
    `;
    body.append(modal);

    hideOverflow();

    const modalWindow = getSelector(document, '.modal'),
      [name, phone, address, email, number, valid, cvv] = [
        getSelector(document, '#name'),
        getSelector(document, '#phone'),
        getSelector(document, '#address'),
        getSelector(document, '#email'),
        getSelector(document, '#number'),
        getSelector(document, '#valid'),
        getSelector(document, '#cvv'),
      ],
      confirmButton = getSelector(document, '.confirm'),
      inputs = Array.from(modalWindow.querySelectorAll('input'));

    modal.addEventListener('click', removeModal);

    validateName(name);
    validatePhone(phone);
    validateAddress(address);
    validateEmail(email);
    validateCardNumber(number);
    validateCardValidity(valid);
    validateCVV(cvv);

    confirmButton.addEventListener('click', (e) => {
      e.preventDefault();

      const isFormValid = inputs.every((item) => {
        return !item.matches('.wrong');
      });

      handleAllErrors();

      if (isFormValid) {
        modal.removeEventListener('click', removeModal);

        modal.innerHTML = `
            <p class="container-message">
              Thank you for the order! You will be redirected to the main page.
            </p>
          `;

        setTimeout(() => {
          cartStatement.inCart = [];
          cartStatement.inCartAmount = {};
          cartStatement.counter = 0;
          cartStatement.codes = [];
          setState();

          loadCartPage.loadPage();
          renderCartIcon();
          showTotalCost();

          modal.remove();
          loadMainPage.loadPage();
        }, 3000);
      }
    });

    function removeModal(e: Event) {
      if (e.target === modal) {
        showOverflow();
        modal.remove();
      }
    }
  });
}

function hideOverflow() {
  const body = getSelector(document, 'body');
  body.style.overflow = 'hidden';

  if (body.scrollHeight > body.clientHeight) {
    body.style.paddingRight = '10px';
  }
}

function showOverflow() {
  getSelector(document, 'body').style.overflow = 'visible';
  getSelector(document, 'body').style.paddingRight = '0';
}

function validateName(name: HTMLElement) {
  if (name instanceof HTMLInputElement) {
    name.addEventListener('change', () => {
      const words = name.value.split(' ');

      checkLength(name, 2, 3);

      words.forEach((word) => {
        if (!/[A-Z]/.test(word.slice(0, 1)) || words.length <= 1) {
          name.classList.add('wrong');
        }
      });

      handleError(name);
    });
  }
}

function validatePhone(phone: HTMLElement) {
  if (phone instanceof HTMLInputElement) {
    phone.addEventListener('change', () => {
      const firstSymbol = phone.value.slice(0, 1),
        numbers = phone.value.slice(1);

      if (firstSymbol !== '+' || !regDigits.test(numbers) || numbers.length < 9) {
        phone.classList.add('wrong');
      } else {
        phone.classList.remove('wrong');
      }

      handleError(phone);
    });
  }
}

function validateAddress(address: HTMLElement) {
  if (address instanceof HTMLInputElement) {
    address.addEventListener('change', () => {
      checkLength(address, 3, 5);

      handleError(address);
    });
  }
}

function validateEmail(email: HTMLElement) {
  const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;

  if (email instanceof HTMLInputElement) {
    email.addEventListener('change', () => {
      if (!EMAIL_REGEXP.test(email.value)) {
        email.classList.add('wrong');
      } else {
        email.classList.remove('wrong');
      }

      handleError(email);
    });
  }
}

function validateCardNumber(number: HTMLElement) {
  const logo = getSelector(document, '.logo');

  if (number instanceof HTMLInputElement) {
    number.addEventListener('change', () => {
      if (!regDigits.test(number.value) || number.value.length !== 16) {
        number.classList.add('wrong');
      } else {
        number.classList.remove('wrong');
      }

      handleError(number);
    });

    document.addEventListener('keydown', (e) => {
      number.oninput = () => {
        const firstDigit = +number.value.slice(0, 1);

        allowOnlyDigits(number);
        reductLength(number, 16);

        if (firstDigit === 3) {
          logo.style.backgroundImage = `url('../../assets/american-express.png')`;
        } else if (firstDigit === 4) {
          logo.style.backgroundImage = `url('../../assets/visa.png')`;
        } else if (firstDigit === 5) {
          logo.style.backgroundImage = `url('../../assets/mastercard.png')`;
        } else {
          logo.style.backgroundImage = `url('../../assets/card.png')`;
        }
      };
    });
  }
}

function validateCardValidity(valid: HTMLElement) {
  if (valid instanceof HTMLInputElement) {
    valid.addEventListener('change', () => {
      const value = valid.value.replace('/', '');

      if (!regDigits.test(value) || +value.slice(0, 2) > 12 || +value.slice(2) > 31 || value.length !== 4) {
        valid.classList.add('wrong');
      } else {
        valid.classList.remove('wrong');
      }

      handleError(valid);
    });

    document.addEventListener('keydown', (e) => {
      if (valid.value.length === 2 && e.code !== 'Backspace') {
        valid.value += '/';
      }

      valid.oninput = () => {
        valid.value = valid.value.replace(/[^\d+/]/g, '');
        reductLength(valid, 5);
      };
    });
  }
}

function validateCVV(cvv: HTMLElement | ParentNode) {
  if (cvv instanceof HTMLInputElement) {
    cvv.oninput = () => {
      allowOnlyDigits(cvv);
      reductLength(cvv, 3);
    };

    cvv.onchange = () => {
      if (cvv.value.length < 3) {
        cvv.classList.add('wrong');
      } else {
        cvv.classList.remove('wrong');
      }

      handleError(cvv);
    };
  }
}

function handleError(item: HTMLInputElement) {
  if (item.parentNode) {
    const error = getSelector(item.parentNode, '.input-error');
    if (item.matches('.wrong')) {
      error.classList.remove('hide');
      error.classList.add('show');
    } else {
      error.classList.remove('show');
      error.classList.add('hide');
    }
  }
}

function handleAllErrors() {
  const modalWindow = getSelector(document, '.modal'),
    inputs = Array.from(modalWindow.querySelectorAll('input'));

  inputs.map((input) => {
    handleError(input);
  });
}

export { renderModal, regDigits };
