import countdown from './countdown';
import './countdownElement';

const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
const clone = el => el.cloneNode();
const empty = el => {
    el.innerHTML = '';
    return el;
};

function mount(target, elements) {
    const frag = document.createDocumentFragment();

    elements.forEach(el => frag.appendChild(el));
    empty(target).appendChild(frag);

    return target;
};


$$('[data-countdown]').forEach((el) => {
    const span = document.createElement('span');
    const ui = { days: clone(span), hours: clone(span), minutes: clone(span), seconds: clone(span) };
    const handlers = {
        onChange: (key, value) => {
            ui[key].textContent = value;
            return ui[key];
        },
        onStart: (keys, render) => {
            mount(el, keys.map(render));
            return el;
        },
        onCancel: () => console.log('finish :)')
    }

    countdown(el.dataset.countdown, handlers);
});