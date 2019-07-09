'use strict';

import utils from './utils';

let tabs = {},
    windows = {};

// TABS
function setTab(tab, newSession) {
    if (!tab.id) {
        throw Error('tab hasn\'t id');
    }

    if (utils.isTabIncognito(tab)) {
        throw Error('tab is incognito');
    }

    if (tab.pinned || newSession) {
        tab.session = {};
    }

    tabs[tab.id] = tab;
}

function updateTab(tabId, data) {
    return Object.assign(tabs[tabId], data);
}

function getTab(tabId) {
    return tabs[tabId];
}

function removeTab(tabId) {
    delete tabs[tabId];
}

function setTabGroup(tabId, groupId) {
    if (groupId) {
        tabs[tabId].session.groupId = groupId
        return browser.sessions.setTabValue(tabId, 'groupId', groupId);
    }

    return removeTabGroup(tabId);
}

function removeTabGroup(tabId) {
    tabs[tabId].session.groupId = null;
    return browser.sessions.removeTabValue(tabId, 'groupId');
}

function getTabs(groupId = null) {
    return Object.values(tabs)
        .filter(function(tab) {
            if (tab.pinned) {
                return false;
            }

            if (groupId) {
                return tab.session.groupId === groupId;
            }

            return true;
        });
}

function getPinnedTabs(windowId) {
    return Object.values(tabs).filter(tab => tab.pinned && tab.windowId === windowId);
}

// function getTabSession(tabId) {
//     return tabs[tabId].session;
//     // return (tabs[tabId] && tabs[tabId].session) || {};
// }

async function loadTabSession(tab) {
    if (tabs[tab.id] && tabs[tab.id].session) {
        tab.session = tabs[tab.id].session;
    } else {
        let groupId = await browser.sessions.getTabValue(tab.id, 'groupId');

        tab.session = {
            groupId: groupId || null,
        };
    }

    return tabs[tab.id] = tab;
}

// WINDOWS
function setWindow(win, newSession) {
    if (newSession) {
        win.session = {};
    }

    windows[win.id] = win;
}

function getWindow(windowId) {
    return windows[windowId];
}

function removeWindow(windowId) {
    delete windows[windowId];
}

function getWindowsCount() {
    return Object.keys(windows).length;
}

// setInterval(() => console.debug(Object.values(tabs).slice(-7)), 5000);

function setWindowGroup(windowId, groupId) {
    if (groupId) {
        windows[windowId].session.groupId = groupId;
        return browser.sessions.setWindowValue(windowId, 'groupId', groupId);
    }

    return removeWindowGroup(windowId);
}

function removeWindowGroup(windowId) {
    windows[windowId].session.windowId = null;
    return browser.sessions.removeWindowValue(windowId, 'groupId');
}

function getWindowId(groupId) {
    if (!groupId) {
        return false;
    }

    for (let windowId in windows) {
        if (windows[windowId].session.groupId === groupId) {
            return Number(windowId);
        }
    }
}

function getWindowSession(windowId) {
    return (windows[windowId] && windows[windowId].session) || {};
}

async function loadWindowSession(win) {
    if (windows[win.id] && windows[win.id].session) {
        win.session = windows[win.id].session;
    } else {
        let groupId = await browser.sessions.getWindowValue(win.id, 'groupId');

        win.session = {
            groupId: groupId || null,
        };
    }

    return windows[win.id] = win;
}


export default {
    // tabs
    setTab,
    updateTab,
    getTab,
    removeTab,

    getTabs,
    getPinnedTabs,

    setTabGroup,
    removeTabGroup,

    // getTabSession,
    loadTabSession,

    // windows
    setWindow,
    getWindow,
    removeWindow,

    setWindowGroup,
    removeWindowGroup,

    getWindowId,

    getWindowSession,
    loadWindowSession,
};