const isEqual = (a, b) => (a === b);
const noop = () => {};

function getHandlers(custom = {}) {
    const defaults = {
        onChange: () => { throw Error('OnChange method is required') },
        onStart: noop,
        onCancel: noop
    };

    return Object.assign(defaults, custom);
}

function relativeTime(to, from = Date.now()) {
    const diff    = Math.max(to - from, 0);
    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours   = minutes / 60;
    const days    = hours / 24;

    return {
        total: diff,
        days: Math.floor(days),
        hours: Math.floor(hours % 24),
        minutes: Math.floor(minutes % 60),
        seconds: Math.floor(seconds % 60)
    };
}

function countdown(datestring, handlers) {
    const { onChange, onStart, onCancel } = getHandlers(handlers);
    const keys = ['days', 'hours', 'minutes', 'seconds'];
    const end = Date.parse(datestring);
    let prevState = {};
    let state = relativeTime(end);
    let interval = null;

    function hasChanged(key) {
        return !isEqual(state[key], prevState[key]);
    }

    function triggerChange(key) {
        return onChange(key, state[key]);
    }

    function update() {
        prevState = state;
        state = relativeTime(end);

        keys.filter(hasChanged).forEach(triggerChange);

        return keys.some(key => (state[key] > 0));
    }

    function loop() {
        interval = update() ? requestAnimationFrame(loop) : null;
    }

    function cancel() {
        if (interval !== null) cancelAnimationFrame(interval);
        onCancel(keys);
    }

    function start() {
        onStart(keys, triggerChange);
        loop();
    }

    start();

    return { start, cancel };
}

export default countdown;
