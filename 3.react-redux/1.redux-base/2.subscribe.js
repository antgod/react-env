import { createStore } from 'redux';

var reducer = function (state = 0, action) {
    switch (action.type) {
        case 1:
            state = state - 1;
            return state;
        case 2:
            state = state + 1;
            return state;
        default:
            return state
    }
};

var store = createStore(reducer);

var render = function () {
    document.body.innerHTML = store.getState();
};
render();

store.subscribe(render);

document.onclick = function () {
    store.dispatch({
        type:2,
        error:true
    });
};

