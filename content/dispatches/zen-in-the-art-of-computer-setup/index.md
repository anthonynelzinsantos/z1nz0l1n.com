---
title: "Zen in the art of computer setup"
date: "2025-08-15T06:00:00.000Z"
slug: "zen-in-the-art-of-computer-setup"
aliases:
  - "/d/zen-in-the-art-of-computer-setup/"
feature_image_alt: "The Pierre-Baudis Japanese garden in Toulouse."
feature_image_caption: "Toulouse (France), 2024/08. Image Anthony Nelzin-Santos."
from:
  - "lyon-fr"
---

Let’s say you need to reinstall your Mac from scratch after you broke its firmware and failed to revive it using Apple’s [own method](https://support.apple.com/en-us/108900). Of course, this is a fictional example and not something i’ve had to do twice this week. I’m a bit miffed you’d think otherwise. Anyway. Were this to happen to you, and you’d ask me to help reinstall your Mac exactly how i’d do it for myself, here’s my how-to guide.

Sign in to your iCloud and App Store accounts. It’ll be important for later.

Run [my MacInstall script](https://github.com/anthonynelzinsantos/MacInstall/tree/master) to change a few defaults. More people should use [hot corners](https://support.apple.com/en-gb/guide/mac-help/mchlp3000/mac) and nobody should be forced to use the Finder without the path bar. I’m too lazy to figure out why Safari’s commands stopped working, so you’ll want to turn off *Open “safe” files after downloading i*n the *General* tab and turn on *Show full website address* and *Show features for web developers* in the *Advanced* tab.

The script will install Homebrew, which will, in turn, install the command line tools. A few apps will be installed with Homebrew Cask:

- [1Password](https://1password.com), the best cross-platform password manager;
- [BBEdit](https://www.barebones.com/products/bbedit/index.html), the only IDE that doesn’t suck;
- [Calibre](https://calibre-ebook.com), an incredibly effective and incredibly ugly e-book manager;
- [Contraste](https://contrasteapp.com/), a nifty little app to check that a colour combination complies with the [WCAG](https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines);
- [Figma](https://www.figma.com/fr-fr/), even though you’d like to go back to [Sketch](https://www.sketch.com/);
- [Firefox](https://www.mozilla.org/en-US/firefox/new/), because some sites don’t like Safari;
- [kDrive](https://www.infomaniak.com/en/kdrive/?utm_term=5fd3bff1d1501), you should store your files in Switzerland as well;
- [Plexamp](https://www.plex.tv/plexamp/), [Pocket Casts](https://pocketcasts.com/) and [Swinsian](https://swinsian.com/), your ears need regular feeding;
- [UTM](https://mac.getutm.app/), because you need to boot up Windows once in a blue moon.

The [MAS](https://github.com/mas-cli/mas#known-issues) command-line interface will then be used to download the rest of your apps from the App Store:

- [Buddy](https://buddy.download/), because adulting is hard;
- [GoodLinks](https://apps.apple.com/fr/app/goodlinks/id1474335294?l=en-GB), a great read-it-later app;
- [Hello Weather](https://helloweather.com/), the best weather app under the sun;
- [Home Assistant](https://apps.apple.com/fr/app/ia-writer/id1099568401?l=en-GB&mt=12), the ultimate home automation solution;
- [iA Writer](https://apps.apple.com/fr/app/ia-writer/id775737590?l=en-GB&mt=12), which gets worse with every “update”;
- [Keynote](https://apps.apple.com/fr/app/keynote/id409183694?l=en-GB&mt=12), because who’d want to use PowerPoint;
- [Numbers](https://apps.apple.com/fr/app/numbers/id409203825?l=en-GB&mt=12), because who’d want to use Excel;
- [Pages](https://apps.apple.com/fr/app/pages/id409201541?l=en-GB&mt=12), because who’d want to use Word;
- [Parcel](https://parcel.app/), that’s why you need Buddy;
- [Pixelmator Pro](https://www.pixelmator.com/pro/) and [Photomator](https://apps.apple.com/fr/app/photomator/id1444636541?l=en-GB), photo-editing apps so good that Apple bought them;
- [Reeder](https://apps.apple.com/fr/app/reeder/id6475002485?l=en-GB), a beautiful and functional RSS reader;
- [Tailscale](https://login.tailscale.com/start), a modern VPN app connected to your [NextDNS](https://nextdns.io/?from=vmjyb7pc) and [Mullvad](https://mullvad.net/fr) accounts;
- [Tot](https://tot.rocks/), your tiny text companion;
- [WaterMinder](https://apps.apple.com/fr/app/waterminder-water-tracker/id1415257369?l=en-GB&mt=12), because you’ve got the bad habit of not drinking enough water and ending up in the hospital because of it.

It will also install a few Safari extensions:

- [Antidote](https://www.antidote.info/en/)’s connector, for your favourite proofreading tool (that you’ll have to install manually)
- [1Blocker](https://apps.apple.com/fr/app/1blocker-ad-blocker/id1365531024?l=en-GB), the web is better without ads and trackers;
- [Kagi](https://apps.apple.com/fr/app/kagi-for-safari/id1622835804?l=en-GB), search is better without ads and trackers;
- [StopTheMadness Pro](https://apps.apple.com/fr/app/stopthemadness-pro/id6471380298?l=en-GB), the web *really* is better without ads and trackers.

If you want to type in multiple languages with a single keyboard, you’ll want to install [my QWeuRTY keyboard layout](https://github.com/anthonynelzinsantos/QWeuRTY). If you’re feeling nostalgic, you’ll want to download [the Aqueux wallpapers](https://hector.me/aqueux). With that, you’re all set!

*This is the second revision of this post, which was originally published on 08/02/25.*
