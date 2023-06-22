"use strict";
/* eslint-disable unicorn/prefer-string-replace-all */
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const MonTY = exports.MonTY;
    const searchFilterElement = document.querySelector('#callOuts--searchFilter');
    const searchResultsElement = document.querySelector('#callOuts--searchResults');
    function toggleCallOutListFavourite(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const oldIsFavourite = buttonElement.dataset.isFavourite === '1';
        const panelBlockElement = buttonElement.closest('.panel-block');
        const listId = panelBlockElement.dataset.listId;
        cityssm.postJSON(MonTY.urlPrefix +
            (oldIsFavourite
                ? '/attendance/doRemoveFavouriteCallOutList'
                : '/attendance/doAddFavouriteCallOutList'), { listId }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                MonTY.callOuts.callOutLists = responseJSON.callOutLists;
                renderCallOutLists();
            }
            else {
                bulmaJS.alert({
                    title: 'Error Updating Favourites',
                    message: 'Please try again.'
                });
            }
        });
    }
    function renderCallOutLists() {
        var _a, _b, _c, _d;
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        const searchFilterPieces = searchFilterElement.value
            .trim()
            .toLowerCase()
            .split(' ');
        for (const callOutList of MonTY.callOuts.callOutLists) {
            let showList = true;
            const listStringToSearch = (callOutList.listName +
                ' ' +
                ((_a = callOutList.listDescription) !== null && _a !== void 0 ? _a : '')).toLowerCase();
            for (const searchFilterPiece of searchFilterPieces) {
                if (!listStringToSearch.includes(searchFilterPiece)) {
                    showList = false;
                    break;
                }
            }
            if (!showList) {
                continue;
            }
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block';
            panelBlockElement.dataset.listId = callOutList.listId.toString();
            panelBlockElement.innerHTML = `<div class="columns is-mobile">
        <div class="column is-narrow">
          <button class="button is-white" data-is-favourite="${callOutList.isFavourite ? '1' : '0'}" data-tooltip="Toggle Favourite" type="button" aria-label="Toggle Favourite">
            ${callOutList.isFavourite
                ? '<i class="fas fa-star" aria-hidden="true"></i><span class="is-sr-only">Favourite</span>'
                : '<i class="far fa-star" aria-hidden="true"></i><span class="is-sr-only">Not Favourite</span>'}
          </button>
        </div>
        <div class="column">
          <a class="is-block" href="#">
          <strong>${callOutList.listName}</strong><br />
            <span class="is-size-7">${((_b = callOutList.listDescription) !== null && _b !== void 0 ? _b : '').replace(/\n/g, '<br />')}</span>
          </a>
        </div>
        <div class="column is-narrow">
        ${callOutList.allowSelfSignUp
                ? `<span class="tag is-light is-info">
              <span class="icon is-small"><i class="fas fa-hand-paper" aria-hidden="true"></i></span>
              <span>Self Sign Up</span>
              </span>`
                : ''} 
          <span class="tag" data-tooltip="Members">
            <span class="icon is-small"><i class="fas fa-hard-hat" aria-hidden="true"></i></span>
            <span>${(_c = callOutList.callOutListMembersCount) !== null && _c !== void 0 ? _c : ''}</span>
          </span>
        </div>
        </div>`;
            (_d = panelBlockElement
                .querySelector('button')) === null || _d === void 0 ? void 0 : _d.addEventListener('click', toggleCallOutListFavourite);
            const listAnchorElement = panelBlockElement.querySelector('a');
            listAnchorElement.dataset.cy = callOutList.listName;
            listAnchorElement.addEventListener('click', openCallOutListByClick);
            panelElement.append(panelBlockElement);
        }
        if (panelElement.hasChildNodes()) {
            searchResultsElement.innerHTML = '';
            searchResultsElement.append(panelElement);
        }
        else {
            searchResultsElement.innerHTML = `<div class="message is-info">
        <p class="message-body">There are no call out lists that meet your search criteria.</p>
        </div>`;
        }
    }
    function openCallOutListByClick(clickEvent) {
        var _a;
        clickEvent.preventDefault();
        const listId = clickEvent.currentTarget.closest('.panel-block').dataset.listId;
        (_a = MonTY.callOuts) === null || _a === void 0 ? void 0 : _a.openCallOutList(listId, renderCallOutLists);
    }
    (_a = document.querySelector('#callOuts--create')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let createCloseModalFunction;
        function doCreate(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(MonTY.urlPrefix + '/attendance/doCreateCallOutList', formEvent.currentTarget, (rawResponseJSON) => {
                var _a;
                const responseJSON = rawResponseJSON;
                MonTY.callOuts.callOutLists = responseJSON.callOutLists;
                renderCallOutLists();
                (_a = MonTY.callOuts) === null || _a === void 0 ? void 0 : _a.openCallOutList(responseJSON.listId);
                createCloseModalFunction();
            });
        }
        cityssm.openHtmlModal('callOuts-createList', {
            onshown(modalElement, closeModalFunction) {
                var _a;
                createCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                modalElement.querySelector('#callOutListAdd--listName').focus();
                (_a = modalElement
                    .querySelector('#form--callOutListAdd')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doCreate);
            },
            onremoved() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    });
    // Load Page
    renderCallOutLists();
    searchFilterElement.addEventListener('keyup', renderCallOutLists);
})();
