"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a;
    const MonTY = exports.MonTY;
    let callOutLists = exports.callOutLists;
    delete exports.callOutLists;
    const canUpdate = exports.callOutsCanUpdate;
    const canManage = exports.callOutsCanManage;
    const searchFilterElement = document.querySelector('#callOuts--searchFilter');
    const searchResultsElement = document.querySelector('#callOuts--searchResults');
    function renderCallOutLists() {
        var _a, _b;
        const panelElement = document.createElement('div');
        panelElement.className = 'panel';
        const searchFilterPieces = searchFilterElement.value
            .trim()
            .toLowerCase()
            .split(' ');
        for (const callOutList of callOutLists) {
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
            const panelBlockElement = document.createElement('a');
            panelBlockElement.className = 'panel-block';
            panelBlockElement.dataset.listId = callOutList.listId.toString();
            panelBlockElement.href = '#';
            panelBlockElement.innerHTML = `<span class="panel-icon">
        <i class="fas fa-list-ol" aria-hidden="true"></i>
        </span>
        <div>
          <strong>${callOutList.listName}</strong><br />
          <span class="is-size-7">${(_b = callOutList.listDescription) !== null && _b !== void 0 ? _b : ''}</span>
        </div>`;
            panelBlockElement.addEventListener('click', openCallOutListByClick);
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
    function openCallOutList(listId) {
        const callOutList = callOutLists.find((possibleCallOutList) => {
            return possibleCallOutList.listId === listId;
        });
        let callOutListModalElement;
        function doUpdateCallOutList(formEvent) {
            formEvent.preventDefault();
            if (!canManage) {
                bulmaJS.alert({
                    title: 'Access Denied',
                    message: 'You do not have permission to update call out lists.',
                    contextualColorName: 'danger'
                });
                return;
            }
            cityssm.postJSON(MonTY.urlPrefix + '/attendance/doUpdateCallOutList', formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Call out list updated successfully.',
                        contextualColorName: 'success'
                    });
                    callOutListModalElement.querySelector('.modal-card-title').textContent = callOutListModalElement.querySelector('#callOutListEdit--listName').value;
                    callOutLists = responseJSON.callOutLists;
                    renderCallOutLists();
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Updating Call Out List',
                        message: 'Please try again.',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        cityssm.openHtmlModal('callOuts-list', {
            onshow(modalElement) {
                var _a, _b, _c, _d, _e, _f;
                callOutListModalElement = modalElement;
                modalElement.querySelector('.modal-card-title').textContent = callOutList.listName;
                if (canManage) {
                    (_b = (_a = modalElement
                        .querySelector(".menu a[href$='tab--callOuts-memberManagement']")) === null || _a === void 0 ? void 0 : _a.closest('li')) === null || _b === void 0 ? void 0 : _b.classList.remove('is-hidden');
                }
                // List Details form
                ;
                modalElement.querySelector('#callOutListEdit--listId').value = callOutList.listId;
                modalElement.querySelector('#callOutListEdit--listName').value = callOutList.listName;
                modalElement.querySelector('#callOutListEdit--listDescription').value = (_c = callOutList.listDescription) !== null && _c !== void 0 ? _c : '';
                // Eligibility Function
                let eligibilityFunctionFound = false;
                const eligibilityFunctionElement = modalElement.querySelector('#callOutListEdit--eligibilityFunction');
                for (const eligibilityFunctionName of exports.employeeEligibilityFunctionNames) {
                    const optionElement = document.createElement('option');
                    optionElement.value = eligibilityFunctionName;
                    optionElement.textContent = eligibilityFunctionName;
                    if (eligibilityFunctionName === callOutList.eligibilityFunction) {
                        optionElement.selected = true;
                        eligibilityFunctionFound = true;
                    }
                    eligibilityFunctionElement.append(optionElement);
                }
                if (!eligibilityFunctionFound &&
                    ((_d = callOutList.eligibilityFunction) !== null && _d !== void 0 ? _d : '') !== '') {
                    const optionElement = document.createElement('option');
                    optionElement.value = callOutList.eligibilityFunction;
                    optionElement.textContent = callOutList.eligibilityFunction;
                    optionElement.selected = true;
                    eligibilityFunctionElement.append(optionElement);
                }
                // Sort Key Function
                let sortKeyFunctionFound = false;
                const sortKeyFunctionElement = modalElement.querySelector('#callOutListEdit--sortKeyFunction');
                for (const sortKeyFunctionName of exports.employeeSortKeyFunctionNames) {
                    const optionElement = document.createElement('option');
                    optionElement.value = sortKeyFunctionName;
                    optionElement.textContent = sortKeyFunctionName;
                    if (sortKeyFunctionName === callOutList.sortKeyFunction) {
                        optionElement.selected = true;
                        sortKeyFunctionFound = true;
                    }
                    sortKeyFunctionElement.append(optionElement);
                }
                if (!sortKeyFunctionFound &&
                    ((_e = callOutList.sortKeyFunction) !== null && _e !== void 0 ? _e : '') !== '') {
                    const optionElement = document.createElement('option');
                    optionElement.value = callOutList.sortKeyFunction;
                    optionElement.textContent = callOutList.sortKeyFunction;
                    optionElement.selected = true;
                    sortKeyFunctionElement.append(optionElement);
                }
                if (canManage) {
                    const unlockButtonsContainerElement = modalElement.querySelector('#callOutListEdit--unlockButtons');
                    unlockButtonsContainerElement.classList.remove('is-hidden');
                    (_f = unlockButtonsContainerElement
                        .querySelector('button')) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => {
                        var _a;
                        unlockButtonsContainerElement.remove();
                        (_a = modalElement
                            .querySelector('#callOutListEdit--updateButtons')) === null || _a === void 0 ? void 0 : _a.classList.remove('is-hidden');
                        const formElement = modalElement.querySelector('#form--callOutListEdit');
                        formElement.addEventListener('submit', doUpdateCallOutList);
                        formElement.querySelector('fieldset').disabled = false;
                    });
                }
            },
            onshown(modalElement, closeModalFunction) {
                MonTY.initializeMenuTabs(modalElement.querySelectorAll('.menu a'), modalElement.querySelectorAll('.tabs-container > article'));
            }
        });
    }
    function openCallOutListByClick(clickEvent) {
        clickEvent.preventDefault();
        const listId = clickEvent.currentTarget.dataset
            .listId;
        openCallOutList(listId);
    }
    (_a = document.querySelector('#callOuts--create')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        let createCloseModalFunction;
        function doCreate(formEvent) {
            formEvent.preventDefault();
            cityssm.postJSON(MonTY.urlPrefix + '/attendance/doCreateCallOutList', formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                callOutLists = responseJSON.callOutLists;
                renderCallOutLists();
                createCloseModalFunction();
            });
        }
        cityssm.openHtmlModal('callOuts-createList', {
            onshown(modalElement, closeModalFunction) {
                var _a;
                createCloseModalFunction = closeModalFunction;
                (_a = modalElement
                    .querySelector('#form--callOutListAdd')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', doCreate);
            }
        });
    });
    // Load Page
    renderCallOutLists();
    searchFilterElement.addEventListener('keyup', renderCallOutLists);
})();
