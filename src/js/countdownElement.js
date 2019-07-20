import countdown from './countdown';

class CountDown extends HTMLElement {
    constructor() {
        super();

        this.counter = null;
        this.onCounterStart = this.onCounterStart.bind(this);
        this.onCounterChange = this.onCounterChange.bind(this);
    }

    connectedCallback() {
        const dateString = this.textContent;

        this.setupUI();
        this.counter = countdown(dateString, {
            onStart: this.onCounterStart,
            onChange: this.onCounterChange,
        });
    }

    disconnectedCallback() {
        this.counter.cancel();
        this.counter = null;
    }

    setupUI() {
        const element = () => this.appendChild(document.createElement('span'));

        this.innerHTML = '';
        this.ui = { 
            days: element(),
            hours: element(),
            minutes: element(),
            seconds: element()
        };

        return this;
    }

    onCounterStart(keys, render) {
        keys.map(render);
        return this;
    }

    onCounterChange(key, value) {
        this.ui[key].textContent = value;
        return this.ui[key];
    }
}

customElements.define('count-down', CountDown);
