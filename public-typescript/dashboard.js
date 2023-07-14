"use strict";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const MonTY = exports.MonTY;
    const callOutListContainerElement = document.querySelector('#container--favouriteCallOutLists');
    const callOutLists = ((_a = exports.callOutLists) !== null && _a !== void 0 ? _a : []);
    function openCallOutListByClick(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const listId = clickEvent.currentTarget.dataset
            .listId;
        (_a = MonTY.callOuts) === null || _a === void 0 ? void 0 : _a.openCallOutList(listId);
    }
    if (callOutListContainerElement !== null) {
        for (const callOutList of callOutLists) {
            const panelBlockElement = document.createElement('a');
            panelBlockElement.className = 'panel-block';
            panelBlockElement.dataset.listId = callOutList.listId;
            panelBlockElement.href = '#';
            panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow"><i class="fas fa-phone" aria-hidden="true"></i></div>
        <div class="column">${callOutList.listName}</div>
        </div>`;
            panelBlockElement.addEventListener('click', openCallOutListByClick);
            callOutListContainerElement.append(panelBlockElement);
        }
    }
})();
