// ==UserScript==
// @name         GitHub JIRA Issue Links
// @version      0.2
// @description  Provide links back to JIRA issues from GitHub.
// @author       dimitropoulos, jchv
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

/*md

# JIRA Linker!

This is a GitHub extension that will automatically link back to your private JIRA instance!

## How To Use

1. install [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
1. create a new script via the extension once it's installed
1. copy/paste [this code](https://raw.githubusercontent.com/dimitropoulos/jira-linker/master/index.js) to your new script
1. save the script
1. refresh github
1. follow the form in the lower left hand part of the screen

## Pro Tips

If you ever want to edit this form you can click "JIRA Linker Settings" in your profile dropdown menu (at the extreme top right, in github) between "Settings" and "Sign Out".  Also, you can clear localStorage, which will prompt the initial config form to appear again.

## Credit

Thanks to [jchv](https://github.com/jchv/userscripts/blob/master/github/jira-link.user.js) for starting this script.  It's quite the time saver!

*/

(() => {
  //// Configuration
  //////////////////////////////////////////////////////////////////////////////
  const jiraRootPlaceholder = 'https://xxx.atlassian.net';
  const jiraRootId = 'jira-root-url';

  const jiraProjectsPlaceholder = 'PROJ1 PROJ2 PROJ3';
  const jiraProjectsId = 'jira-projects';

  const linkedMarker = 'jira-issue-link';
  const localStorageKey = 'jira-link-settings';

  //// Source Code
  //////////////////////////////////////////////////////////////////////////////
  const hElem = (tag, defaultAttributes) => (attributes, children) => {
    const element = document.createElement(tag);
    const mergedAttributes = Object.assign({}, defaultAttributes || {}, attributes || {});
    Object.entries(mergedAttributes).forEach(([qualifiedName, value]) => {
      element.setAttribute(qualifiedName, value);
    });
    (children || []).forEach(child => {
      element.appendChild(child);
    });
    return element;
  }

  const Text = node => document.createTextNode(node);
  const Form = hElem('form', { style: 'display: block; position: fixed; bottom: 10px; left: 20px; z-index: 1; padding: 10px;' });
  const Div = hElem('div', { style: 'display: flex; flex-direction: column;' });
  const Button = hElem('button', { class: 'btn btn-sm btn-primary', type: 'submit' });
  const Input = hElem('input', { class: 'form-control input-sm', type: 'text' });
  const Anchor = hElem('a');
  const ListItem = hElem('li');
  const H4 = hElem('h4');

  const InputItem = ({ id, label, placeholder }) => (
    hElem('dl')({ class: 'form-group' }, [
      hElem('dt')({}, [
        hElem('label')({}, [
          Text(label),
        ]),
      ]),
      hElem('dd')({}, [
        Input({
          id,
          placeholder,
        }),
      ]),
    ])
  );

  const settingsModal = Form({ class: 'SelectMenu-modal' }, [
    H4({}, [
      Text('Set JIRA configuration'),
    ]),
    Div({ style: 'margin: 16px 0px;'}, [
      InputItem({
        id: jiraRootId,
        label: 'JIRA Instance URL',
        placeholder: jiraRootPlaceholder,
      }),
      InputItem({
        id: jiraProjectsId,
        label: 'JIRA Project IDs (space delimited)',
        placeholder: jiraProjectsPlaceholder,
      }),
    ]),
    Div({ class: 'form-actions' }, [
      Button({}, [
        Text('Save'),
      ]),
    ]),
  ]);

  const changeSettingsLink = ListItem({ class: 'header-nav-item' }, [
    Anchor({ role: 'menu-item', class: 'dropdown-item' }, [
      Text('JIRA Linker Settings'),
    ]),
  ]);

  const createLink = ({ projects, jiraRoot }, parent, node) => {
    const { textContent } = node;
    const issueLink = `<a class="${linkedMarker}" href="${jiraRoot}/browse/$&">$&</a>`;
    for (const project of projects) {
      const regexp = new RegExp(`${project}-\\d+`, 'i');
      if (textContent.search(regexp) === -1) {
        continue;
      }

      const replacement = document.createElement('span');
      replacement.innerHTML = textContent.replace(regexp, issueLink);
      parent.replaceChild(replacement, node);
    }
  }

  const linkify = settings => parent => node => {
    const { childNodes, className, nodeType } = node;

    if (nodeType === Node.TEXT_NODE) {
        createLink(settings, parent, node);
    }

    // Do not linkify jira issue links.
    if (className === linkedMarker) {
        return;
    }

    // TCO isn't a thing yet so meh.
    childNodes.forEach(linkify(settings)(node))
  }

  const linkifyRoot = () => {
    const settings = getSettings();
    setTimeout(() => {
      linkify(settings)(null)(document.body);
    }, 0);
  }

  const getSettings = () => {
    if (localStorage.getItem(localStorageKey)) {
      return JSON.parse(localStorage.getItem(localStorageKey));
    }
    return {
      projects: null,
      jiraRoot: null,
    };
  }

  const showSettingsModal = () => {
    const { projects, jiraRoot } = getSettings();

    document.body.appendChild(settingsModal);
    if (jiraRoot) {
      document.querySelector(`#${jiraRootId}`).value = jiraRoot;
    }
    if (Array.isArray(projects) && projects.length > 0) {
      document.querySelector(`#${jiraProjectsId}`).value = projects.join(' ');
    }
    settingsModal.onsubmit = event => {
      event.preventDefault();
      localStorage.setItem(localStorageKey, JSON.stringify({
        projects: document.querySelector(`#${jiraProjectsId}`).value.replace(/,/g, '').split(' '),
        jiraRoot: document.querySelector(`#${jiraRootId}`).value,
      }))
      document.body.removeChild(settingsModal);
      start();
    }

  }

  const start = () => {
    linkifyRoot();
    const observer = new MutationObserver(linkifyRoot);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.querySelector('details-menu > form.logout-form').prepend(changeSettingsLink)
  changeSettingsLink.onclick = event => {
    event.preventDefault();
    showSettingsModal();
  }

  if (localStorage.getItem(localStorageKey) === null) {
    showSettingsModal();
  } else {
    start();
  }
})();
