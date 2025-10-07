"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
(() => {
    const Attend = exports.Attend;
    let currentListId = '';
    let currentCallOutListMembers = [];
    let absenceRecords = [];
    /*
     * Data
     */
    let callOutLists = exports.callOutLists;
    function getCurrentCallOutList() {
        return Attend.callOuts?.callOutLists.find((possibleCallOutList) => {
            return possibleCallOutList.listId === currentListId;
        });
    }
    const callOutResponseTypes = (exports.callOutResponseTypes ??
        []);
    const employeeEligibilityFunctions = (exports.employeeEligibilityFunctionNames ?? []);
    const employeeSortKeyFunctionNames = (exports.employeeSortKeyFunctionNames ??
        []);
    /*
     * Permissions
     */
    const isAdmin = document.querySelector('main')?.dataset.isAdmin === 'true';
    const userName = document.querySelector('main')?.dataset.userName ?? '';
    const canUpdate = callOutResponseTypes.length === 0
        ? false
        : exports.userPermissions.callOutsCanUpdate;
    const canManage = employeeEligibilityFunctions.length === 0
        ? false
        : exports.userPermissions.callOutsCanManage;
    function openCallOutListMember(employeeNumber) {
        const callOutList = getCurrentCallOutList();
        let callOutListMemberIndex = 0;
        const callOutListMember = currentCallOutListMembers.find((possibleMember, possibleIndex) => {
            if (possibleMember.employeeNumber === employeeNumber) {
                callOutListMemberIndex = possibleIndex;
                return true;
            }
            return false;
        });
        const absenceRecord = absenceRecords.find((possibleRecord) => {
            return employeeNumber === possibleRecord.employeeNumber;
        });
        let callOutMemberModalElement;
        let callOutRecords;
        function addCallOutRecord(formEvent) {
            formEvent.preventDefault();
            const formElement = formEvent.currentTarget;
            cityssm.postJSON(`${Attend.urlPrefix}/attendance/doAddCallOutRecord`, formElement, (rawResponseJSON) => {
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
                cityssm.postJSON(`${Attend.urlPrefix}/attendance/doDeleteCallOutRecord`, {
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
        function openUpdateCallOutRecordModal(clickEvent) {
            clickEvent.preventDefault();
            let updateCallOutRecordCloseModalFunction;
            const recordId = clickEvent.currentTarget.closest('.panel-block').dataset.recordId;
            function doUpdateCallOutRecord(formEvent) {
                formEvent.preventDefault();
                cityssm.postJSON(`${Attend.urlPrefix}/attendance/doUpdateCallOutRecord`, formEvent.currentTarget, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    if (responseJSON.success) {
                        updateCallOutRecordCloseModalFunction();
                        bulmaJS.alert({
                            message: 'Call out record updated successfully.',
                            contextualColorName: 'success'
                        });
                        callOutRecords = responseJSON.callOutRecords;
                        renderCallOutRecords();
                    }
                });
            }
            const callOutRecord = callOutRecords.find((possibleCallOutRecord) => {
                return possibleCallOutRecord.recordId === recordId;
            });
            if (callOutRecord === undefined) {
                bulmaJS.alert({
                    title: 'Call Out Record Unavailable',
                    message: 'Please refresh and try again.',
                    contextualColorName: 'danger'
                });
                return;
            }
            const callOutDateTime = new Date(callOutRecord.callOutDateTime);
            cityssm.openHtmlModal('callOutRecord-edit', {
                onshow(modalElement) {
                    ;
                    modalElement.querySelector('#callOutRecordEdit--recordId').value = callOutRecord.recordId;
                    modalElement.querySelector('#callOutRecordEdit--listId').value = callOutRecord.listId;
                    modalElement.querySelector('#callOutRecordEdit--employeeNumber').value = callOutRecord.employeeNumber;
                    modalElement.querySelector('#callOutRecordEdit--callOutDateString').value = cityssm.dateToString(callOutDateTime);
                    modalElement.querySelector('#callOutRecordEdit--callOutTimeString').value = cityssm.dateToTimeString(callOutDateTime);
                    modalElement.querySelector('#callOutRecordEdit--natureOfCallOut').value = callOutRecord.natureOfCallOut;
                    modalElement.querySelector('#callOutRecordEdit--callOutHours').value = callOutRecord.callOutHours.toString();
                    const responseTypeElement = modalElement.querySelector('#callOutRecordEdit--responseTypeId');
                    let responseTypeFound = false;
                    for (const responseType of callOutResponseTypes) {
                        const optionElement = document.createElement('option');
                        optionElement.value = responseType.responseTypeId.toString();
                        optionElement.textContent = responseType.responseType;
                        if (callOutRecord.responseTypeId === responseType.responseTypeId) {
                            responseTypeFound = true;
                        }
                        responseTypeElement.append(optionElement);
                    }
                    if (!responseTypeFound) {
                        const optionElement = document.createElement('option');
                        optionElement.value = callOutRecord.responseTypeId.toString();
                        optionElement.textContent =
                            callOutRecord.responseType ??
                                `responseTypeId:${callOutRecord.responseTypeId.toString()}`;
                        responseTypeElement.append(optionElement);
                    }
                    responseTypeElement.value = callOutRecord.responseTypeId.toString();
                    modalElement.querySelector('#callOutRecordEdit--recordComment').value = callOutRecord.recordComment;
                },
                onshown(modalElement, closeModalFunction) {
                    updateCallOutRecordCloseModalFunction = closeModalFunction;
                    modalElement
                        .querySelector('form')
                        ?.addEventListener('submit', doUpdateCallOutRecord);
                }
            });
        }
        function renderCallOutRecords() {
            // Tag Count
            ;
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
              <strong>${record.responseType ?? '(No Response)'}</strong><br />
              <span class="has-tooltip-right" data-tooltip="Call Out List">
                <i class="fas fa-fw fa-list" aria-hidden="true"></i>
                ${cityssm.escapeHTML(record.listName ?? '')}
              </span><br />
              <span class="has-tooltip-right" data-tooltip="Nature of Call Out">
                <i class="fas fa-fw fa-info-circle" aria-hidden="true"></i>
                ${cityssm.escapeHTML(record.natureOfCallOut ?? '')}
              </span><br />
              <span class="has-tooltip-right" data-tooltip="Comment">
                <i class="fas fa-fw fa-comment" aria-hidden="true"></i>
                ${cityssm.escapeHTML(record.recordComment ?? '')}
              </span>
            </span>
          </div>
          <div class="column is-narrow">
            ${canUpdate &&
                    (isAdmin || record.recordCreate_userName === userName)
                    ? `<div class="field has-addons">
                  <div class="control">
                    <button class="button is-update-button" data-tooltip="Edit Record">
                      <i class="fas fa-pencil-alt" aria-hidden="true"></i>
                    </button>
                  </div>
                  <div class="control">
                    <button class="button is-delete-button" data-tooltip="Delete Record">
                      <i class="fas fa-trash has-text-danger" aria-hidden="true"></i>
                    </button>
                  </div>
                  </div>`
                    : ''}
          </div>
          </div>`;
                panelBlockElement
                    .querySelector('.is-update-button')
                    ?.addEventListener('click', openUpdateCallOutRecordModal);
                panelBlockElement
                    .querySelector('.is-delete-button')
                    ?.addEventListener('click', deleteCallOutRecord);
                panelElement.append(panelBlockElement);
            }
            callOutRecordsContainerElement.innerHTML = '';
            callOutRecordsContainerElement.append(panelElement);
        }
        cityssm.openHtmlModal('callOuts-member', {
            onshow(modalElement) {
                callOutMemberModalElement = modalElement;
                const employeeName = `${callOutListMember.employeeSurname}, ${callOutListMember.employeeGivenName}`;
                modalElement.querySelector('.modal-card-title').textContent = employeeName;
                modalElement.querySelector('#callOutListMember--listName').textContent = callOutList.listName;
                modalElement.querySelector('#callOutListMember--employeeName').textContent = employeeName;
                modalElement.querySelector('#callOutListMember--employeeNumber').textContent = callOutListMember.employeeNumber;
                modalElement.querySelector('#callOutListMember--sortKey').textContent = callOutListMember.sortKey ?? '';
                modalElement.querySelector('#callOutListMember--listPosition').textContent = `${callOutListMemberIndex + 1} / ${currentCallOutListMembers.length}`;
                if (absenceRecord !== undefined) {
                    modalElement
                        .querySelector('#callOutListMember--absenceRecord')
                        ?.insertAdjacentHTML('afterbegin', `<div class="box mb-3 has-background-warning-light">
              <div class="columns is-mobile">
                <div class="column is-narrow" data-tooltip="Absence Record">
                  <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                </div>
                <div class="column">
                  ${new Date(absenceRecord.absenceDateTime).toLocaleDateString()}<br />
                  ${absenceRecord.absenceType}
                </div>
              </div>
              </div>`);
                }
                if (canUpdate) {
                    ;
                    modalElement.querySelector('#callOutListMember--workContact1').textContent = callOutListMember.workContact1 ?? '';
                    modalElement.querySelector('#callOutListMember--workContact2').textContent = callOutListMember.workContact2 ?? '';
                    modalElement.querySelector('#callOutListMember--homeContact1').textContent = callOutListMember.homeContact1 ?? '';
                    modalElement.querySelector('#callOutListMember--homeContact2').textContent = callOutListMember.homeContact2 ?? '';
                }
                else {
                    modalElement
                        .querySelector('a[href$="tab--callNow"]')
                        ?.closest('li')
                        ?.remove();
                    modalElement.querySelector('#tab--callNow')?.remove();
                    modalElement
                        .querySelector('a[href$="tab--recentCalls"]')
                        ?.closest('li')
                        ?.classList.add('is-active');
                    modalElement
                        .querySelector('#tab--recentCalls')
                        ?.classList.remove('is-hidden');
                }
                cityssm.postJSON(`${Attend.urlPrefix}/attendance/doGetCallOutRecords`, {
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
        let callOutListMemberEmployeeNumbers = [];
        let availableEmployees = [];
        let callOutListCloseModalFunction;
        const callOutList = getCurrentCallOutList();
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
            cityssm.postJSON(`${Attend.urlPrefix}/attendance/doUpdateCallOutList`, formEvent.currentTarget, (rawResponseJSON) => {
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
                    Attend.callOuts.callOutLists =
                        responseJSON.callOutLists;
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
            ;
            callOutListModalElement.querySelector('#callOutListEdit--listId').value = callOutList.listId;
            callOutListModalElement.querySelector('#callOutListEdit--listName').value = callOutList.listName;
            callOutListModalElement.querySelector('#callOutListEdit--listDescription').value = callOutList.listDescription ?? '';
            callOutListModalElement.querySelector('#callOutListEdit--allowSelfSignUp').value = callOutList.allowSelfSignUp ?? false ? '1' : '0';
            callOutListModalElement.querySelector('#callOutListEdit--selfSignUpKey').value = callOutList.selfSignUpKey ?? '';
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
                (callOutList.eligibilityFunction ?? '') !== '') {
                const optionElement = document.createElement('option');
                optionElement.value = callOutList.eligibilityFunction ?? '';
                optionElement.textContent = callOutList.eligibilityFunction ?? '';
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
            if (!sortKeyFunctionFound && (callOutList.sortKeyFunction ?? '') !== '') {
                const optionElement = document.createElement('option');
                optionElement.value = callOutList.sortKeyFunction ?? '';
                optionElement.textContent = callOutList.sortKeyFunction ?? '';
                optionElement.selected = true;
                sortKeyFunctionElement.append(optionElement);
            }
            ;
            callOutListModalElement.querySelector('#callOutListEdit--employeePropertyName').value = callOutList.employeePropertyName ?? '';
            if (canManage) {
                const unlockButtonsContainerElement = callOutListModalElement.querySelector('#callOutListEdit--unlockButtons');
                unlockButtonsContainerElement.classList.remove('is-hidden');
                unlockButtonsContainerElement
                    .querySelector('button')
                    ?.addEventListener('click', () => {
                    unlockButtonsContainerElement.remove();
                    callOutListModalElement
                        .querySelector('#callOutListEdit--updateButtons')
                        ?.classList.remove('is-hidden');
                    const formElement = callOutListModalElement.querySelector('#form--callOutListEdit');
                    formElement.addEventListener('submit', doUpdateCallOutList);
                    formElement.querySelector('fieldset').disabled = false;
                });
            }
        }
        function addCallOutListMember(clickEvent) {
            clickEvent.preventDefault();
            const employeeNumber = clickEvent.currentTarget
                .dataset.employeeNumber;
            cityssm.postJSON(`${Attend.urlPrefix}/attendance/doAddCallOutListMember`, {
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
            const employeeNumber = clickEvent.currentTarget.dataset
                .employeeNumber ?? '';
            function doDelete() {
                cityssm.postJSON(`${Attend.urlPrefix}/attendance/doDeleteCallOutListMember`, {
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
            if (!canManage) {
                return;
            }
            const availableEmployeesContainer = callOutListModalElement.querySelector('#container--callOutListAvailableEmployees');
            const panelElement = document.createElement('div');
            panelElement.className = 'panel';
            // eslint-disable-next-line no-labels
            availableEmployeeLoop: for (const availableEmployee of availableEmployees) {
                // employee already in the list
                if (callOutListMemberEmployeeNumbers.includes(availableEmployee.employeeNumber)) {
                    continue;
                }
                const searchStringPieces = callOutListModalElement.querySelector('#filter--callOutListAvailableEmployees').value
                    .trim()
                    .toLowerCase()
                    .split(' ');
                const employeeString = `${availableEmployee.employeeGivenName} ${availableEmployee.employeeSurname}`.toLowerCase();
                for (const searchStringPiece of searchStringPieces) {
                    if (!employeeString.includes(searchStringPiece)) {
                        // eslint-disable-next-line no-labels
                        continue availableEmployeeLoop;
                    }
                }
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block';
                panelBlockElement.href = '#';
                panelBlockElement.dataset.employeeNumber =
                    availableEmployee.employeeNumber;
                panelBlockElement.innerHTML = `<span class="panel-icon">
          <i class="fas fa-plus" aria-hidden="true"></i>
          </span>
          <div>
            <strong>
            ${availableEmployee.employeeSurname},
            ${availableEmployee.employeeGivenName}
            </strong><br />
            <span class="is-size-7">${availableEmployee.jobTitle ?? ''}</span>
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
                const absenceRecord = absenceRecords.find((possibleRecord) => {
                    return member.employeeNumber === possibleRecord.employeeNumber;
                });
                // Member List
                const panelBlockElement = document.createElement('a');
                panelBlockElement.className = 'panel-block is-block';
                panelBlockElement.href = '#';
                panelBlockElement.dataset.employeeNumber = member.employeeNumber;
                panelBlockElement.innerHTML = `<div class="columns is-mobile is-variable is-1">
          <div class="column is-narrow">
          ${absenceRecord === undefined
                    ? '<i class="fas fa-fw fa-hard-hat" aria-hidden="true"></i>'
                    : '<i class="fas fa-fw fa-sign-out-alt has-text-warning-dark" aria-hidden="true"></i>'}
          </div>
          <div class="column">
            <strong>
              ${member.employeeSurname},
              ${member.employeeGivenName}
            </strong><br />
            <span class="is-size-7">${member.employeeNumber}</span>
          </div>
          <div class="column">
            <span class="is-size-7 has-tooltip-left" data-tooltip="Sort Key">
              <i class="fas fa-sort-alpha-down" aria-hidden="true"></i>
              ${member.sortKey ?? ''}
            </span><br />
            <span class="is-size-7 has-tooltip-left" data-tooltip="Last Call Out Time">
              <i class="fas fa-phone-volume" aria-hidden="true"></i>
              ${member.callOutDateTimeMax === null
                    ? '(No Recent Call Out)'
                    : new Date(member.callOutDateTimeMax).toLocaleDateString()}
            </span>
          </div>
          </div>`;
                panelBlockElement.addEventListener('click', openCallOutListMemberByClick);
                panelElement.append(panelBlockElement);
                // Current Members (Management)
                if (!canManage || currentPanelElement === undefined) {
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
            if (canManage && currentPanelElement !== undefined) {
                callOutListCurrentMembersContainer.innerHTML = '';
                callOutListCurrentMembersContainer.append(currentPanelElement);
            }
        }
        function deleteCallOutList(clickEvent) {
            clickEvent.preventDefault();
            function doDelete() {
                cityssm.postJSON(`${Attend.urlPrefix}/attendance/doDeleteCallOutList`, {
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
                        Attend.callOuts.callOutLists =
                            responseJSON.callOutLists;
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
                callOutListModalElement = modalElement;
                modalElement.querySelector('.modal-card-title').textContent = callOutList.listName;
                if (canManage) {
                    modalElement
                        .querySelector(".tabs a[href$='tab--callOutMembers-manage']")
                        ?.classList.remove('is-hidden');
                    const deleteCallOutListElement = modalElement.querySelector('.is-delete-call-out-list');
                    deleteCallOutListElement
                        .closest('.dropdown')
                        ?.classList.remove('is-hidden');
                    deleteCallOutListElement.addEventListener('click', deleteCallOutList);
                }
                else {
                    modalElement.querySelector('#tab--callOuts-members > .tabs')?.remove();
                }
                // List Details
                initializeListDetailsTab();
                // Members
                cityssm.postJSON(`${Attend.urlPrefix}/attendance/doGetCallOutListMembers`, {
                    listId: callOutList.listId,
                    includeAvailableEmployees: canManage
                }, (rawResponseJSON) => {
                    const responseJSON = rawResponseJSON;
                    currentCallOutListMembers = responseJSON.callOutListMembers;
                    availableEmployees = responseJSON.availableEmployees;
                    absenceRecords = responseJSON.absenceRecords;
                    renderCallOutListMembers();
                    renderAvailableEmployees();
                    callOutListModalElement
                        .querySelector('#filter--callOutListAvailableEmployees')
                        ?.addEventListener('keyup', renderAvailableEmployees);
                });
            },
            onshown(modalElement, closeModalFunction) {
                callOutListCloseModalFunction = closeModalFunction;
                bulmaJS.toggleHtmlClipped();
                bulmaJS.init(modalElement);
                Attend.initializeMenuTabs(modalElement.querySelectorAll('.menu a'), modalElement.querySelectorAll('.tabs-container > article'));
                const callOutListReportLink = `${Attend.urlPrefix}/print/screen/callOutList/?listIds=${listId}`;
                modalElement.querySelector('#reportingLink--callOutListReport').href = callOutListReportLink;
                modalElement.querySelector('#reportingLink--callOutListReport2').href = callOutListReportLink;
                modalElement.querySelector('#reportingLink--callOutListMembersCSV').href = `${Attend.urlPrefix}/reports/callOutListMembers-formatted-byListId/?listId=${listId}`;
                modalElement.querySelector('#reportingLink--callOutRecordsCSV').href = `${Attend.urlPrefix}/reports/callOutRecords-recent-byListId/?listId=${listId}`;
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
    const AttendCallOuts = {
        callOutLists,
        openCallOutList
    };
    exports.Attend.callOuts = AttendCallOuts;
})();
