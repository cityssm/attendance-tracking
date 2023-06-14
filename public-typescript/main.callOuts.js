"use strict";
/* eslint-disable unicorn/prefer-module */
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    var _a, _b, _c, _d, _e, _f, _g;
    const MonTY = exports.MonTY;
    let currentListId = '';
    let currentCallOutListMembers = [];
    /*
     * Data
     */
    let callOutLists = exports.callOutLists;
    function getCallOutListById(listId) {
        return MonTY.callOuts.callOutLists.find((possibleCallOutList) => {
            return possibleCallOutList.listId === currentListId;
        });
    }
    const callOutResponseTypes = ((_a = exports.callOutResponseTypes) !== null && _a !== void 0 ? _a : []);
    const employeeEligibilityFunctions = ((_b = exports.employeeEligibilityFunctionNames) !== null && _b !== void 0 ? _b : []);
    const employeeSortKeyFunctionNames = ((_c = exports.employeeSortKeyFunctionNames) !== null && _c !== void 0 ? _c : []);
    /*
     * Permissions
     */
    const isAdmin = (_e = ((_d = document.querySelector('main')) === null || _d === void 0 ? void 0 : _d.dataset.isAdmin) === 'true') !== null && _e !== void 0 ? _e : false;
    const userName = (_g = (_f = document.querySelector('main')) === null || _f === void 0 ? void 0 : _f.dataset.userName) !== null && _g !== void 0 ? _g : '';
    const canUpdate = callOutResponseTypes.length === 0
        ? false
        : exports.userPermissions.callOutsCanUpdate;
    const canManage = employeeEligibilityFunctions.length === 0
        ? false
        : exports.userPermissions.callOutsCanManage;
    function openCallOutListMember(employeeNumber) {
        const callOutList = getCallOutListById(currentListId);
        let callOutListMemberIndex = 0;
        const callOutListMember = currentCallOutListMembers.find((possibleMember, possibleIndex) => {
            if (possibleMember.employeeNumber === employeeNumber) {
                callOutListMemberIndex = possibleIndex;
                return true;
            }
            return false;
        });
        let callOutMemberModalElement;
        let callOutRecords;
        function addCallOutRecord(formEvent) {
            formEvent.preventDefault();
            const formElement = formEvent.currentTarget;
            cityssm.postJSON(MonTY.urlPrefix + '/attendance/doAddCallOutRecord', formElement, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Call out recorded successfully.',
                        contextualColorName: 'success'
                    });
                    formElement.reset();
                    callOutRecords = responseJSON.callOutRecords;
                    renderCallOutRecords();
                }
            });
        }
        function deleteCallOutRecord(clickEvent) {
            clickEvent.preventDefault();
            const recordId = clickEvent.currentTarget.closest('.panel-block').dataset.recordId;
            function doDelete() {
                cityssm.postJSON(MonTY.urlPrefix + '/attendance/doDeleteCallOutRecord', {
                    recordId,
                    employeeNumber,
                    listId: currentListId
                }, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        bulmaJS.alert({
                            message: 'Call out record deleted successfully.',
                            contextualColorName: 'success'
                        });
                        callOutRecords = responseJSON.callOutRecords;
                        renderCallOutRecords();
                    }
                });
            }
            bulmaJS.confirm({
                title: 'Delete Call Out Record',
                message: 'Are you sure you want to delete this call out record?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete Record',
                    callbackFunction: doDelete
                }
            });
        }
        function renderCallOutRecords() {
            // Tag Count
            var _a, _b, _c;
            callOutMemberModalElement.querySelector('#tag--recentCalls').textContent = callOutRecords.length.toString();
            // Data
            const callOutRecordsContainerElement = callOutMemberModalElement.querySelector('#container--callOutRecords');
            const callOutDateTimeMaxElement = callOutMemberModalElement.querySelector('#callOutListMember--callOutDateTimeMax');
            if (callOutRecords.length === 0) {
                callOutRecordsContainerElement.innerHTML = `<div class="message is-info">
          <p class="message-body">There are no recent call outs to show.</p>
          </div>`;
                callOutDateTimeMaxElement.textContent = '(No Recent Call Outs)';
                return;
            }
            const panelElement = document.createElement('div');
            panelElement.className = 'panel';
            for (const [index, record] of callOutRecords.entries()) {
                const callOutDateTime = new Date(record.callOutDateTime);
                if (index === 0) {
                    callOutDateTimeMaxElement.innerHTML = `${record.isSuccessful
                        ? '<i class="fas fa-fw fa-check has-text-success" aria-label="Yes"></i>'
                        : '<i class="fas fa-fw fa-times has-text-danger" aria-label="No"></i>'}
            ${callOutDateTime.toLocaleDateString()} ${callOutDateTime.toLocaleTimeString()}`;
                }
                const panelBlockElement = document.createElement('div');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.dataset.recordId = record.recordId;
                panelBlockElement.classList.add(record.isSuccessful
                    ? 'has-background-success-light'
                    : 'has-background-danger-light');
                panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column is-narrow">
            ${record.isSuccessful
                    ? '<i class="fas fa-fw fa-check has-text-success" aria-label="Yes"></i>'
                    : '<i class="fas fa-fw fa-times has-text-danger" aria-label="No"></i>'}
          </div>
          <div class="column">
            ${callOutDateTime.toLocaleDateString()} ${callOutDateTime.toLocaleTimeString()}<br />
            <span class="is-size-7">
              <strong>${(_a = record.responseType) !== null && _a !== void 0 ? _a : '(No Response)'}</strong><br />
              ${(_b = record.recordComment) !== null && _b !== void 0 ? _b : ''}
            </span>
          </div>
          <div class="column is-narrow">
            ${canUpdate &&
                    (isAdmin || record.recordCreate_userName === userName)
                    ? `<button class="button is-inverted is-danger is-delete-button" data-tooltip="Delete Record">
                  <i class="fas fa-trash" aria-hidden="true"></i>
                  </button>`
                    : ''}
          </div>
          </div>`;
                (_c = panelBlockElement
                    .querySelector('.is-delete-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', deleteCallOutRecord);
                panelElement.append(panelBlockElement);
            }
            callOutRecordsContainerElement.innerHTML = '';
            callOutRecordsContainerElement.append(panelElement);
        }
        cityssm.openHtmlModal('callOuts-member', {
            onshow(modalElement) {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
                callOutMemberModalElement = modalElement;
                const employeeName = callOutListMember.employeeSurname +
                    ', ' +
                    callOutListMember.employeeGivenName;
                modalElement.querySelector('.modal-card-title').textContent = employeeName;
                modalElement.querySelector('#callOutListMember--listName').textContent = callOutList.listName;
                modalElement.querySelector('#callOutListMember--employeeName').textContent = employeeName;
                modalElement.querySelector('#callOutListMember--employeeNumber').textContent = callOutListMember.employeeNumber;
                modalElement.querySelector('#callOutListMember--sortKey').textContent = (_a = callOutListMember.sortKey) !== null && _a !== void 0 ? _a : '';
                modalElement.querySelector('#callOutListMember--listPosition').textContent = `${callOutListMemberIndex + 1} / ${currentCallOutListMembers.length}`;
                if (canUpdate) {
                    ;
                    modalElement.querySelector('#callOutListMember--workContact1').textContent = (_b = callOutListMember.workContact1) !== null && _b !== void 0 ? _b : '';
                    modalElement.querySelector('#callOutListMember--workContact2').textContent = (_c = callOutListMember.workContact2) !== null && _c !== void 0 ? _c : '';
                    modalElement.querySelector('#callOutListMember--homeContact1').textContent = (_d = callOutListMember.homeContact1) !== null && _d !== void 0 ? _d : '';
                    modalElement.querySelector('#callOutListMember--homeContact2').textContent = (_e = callOutListMember.homeContact2) !== null && _e !== void 0 ? _e : '';
                }
                else {
                    (_g = (_f = modalElement
                        .querySelector('a[href$="tab--callNow"]')) === null || _f === void 0 ? void 0 : _f.closest('li')) === null || _g === void 0 ? void 0 : _g.remove();
                    (_h = modalElement.querySelector('#tab--callNow')) === null || _h === void 0 ? void 0 : _h.remove();
                    (_k = (_j = modalElement
                        .querySelector('a[href$="tab--recentCalls"]')) === null || _j === void 0 ? void 0 : _j.closest('li')) === null || _k === void 0 ? void 0 : _k.classList.add('is-active');
                    (_l = modalElement
                        .querySelector('#tab--recentCalls')) === null || _l === void 0 ? void 0 : _l.classList.remove('is-hidden');
                }
                cityssm.postJSON(MonTY.urlPrefix + '/attendance/doGetCallOutRecords', {
                    listId: callOutList.listId,
                    employeeNumber
                }, (rawResponseJSON) => {
                    callOutRecords = rawResponseJSON.callOutRecords;
                    renderCallOutRecords();
                });
            },
            onshown(modalElement, closeModalFunction) {
                bulmaJS.toggleHtmlClipped();
                bulmaJS.init(modalElement);
                if (canUpdate) {
                    ;
                    modalElement.querySelector('#callOutRecordAdd--listId').value = callOutList.listId;
                    modalElement.querySelector('#callOutRecordAdd--employeeNumber').value = callOutListMember.employeeNumber;
                    const responseTypeElement = modalElement.querySelector('#callOutRecordAdd--responseTypeId');
                    for (const responseType of callOutResponseTypes) {
                        const optionElement = document.createElement('option');
                        optionElement.value = responseType.responseTypeId.toString();
                        optionElement.textContent = responseType.responseType;
                        responseTypeElement.append(optionElement);
                    }
                    ;
                    modalElement.querySelector('#form--callOutRecordAdd').addEventListener('submit', addCallOutRecord);
                }
                const nextButtonElement = modalElement.querySelector('#callOutListMember--next');
                if (callOutListMemberIndex + 1 === currentCallOutListMembers.length) {
                    nextButtonElement.disabled = true;
                }
                else {
                    nextButtonElement.addEventListener('click', () => {
                        const nextEmployeeNumber = currentCallOutListMembers[callOutListMemberIndex + 1]
                            .employeeNumber;
                        closeModalFunction();
                        openCallOutListMember(nextEmployeeNumber);
                    });
                }
                const previousButtonElement = modalElement.querySelector('#callOutListMember--previous');
                if (callOutListMemberIndex === 0) {
                    previousButtonElement.disabled = true;
                }
                else {
                    previousButtonElement.addEventListener('click', () => {
                        const previousEmployeeNumber = currentCallOutListMembers[callOutListMemberIndex - 1]
                            .employeeNumber;
                        closeModalFunction();
                        openCallOutListMember(previousEmployeeNumber);
                    });
                }
            },
            onhidden() {
                bulmaJS.toggleHtmlClipped();
            }
        });
    }
    function openCallOutListMemberByClick(clickEvent) {
        clickEvent.preventDefault();
        const anchorElement = clickEvent.currentTarget;
        const employeeNumber = anchorElement.dataset.employeeNumber;
        openCallOutListMember(employeeNumber);
    }
    function openCallOutList(listId, onUpdateCallbackFunction) {
        currentListId = listId;
        currentCallOutListMembers = [];
        let callOutListCloseModalFunction;
        const callOutList = getCallOutListById(listId);
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
            const submitButtonElement = formEvent.currentTarget.querySelector('button[type="submit"]');
            submitButtonElement.disabled = true;
            submitButtonElement.classList.add('is-loading');
            cityssm.postJSON(MonTY.urlPrefix + '/attendance/doUpdateCallOutList', formEvent.currentTarget, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                submitButtonElement.disabled = false;
                submitButtonElement.classList.remove('is-loading');
                if (responseJSON.success) {
                    bulmaJS.alert({
                        message: 'Call out list updated successfully.',
                        contextualColorName: 'success'
                    });
                    callOutListModalElement.querySelector('.modal-card-title').textContent = callOutListModalElement.querySelector('#callOutListEdit--listName').value;
                    currentCallOutListMembers = responseJSON.callOutListMembers;
                    availableEmployees = responseJSON.availableEmployees;
                    renderCallOutListMembers();
                    renderAvailableEmployees();
                    callOutLists = responseJSON.callOutLists;
                    MonTY.callOuts.callOutLists = responseJSON.callOutLists;
                    if (onUpdateCallbackFunction !== undefined) {
                        onUpdateCallbackFunction();
                    }
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
        function initializeListDetailsTab() {
            var _a, _b, _c, _d, _e, _f, _g;
            ;
            callOutListModalElement.querySelector('#callOutListEdit--listId').value = callOutList.listId;
            callOutListModalElement.querySelector('#callOutListEdit--listName').value = callOutList.listName;
            callOutListModalElement.querySelector('#callOutListEdit--listDescription').value = (_a = callOutList.listDescription) !== null && _a !== void 0 ? _a : '';
            callOutListModalElement.querySelector('#callOutListEdit--allowSelfSignUp').value = ((_b = callOutList.allowSelfSignUp) !== null && _b !== void 0 ? _b : false) ? '1' : '0';
            callOutListModalElement.querySelector('#callOutListEdit--selfSignUpKey').value = (_c = callOutList.selfSignUpKey) !== null && _c !== void 0 ? _c : '';
            // Eligibility Function
            let eligibilityFunctionFound = false;
            const eligibilityFunctionElement = callOutListModalElement.querySelector('#callOutListEdit--eligibilityFunction');
            for (const eligibilityFunctionName of employeeEligibilityFunctions) {
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
            const sortKeyFunctionElement = callOutListModalElement.querySelector('#callOutListEdit--sortKeyFunction');
            for (const sortKeyFunctionName of employeeSortKeyFunctionNames) {
                const optionElement = document.createElement('option');
                optionElement.value = sortKeyFunctionName;
                optionElement.textContent = sortKeyFunctionName;
                if (sortKeyFunctionName === callOutList.sortKeyFunction) {
                    optionElement.selected = true;
                    sortKeyFunctionFound = true;
                }
                sortKeyFunctionElement.append(optionElement);
            }
            if (!sortKeyFunctionFound && ((_e = callOutList.sortKeyFunction) !== null && _e !== void 0 ? _e : '') !== '') {
                const optionElement = document.createElement('option');
                optionElement.value = callOutList.sortKeyFunction;
                optionElement.textContent = callOutList.sortKeyFunction;
                optionElement.selected = true;
                sortKeyFunctionElement.append(optionElement);
            }
            ;
            callOutListModalElement.querySelector('#callOutListEdit--employeePropertyName').value = (_f = callOutList.employeePropertyName) !== null && _f !== void 0 ? _f : '';
            if (canManage) {
                const unlockButtonsContainerElement = callOutListModalElement.querySelector('#callOutListEdit--unlockButtons');
                unlockButtonsContainerElement.classList.remove('is-hidden');
                (_g = unlockButtonsContainerElement
                    .querySelector('button')) === null || _g === void 0 ? void 0 : _g.addEventListener('click', () => {
                    var _a;
                    unlockButtonsContainerElement.remove();
                    (_a = callOutListModalElement
                        .querySelector('#callOutListEdit--updateButtons')) === null || _a === void 0 ? void 0 : _a.classList.remove('is-hidden');
                    const formElement = callOutListModalElement.querySelector('#form--callOutListEdit');
                    formElement.addEventListener('submit', doUpdateCallOutList);
                    formElement.querySelector('fieldset').disabled = false;
                });
            }
        }
        let callOutListMemberEmployeeNumbers = [];
        let availableEmployees = [];
        function addCallOutListMember(clickEvent) {
            clickEvent.preventDefault();
            const employeeNumber = clickEvent.currentTarget
                .dataset.employeeNumber;
            cityssm.postJSON(MonTY.urlPrefix + '/attendance/doAddCallOutListMember', {
                listId: callOutList.listId,
                employeeNumber
            }, (rawResponseJSON) => {
                const responseJSON = rawResponseJSON;
                if (responseJSON.success) {
                    currentCallOutListMembers = responseJSON.callOutListMembers;
                    renderCallOutListMembers();
                    renderAvailableEmployees();
                    callOutList.callOutListMembersCount =
                        currentCallOutListMembers.length;
                    if (onUpdateCallbackFunction !== undefined) {
                        onUpdateCallbackFunction();
                    }
                }
                else {
                    bulmaJS.alert({
                        title: 'Error Adding Member',
                        message: 'Please try again.',
                        contextualColorName: 'danger'
                    });
                }
            });
        }
        function deleteCallOutListMember(clickEvent) {
            clickEvent.preventDefault();
            const employeeNumber = clickEvent.currentTarget
                .dataset.employeeNumber;
            function doDelete() {
                cityssm.postJSON(MonTY.urlPrefix + '/attendance/doDeleteCallOutListMember', {
                    listId: callOutList.listId,
                    employeeNumber
                }, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        currentCallOutListMembers = responseJSON.callOutListMembers;
                        renderCallOutListMembers();
                        renderAvailableEmployees();
                        callOutList.callOutListMembersCount =
                            currentCallOutListMembers.length;
                        if (onUpdateCallbackFunction !== undefined) {
                            onUpdateCallbackFunction();
                        }
                    }
                    else {
                        bulmaJS.alert({
                            title: 'Error Removing Member',
                            message: 'Please try again.',
                            contextualColorName: 'danger'
                        });
                    }
                });
            }
            bulmaJS.confirm({
                title: 'Remove Employee from Call Out List',
                message: `Are you sure you want to remove employee ${employeeNumber} from the list?`,
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Remove Them',
                    callbackFunction: doDelete
                }
            });
        }
        function renderAvailableEmployees() {
            var _a;
            if (!canManage) {
                return;
            }
            const availableEmployeesContainer = callOutListModalElement.querySelector('#container--callOutListAvailableEmployees');
            const panelElement = document.createElement('div');
            panelElement.className = 'panel';
            for (const employee of availableEmployees) {
                // employee already in the list
                if (callOutListMemberEmployeeNumbers.includes(employee.employeeNumber)) {
                    continue;
                }
                const searchStringPieces = callOutListModalElement.querySelector('#filter--callOutListAvailableEmployees').value
                    .trim()
                    .toLowerCase()
                    .split(' ');
                const employeeString = (employee.employeeGivenName +
                    ' ' +
                    employee.employeeSurname).toLowerCase();
                let showEmployee = true;
                for (const searchStringPiece of searchStringPieces) {
                    if (!employeeString.includes(searchStringPiece)) {
                        showEmployee = false;
                        break;
                    }
                }
                if (!showEmployee) {
                    continue;
                }
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block';
                panelBlockElement.href = '#';
                panelBlockElement.dataset.employeeNumber = employee.employeeNumber;
                panelBlockElement.innerHTML = `<span class="panel-icon">
          <i class="fas fa-plus" aria-hidden="true"></i>
          </span>
          <div>
            <strong>${employee.employeeSurname}, ${employee.employeeGivenName}</strong><br />
            <span class="is-size-7">${(_a = employee.jobTitle) !== null && _a !== void 0 ? _a : ''}</span>
          </div>`;
                panelBlockElement.addEventListener('click', addCallOutListMember);
                panelElement.append(panelBlockElement);
            }
            if (panelElement.hasChildNodes()) {
                availableEmployeesContainer.innerHTML = '';
                availableEmployeesContainer.append(panelElement);
            }
            else {
                availableEmployeesContainer.innerHTML = `<div class="message is-info is-small">
            <p class="message-body">There are no employees available to add.</p>
          </div>`;
            }
        }
        function renderCallOutListMembers() {
            var _a;
            const callOutListMembersContainer = callOutListModalElement.querySelector('#container--callOutListMembers');
            const callOutListCurrentMembersContainer = callOutListModalElement.querySelector('#container--callOutListCurrentMembers');
            callOutListMemberEmployeeNumbers = [];
            if (currentCallOutListMembers.length === 0) {
                callOutListMembersContainer.innerHTML = `<div class="message is-warning">
            <p class="message-body">The "${callOutList.listName}" call out list does not include any active employees.</p>
          </div>`;
                callOutListCurrentMembersContainer.innerHTML = `<div class="message is-warning is-small">
            <p class="message-body">No active employees.</p>
          </div>`;
                return;
            }
            const panelElement = document.createElement('div');
            panelElement.className = 'panel';
            let currentPanelElement;
            if (canManage) {
                currentPanelElement = document.createElement('div');
                currentPanelElement.className = 'panel';
            }
            for (const member of currentCallOutListMembers) {
                // Member List
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.href = '#';
                panelBlockElement.dataset.employeeNumber = member.employeeNumber;
                panelBlockElement.innerHTML = `<div class="columns is-mobile">
          <div class="column is-narrow">
            <i class="fas fa-hard-hat" aria-hidden="true"></i>
          </div>
          <div class="column">
            <strong>${member.employeeSurname}, ${member.employeeGivenName}</strong><br />
            <span class="is-size-7">${member.employeeNumber}</span>
          </div>
          <div class="column">
            <span class="is-size-7 has-tooltip-left" data-tooltip="Sort Key">
              <i class="fas fa-sort-alpha-down" aria-hidden="true"></i> ${(_a = member.sortKey) !== null && _a !== void 0 ? _a : ''}
            </span><br />
            <span class="is-size-7 has-tooltip-left" data-tooltip="Last Call Out Time">
              <i class="fas fa-phone-volume" aria-hidden="true"></i> ${member.callOutDateTimeMax === null
                    ? '(No Recent Call Out)'
                    : new Date(member.callOutDateTimeMax).toLocaleDateString()}
            </span>
          </div>
          </div>`;
                panelBlockElement.addEventListener('click', openCallOutListMemberByClick);
                panelElement.append(panelBlockElement);
                // Current Members (Management)
                if (!canManage) {
                    continue;
                }
                // Track employee number
                callOutListMemberEmployeeNumbers.push(member.employeeNumber);
                const currentPanelBlockElement = document.createElement('a');
                currentPanelBlockElement.className = 'panel-block';
                currentPanelBlockElement.href = '#';
                currentPanelBlockElement.dataset.employeeNumber = member.employeeNumber;
                currentPanelBlockElement.innerHTML = `<span class="panel-icon">
          <i class="fas fa-minus" aria-hidden="true"></i>
          </span>
          <div>
            <strong>${member.employeeSurname}, ${member.employeeGivenName}</strong>
          </div>`;
                currentPanelBlockElement.addEventListener('click', deleteCallOutListMember);
                currentPanelElement.append(currentPanelBlockElement);
            }
            callOutListMembersContainer.innerHTML = '';
            callOutListMembersContainer.append(panelElement);
            if (canManage) {
                callOutListCurrentMembersContainer.innerHTML = '';
                callOutListCurrentMembersContainer.append(currentPanelElement);
            }
        }
        function deleteCallOutList(clickEvent) {
            clickEvent.preventDefault();
            function doDelete() {
                cityssm.postJSON(MonTY.urlPrefix + '/attendance/doDeleteCallOutList', {
                    listId
                }, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        cityssm.disableNavBlocker();
                        callOutListCloseModalFunction();
                        bulmaJS.alert({
                            message: 'Call Out List deleted successfully.'
                        });
                        callOutLists = responseJSON.callOutLists;
                        MonTY.callOuts.callOutLists = responseJSON.callOutLists;
                        if (onUpdateCallbackFunction !== undefined) {
                            onUpdateCallbackFunction();
                        }
                    }
                });
            }
            bulmaJS.confirm({
                title: 'Delete Call Out List',
                message: 'Are you sure you want to delete this call out list?',
                contextualColorName: 'warning',
                okButton: {
                    text: 'Yes, Delete Call Out List',
                    callbackFunction: doDelete
                }
            });
        }
        cityssm.openHtmlModal('callOuts-list', {
            onshow(modalElement) {
                var _a, _b, _c;
                callOutListModalElement = modalElement;
                modalElement.querySelector('.modal-card-title').textContent = callOutList.listName;
                if (canManage) {
                    (_a = modalElement
                        .querySelector(".tabs a[href$='tab--callOutMembers-manage']")) === null || _a === void 0 ? void 0 : _a.classList.remove('is-hidden');
                    const deleteCallOutListElement = modalElement.querySelector('.is-delete-call-out-list');
                    (_b = deleteCallOutListElement
                        .closest('.dropdown')) === null || _b === void 0 ? void 0 : _b.classList.remove('is-hidden');
                    deleteCallOutListElement.addEventListener('click', deleteCallOutList);
                }
                else {
                    (_c = modalElement.querySelector('#tab--callOuts-members > .tabs')) === null || _c === void 0 ? void 0 : _c.remove();
                }
                // List Details
                initializeListDetailsTab();
                // Members
                cityssm.postJSON(MonTY.urlPrefix + '/attendance/doGetCallOutListMembers', {
                    listId: callOutList.listId,
                    includeAvailableEmployees: canManage
                }, (rawResponseJSON) => {
                    var _a;
                    const responseJSON = rawResponseJSON;
                    currentCallOutListMembers = responseJSON.callOutListMembers;
                    availableEmployees = responseJSON.availableEmployees;
                    renderCallOutListMembers();
                    renderAvailableEmployees();
                    (_a = callOutListModalElement
                        .querySelector('#filter--callOutListAvailableEmployees')) === null || _a === void 0 ? void 0 : _a.addEventListener('keyup', renderAvailableEmployees);
                });
            },
            onshown(modalElement, closeModalFunction) {
                callOutListCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                bulmaJS.init(modalElement);
                MonTY.initializeMenuTabs(modalElement.querySelectorAll('.menu a'), modalElement.querySelectorAll('.tabs-container > article'));
                modalElement.querySelector('#reportingLink--callOutListReport').href = MonTY.urlPrefix + '/print/screen/callOutList/?listId=' + listId;
                modalElement.querySelector('#reportingLink--callOutListMembersCSV').href =
                    MonTY.urlPrefix +
                        '/reports/callOutListMembers-formatted-byListId/?listId=' +
                        listId;
                modalElement.querySelector('#reportingLink--callOutRecordsCSV').href =
                    MonTY.urlPrefix +
                        '/reports/callOutRecords-recent-byListId/?listId=' +
                        listId;
                cityssm.enableNavBlocker();
            },
            onhidden() {
                bulmaJS.toggleHtmlClipped();
                cityssm.disableNavBlocker();
                currentListId = '';
                currentCallOutListMembers = [];
            }
        });
    }
    const MonTYCallOuts = {
        callOutLists,
        openCallOutList
    };
    // eslint-disable-next-line unicorn/prefer-module
    exports.MonTY.callOuts = MonTYCallOuts;
})();
