import * as Constants from './constants.js';
import * as Utils from './utils.js';

browser.action.onClicked.addListener(async () => {
    try {
        const responce = await Utils.sendExternalMessage('create-temp-tab', {
            active: true,
        });

        if (!responce.ok) {
            Utils.notify('error', responce.error);
        }
    } catch (e) {
        Utils.notify('needInstallSTGExtension', browser.i18n.getMessage('needInstallSTGExtension'), {
            timerSec: 10,
            onClick: {
                action: 'open-tab',
                url: Constants.STG_HOME_PAGE,
            },
        });
    }
});

async function updateActionTitle() {
    const [{shortcut}] = await browser.commands.getAll();

    const titleParts = [browser.i18n.getMessage('newTempTabTitle')];

    if (shortcut) {
        titleParts.push(`(${shortcut})`);
    }

    await browser.action.setTitle({
        title: titleParts.join(' '),
    });
}

async function setup() {
    updateActionTitle();
}

browser.runtime.onStartup.addListener(setup);
browser.runtime.onInstalled.addListener(setup);
