---
title: "Where you at? The IndieWeb edition"
date: "2026-11-15T16:00:00.000Z"
slug: "26w46"
feature_image_alt: "The exact location of the blog you’re currently reading. Image Anthony Nelzin-Santos."
feature_image_caption: "Somewhere around Geneva (CH), 2022.03."
from:
  - "lyon-fr"
---

You could argue [the “Where you at?” quiz](/26w44/) is harder now that we spend so much of our lives online, but i don’t think it was that easy back in 1981, and we now have search engines and LLMs to help us “fudge, cheat, or elude”. The catch is that being online has given us a second environment to worry about, and most of us — IndieWeb folk included — know even less about it than about the physical one. So i wrote a “Where you at?” for bloggers:

1. Trace a request from a reader’s browser to your server. Name every company it passes through: registrar, DNS, CDN, host.
2. In what town does your blog physically live? (Bonus special: name the data centre and its operator.)
3. What powers that data centre and what was the carbon intensity of the local grid last year? (Slack: 10 g for every 100 g CO₂eq/kWh.)
4. Who owns your host, and who owns them? Keep going until you reach the single individual or company that ultimately controls your host.
5. Which country’s laws govern your host and which governments could compel it to hand over your files?
6. What builds your blog? Who writes that software, from where, and who pays for its development?
7. How do your host and your CMS make their money?
8. How many days until your TLS certificate renews?
9. Name five things your homepage loads. Are any of them native?
10. Which services your blog once depended on have gone extinct?
11. Where does your blog go when you stop paying?
12. From where you’re reading this, point to your RSS feed.

If you blog, i invite you to try to answer every question. In the spirit of the original, try first without looking anything up. Here are my own answers.
## Trace a request from a reader’s browser to your server.

When a reader types `z1nz0l1n.com` in their browser, their domain name resolver (usually their ISP’s) starts a cascade of queries to determine the responsible [domain name servers](https://en.wikipedia.org/wiki/Domain_Name_System). The root servers point to Verisign, which runs the `.com` registry from the United States and itself points to [Infomaniak](https://www.infomaniak.com/goto/fr/home?utm_term=5fd3bff1d1501)’s own nameservers, which finally direct to the shared web hosting where the blog sits. As there’s no CDN, the browser talks directly to the server through a complex web of [exchange points](https://en.wikipedia.org/wiki/Internet_exchange_point), including [SwissIX](https://en.wikipedia.org/wiki/Swiss_Internet_Exchange) and [CIXP](https://en.wikipedia.org/wiki/CERN_Internet_Exchange_Point). The communication is encrypted with a certificate[^1] from [Let’s Encrypt](https://letsencrypt.org/), the free authority run by the Internet Security Research Group, a Californian nonprofit that Infomaniak sponsors.

## In what town does your blog physically live?

A few years ago, i was fortunate to visit [Infomaniak’s DCIII](https://www.infomaniak.com/en/hosting/datacenter-housing?utm_term=5fd3bff1d1501) and actually touch the very server my blog lives on. Out of respect for their security policy, i won’t divulge its exact location. Let’s just say it’s located somewhere near Geneva (Switzerland), a mere 110 km from my own home in Lyon (France).

## What powers that data centre and what was the carbon intensity of the local grid last year?

According to the Swiss Federal Office for the Environment, electricity produced in Switzerland emits only 21.4 g of CO₂eq/kWh thanks to hydropower and nuclear energy. The canton of Geneva’s main energy provider, SIG, supplies Infomaniak with electricity coming from national hydroelectric power plants (60%) and local solar and hydropower (40%). Its specific energy mix emits [11.77 g of CO₂eq/kWh](https://www.infomaniak.com/en/support/faq/1160/discover-eco-design-to-reduce-your-carbon-footprint?utm_term=5fd3bff1d1501).

Infomaniak has made great strides in reducing its environmental impact, which mainly comes from the purchase of new servers and equipment. The company offsets 200% of its total CO₂ emissions, which [isn’t a silver bullet](https://en.wikipedia.org/wiki/Carbon_offsets_and_credits#Limitations_and_drawbacks), but is also [building multiple solar farms](https://news.infomaniak.com/en/solar-power-plants-meyerburger?utm_term=5fd3bff1d1501) using European panels and inverters to cover 50% of its energy needs by 2030. Its latest data centre [recovers 100% of its lost energy](https://news.infomaniak.com/en/infomaniak-inaugurates-a-revolutionary-data-center-that-recovers-100-of-its-energy-for-building-heating?utm_term=5fd3bff1d1501) to heat up to 6,000 homes.

## Who owns your host, and who owns them?

Infomaniak SA has been listed on the SIX Swiss Exchange since 1 October 2026 [under the symbol INFO](https://www.six-group.com/en/market-data/shares/share-explorer/share-details.CH1609605055CHF4.html#/). Perrot Duval, an old automotive distribution and industrial automation company listed since 1905, ‘took over’ Infomaniak through a [reverse merger](https://en.wikipedia.org/wiki/Reverse_takeover). Most of the capital still belongs to founder Boris Siegenthaler and about thirty employees. Since May 2026, the majority of voting rights has belonged to the [Fondation Infomaniak](https://fondation-infomaniak.ch/en/), a public-interest foundation, through unlisted A shares with privileged votes. Selling even part of them requires the unanimous consent of the foundation’s board.

## Which country’s laws govern your host and which governments could compel it to hand over your files?

Switzerland. In January 2025, the Federal Council opened a public consultation on the partial revision of the ordinance on the surveillance of postal and telecommunications traffic, widening the range of companies forced to collect and communicate user data. Infomaniak opposed the revision as drafted while also rejecting total anonymity online, a position that caused quite the kerfuffle, but that i agree with. Following heavy pushback, the Federal Council commissioned an external impact assessment and promised a new consultation on a reworked draft. I’m still monitoring the situation, as your privacy as a reader could be put in jeopardy if my server’s access logs were handed over to a hostile government.

## What builds your blog? Who writes that software, from where, and who pays for its development?

[Hugo](https://gohugo.io/), an open-source static site generator written in Go and released under the Apache 2.0 licence. [Steve Francia](https://spf13.com/) made the first commit in July 2013 on a train commute to New York. [Bjørn Erik Pedersen](https://bep.is/en/), a Norwegian developer and saxophonist, has led the project since 2015. Go itself is a Google project. Nobody pays for Hugo in any structured way, but Pedersen accepts donations [through GitHub Sponsors](https://github.com/sponsors/bep). The layout is mine, written from scratch, and costs nothing but time.

## How do your host and your CMS make their money?

Infomaniak charges for web hosting and domains, mail, [its sovereign alternative to Microsoft 365](https://www.infomaniak.com/fr/ksuite?utm_term=5fd3bff1d1501) and cloud infrastructure. It posted revenue of CHF 55.9 million in 2025 with a healthy EBITDA margin of 35.6%. Since 2017, profits have been reinvested in data centres, research and hiring. Not monetizing customer data is one of the nine principles in the Fondation Infomaniak’s charter, which it may strengthen, but never weaken. Hugo makes no money beyond its lead developer’s donations. The blog is version-controlled, compiled and deployed [by GitHub](https://github.com/anthonynelzinsantos/z1nz0l1n.com/), funded by Microsoft’s subscription and AI services, which i’m not entirely comfortable with.
## How many days until your TLS certificate renews?

55 days — it’s crazy that browsers now make it nigh impossible to find this information. Infomaniak issues free Let’s Encrypt certificates and renews them automatically before they lapse. Since 15 March 2026, no publicly trusted certificate may last more than 200 days, a number that’ll drop to 100 days in March 2027 and 47 days in March 2029. Let’s Encrypt is moving ahead of it, from 90 days as of now [to 64 days in February 2027](https://letsencrypt.org/2026/10/07/64-day-certs) and only 45 days in February 2028.
## Name five things your homepage loads. Are any of them native?

My homepage loads the blog’s main CSS and JS files, the hero image and the lightbox’s CSS and JS files, a few fonts, the favicon in two formats and the blog’s logo from the server. The only ‘non-native’ resource is [Tinylytics](https://tinylytics.app/)’s analytics script.

## Which services your blog once depended on have gone extinct?

*Z1NZ0L1N* is the English reincarnation of [my old French blog](https://4rch1v3.z1nz0l1n.com/), which i built using [Stacey](https://web.archive.org/web/20180506003050/http://www.staceyapp.com/), a wonderfully simple flat-file CMS that is still my platonic ideal of blogging software. It’s been abandoned for [13 years](https://github.com/kolber/stacey) and i still yearn for it. Maybe i should use Claude Code to resurrect it. Maybe. Also: i will NE-VER forgive Google for shutting down Google Reader.
## Where does your blog go when you stop paying?

Nowhere at first. The main domain is set to expire next year, but some aliases are paid through 2033, and i’m now renewing my domains in 9-year chunks. Infomaniak holds on expired domains for months, so even if i somehow miss a renewal, i’ll still be able to buy them back for a fee. The hosting is also set to expire next year, but it’ll also be renewed for 9 years. My will’s beneficiaries have instructions to keep the blog online for as long as possible. I guess the source on GitHub and [snapshots in the Wayback Machine](https://web.archive.org/web/20260615000000*/z1nz0l1n.com) will keep on running for a while?

## From where you’re reading this, point to your RSS feed.

[Here](https://z1nz0l1n.com/index.xml).

[^1]: I know, but i don’t want to write (and force you to read) 1,500 words about [public key infrastructure](https://en.wikipedia.org/wiki/Public_key_infrastructure).
