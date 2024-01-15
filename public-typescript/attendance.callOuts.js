"use strict";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const Attend = exports.Attend;
    const AttendCallOuts = Attend.callOuts;
    const searchFilterElement = document.querySelector('#callOuts--searchFilter');
    const searchResultsElement = document.querySelector('#callOuts--searchResults');
    function toggleCallOutListFavourite(clickEvent) {
        const buttonElement = clickEvent.currentTarget;
        const oldIsFavourite = buttonElement.dataset.isFavourite === '1';
        const panelBlockElement = buttonElement.closest('.panel-block');
        const listId = panelBlockElement.dataset.listId;
        cityssm.postJSON(`${Attend.urlPrefix}/attendance/${oldIsFavourite
            ? 'doRemoveFavouriteCallOutList'
            : 'doAddFavouriteCallOutList'}`, { listId }, (rawResponseJSON) => {
            const responseJSON = rawResponseJSON;
            if (responseJSON.success) {
                AttendCallOuts.callOutLists = responseJSON.callOutLists;
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
        var _a, _b, _c, _d, _e;
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        const searchFilterPieces = searchFilterElement.value
            .trim()
            .toLowerCase()
            .split(' ');
        // eslint-disable-next-line no-labels
        callOutListLoop: for (const callOutList of AttendCallOuts.callOutLists) {
            const listStringToSearch = `${callOutList.listName} ${(_a = callOutList.listDescription) !== null && _a !== void 0 ? _a : ''}`.toLowerCase();
            for (const searchFilterPiece of searchFilterPieces) {
                if (!listStringToSearch.includes(searchFilterPiece)) {
                    // eslint-disable-next-line no-labels
                    continue callOutListLoop;
                }
            }
            const panelBlockElement = document.createElement('div');
            panelBlockElement.className = 'panel-block is-block';
            panelBlockElement.dataset.listId = callOutList.listId.toString();
            // eslint-disable-next-line unicorn/prefer-string-replace-all
            const listDescriptionHTML = ((_b = callOutList.listDescription) !== null && _b !== void 0 ? _b : '').replace(/\n/g, '<br />');
            panelBlockElement.innerHTML = `<div class="columns is-mobile is-variable is-1">
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
            <span class="is-size-7">${listDescriptionHTML}</span>
          </a>
        </div>
        <div class="column is-narrow">
        ${((_c = callOutList.allowSelfSignUp) !== null && _c !== void 0 ? _c : false)
                ? `<span class="tag is-light is-info">
              <span class="icon is-small"><i class="fas fa-hand-paper" aria-hidden="true"></i></span>
              <span>Self Sign Up</span>
              </span>`
                : ''} 
          <span class="tag" data-tooltip="Members">
            <span class="icon is-small"><i class="fas fa-hard-hat" aria-hidden="true"></i></span>
            <span>${(_d = callOutList.callOutListMembersCount) !== null && _d !== void 0 ? _d : ''}</span>
          </span>
        </div>
        </div>`;
            (_e = panelBlockElement
                .querySelector('button')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', toggleCallOutListFavourite);
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
        clickEvent.preventDefault();
        const listId = clickEvent.currentTarget.closest('.panel-block').dataset.listId;
        AttendCallOuts.openCallOutList(listId, renderCallOutLists);
    }
    (_a = document.querySelector('#callOuts--create')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let createCloseModalFunction;
        function doCreate(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(`${Attend.urlPrefix}/attendance/doCreateCallOutList`, formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                AttendCallOuts.callOutLists = responseJSON.callOutLists;
                renderCallOutLists();
                AttendCallOuts.openCallOutList(responseJSON.listId);
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
