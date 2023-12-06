"use strict";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b;
    const Attend = exports.Attend;
    const callOutLists = ((_a = exports.callOutLists) !== null && _a !== void 0 ? _a : []);
    function openCallOutListByClick(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const listId = clickEvent.currentTarget.dataset
            .listId;
        (_a = Attend.callOuts) === null || _a === void 0 ? void 0 : _a.openCallOutList(listId);
    }
    const callOutListContainerElement = document.querySelector('#container--favouriteCallOutLists');
    if (callOutListContainerElement !== null) {
        let hasFavourites = false;
        for (const callOutList of callOutLists) {
            if (!((_b = callOutList.isFavourite) !== null && _b !== void 0 ? _b : false)) {
                continue;
            }
            hasFavourites = true;
            const panelBlockElement = document.createElement('a');
            panelBlockElement.className = 'panel-block';
            panelBlockElement.dataset.listId = callOutList.listId;
            panelBlockElement.href = '#';
            panelBlockElement.innerHTML = `<span class="panel-icon"><i class="fas fa-phone" aria-hidden="true"></i></span>
        ${callOutList.listName}`;
            panelBlockElement.addEventListener('click', openCallOutListByClick);
            callOutListContainerElement.append(panelBlockElement);
        }
        if (!hasFavourites) {
            callOutListContainerElement.insertAdjacentHTML('beforeend', `<div class="panel-block is-block">
          <div class="message is-small is-info">
            <div class="message-body">
              <strong>You have no favourite call out lists.</strong><br />
              Add call out lists to your dashboard for quick access by marking them as favourites.
            </div>
          </div>
        </div>`);
        }
    }
    const absencesCallOutListElements = document.querySelectorAll('#tab--attendance-absences a.is-call-out-list');
    for (const listElement of absencesCallOutListElements) {
        ;
        listElement.addEventListener('click', openCallOutListByClick);
    }
})();
