---
title: "Pair programming"
date: "2026-03-01T11:30:00.000Z"
slug: "26w09"
feature_image_alt: "An electrical shutoff switch and two fire extinguisher handles on the side of an old truck. Image Anthony Nelzin-Santos."
feature_image_caption: "Chassieu (France), 2011-10."
from:
  - "lyon-fr"
---

For over fifteen years, i’ve been photographing storefronts to document a rapidly fading typographical tradition. [These “architypes”](https://archityp.es) inform my practice as a budding typeface designer, but i don’t want to selfishly keep them for myself. I’ve been mulling over this idea of a single-page gallery with infinite scrolling, light table popovers, and touch-based navigation. Unfortunately, i don’t have an army of engineers to address the edge cases that inevitably arise with complex interactions. But i do have a [Claude](https://claude.ai/) Pro subscription.

Once again, i turned to [Ghost](https://ghost.org) and [Magic Pages](https://www.magicpages.co/?aff=28KZ2RKopuJG) to handle the content. I’ve sketched my idea on paper so many times that it took me only a few minutes to come up with a basic prototype. I’ve written the stylesheet myself because, believe it or not, “professional” developers’ disdain for “basic” web technologies has severely hampered LLMs’ ability to write cogent CSS. But i let Claude write every single line of [the main (vanilla) JavaScript](https://archityp.es/assets/js/main.js).

Under my guidance, it turned Ghost’s pagination into infinite scrolling, used [the newish `<dialog>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog) to build popovers, implemented keyboard and touch navigation, and fixed bugs along the way. Is it the code i’d have written? Well yes, actually, because it has this naive and repetitive quality that i like so much. But no, really, because i hate writing JavaScript so much that i’d have never made the effort.

In the end, it took less than six hours to go from idea [to website](https://archityp.es). That’s awesome! Claude has enabled me to build something i’d have never built otherwise, not because i can’t, but because i’d rather use my limited time on Earth to do anything other than writing JavaScript. I’m uneasy about the environmental cost of my little experiment, though. It’s almost feels like taking a short-haul flight instead of a three-hour train journey. I have to reckon with that.

------------------------------------------------------------------------

## Apps

[**Current**](https://www.terrygodier.com/current)**.** Following up [on last week](/d/26w08/): Terry has been working ’round the clock to squash most bugs. There are still some conceptual oddities and [functional failures](https://forum.terrygodier.com/t/preserving-your-reading-position/121), particularly on the Mac, but it’s getting there.

## Links

[**“The Galaxy S26 is a photography nightmare”**](https://www.theverge.com/podcast/885942/samsung-galaxy-s26-ai-camera-nightmare-vergecast) **by David Pierce and Nilay Patel.** I wanted to write something about Samsung’s foray into productized lying, but Nilay said it better. At this rate, they’ll soon remove the cameras from their phones to save a few bucks, and tell you not to believe your own eyes when their generated nonsense doesn’t look anything like what you’re seeing.

## Music

***Bach Coltrane* by Raphaël Imbert Project.** I can’t believe i first listened to *Bach Coltrane* almost twenty years ago (and that Coltrane was born 100 years ago), but here we are. I’ve never been that convinced by Imbert’s analysis of Bach’s influence on Coltrane’s compositions – most of it is thoroughly ahistorical – but it’s a good musical hook. Coltrane’s influence on Steve Reich is more documented. [La Trinité](https://trinitelyon-com.translate.goog/?_x_tr_sl=fr&_x_tr_tl=en&_x_tr_hl=fr&_x_tr_pto=wapp), a deconsecrated 17th-century chapel that’s now a *“baroque and irregular music”* venue, was the perfect setting to explore the melodic links between the three. Imbert’s bombastic presence and forceful playing were overbearing at times, but i absolutely loved his interpretation of Reich’s *Clapping Music* for the saxophone.
