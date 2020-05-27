# JIRA Linker

<p align="center">
  <img height="400" src="https://user-images.githubusercontent.com/15232461/75402283-67702280-58d2-11ea-96db-096681bb692b.png" />
  <img height="200" src="https://user-images.githubusercontent.com/15232461/75402553-20cef800-58d3-11ea-9a68-7fc4fe5f5735.png" />
</p>

This is a GitHub extension that will automatically link back to your private JIRA instance!

The JIRA Linker will linkify anywhere it finds text in GitHub that looks like a JIRA ticket, including the issues overview page, issue descriptions, issue titles, pull requests... basically anywhere!  You can configure the matching patterns during setup.

## Installation

1. install Tampermonkey
    - [Chrome Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en)
    - [Firefox Add-On](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
1. create a new script via the extension once it's installed
1. copy/paste [this code](https://raw.githubusercontent.com/dimitropoulos/jira-linker/master/index.js) to your new script
1. save the script
1. refresh GitHub
1. follow the form in the lower-left-hand part of the screen

<img height="200" src="https://user-images.githubusercontent.com/15232461/75389684-f1a98e00-58b4-11ea-838e-ddf0586fdc50.png" />

## Pro Tips

If you ever want to edit this form you can click "JIRA Linker Settings" in your profile dropdown menu (at the extreme top right, in GitHub) between "Settings" and "Sign Out".  Also, you can clear localStorage, which will prompt the initial config form to appear again.

## Credit

Thanks to [jchv](https://github.com/jchv/userscripts/blob/master/github/jira-link.user.js) for starting this script.  It's quite the time saver!
