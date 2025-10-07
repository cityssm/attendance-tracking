"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
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
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        const searchFilterPieces = searchFilterElement.value
            .trim()
            .toLowerCase()
            .split(' ');
        // eslint-disable-next-line no-labels
        callOutListLoop: for (const callOutList of AttendCallOuts.callOutLists) {
            const listStringToSearch = `${callOutList.listName} ${callOutList.listDescription ?? ''}`.toLowerCase();
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
            const listDescriptionHTML = (callOutList.listDescription ?? '').replace(/\n/g, '<br />');
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
        ${callOutList.allowSelfSignUp ?? false
                ? `<span class="tag is-light is-info">
              <span class="icon is-small"><i class="fas fa-hand-paper" aria-hidden="true"></i></span>
              <span>Self Sign Up</span>
              </span>`
                : ''} 
          <span class="tag" data-tooltip="Members">
            <span class="icon is-small"><i class="fas fa-hard-hat" aria-hidden="true"></i></span>
            <span>${callOutList.callOutListMembersCount ?? ''}</span>
          </span>
        </div>
        <div class="column is-narrow">
          <a class="button is-small" data-tooltip="Print List" href="${Attend.urlPrefix}/print/screen/callOutList/?listIds=${callOutList.listId}" target="_blank">
            <i class="fas fa-print" aria-hidden="true"></i>
            <span class="is-sr-only">Self Sign Up</span>
          </a>
        </div>
        </div>`;
            panelBlockElement
                .querySelector('button')
                ?.addEventListener('click', toggleCallOutListFavourite);
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
    document.querySelector('#callOuts--create')?.addEventListener('click', () => {
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
                createCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                modalElement.querySelector('#callOutListAdd--listName').focus();
                modalElement
                    .querySelector('#form--callOutListAdd')
                    ?.addEventListener('submit', doCreate);
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
