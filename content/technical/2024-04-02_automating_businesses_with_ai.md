+++
date = '2025-04-01T16:45:40-08:00'
draft = false
title = "Generating Passive Income using Generative AI"
+++

Five years ago, I started on a pursuit. I wanted to see how I could go about generating my own passive income in 
a way that allowed me to quit my "day job" and work purely on passion projects. Today, I can finally say that I have 
succeeded in that pursuit.

# What I Did Wrong

We are all here mostly to learn about my failures, right? That's always the interesting part of these discussions
so let's just start with those.  If I could have my time over again, here is what I would do differently:

1. Building it in Kubernetes thinking this would be a fun tech stack to learn (it was fun, but completely unnecessary).
2. Diving headfirst into new technologies thinking they are always good. The ethics around AI are divisive and this generated a lot of strong discussions.
3. Not realising when I became a hindrance to my own process, rather than a benefit. I ended up slowing down the process by being too involved once it reached a certain point.
4. Not talking about this sooner - this journey has been incredible and I wish I had catalogued it more.

# 7 Stages of the Business

## Stage One: Defining the Goals

My goal with this was simple - I wanted passive income. Seems simple, right?  Well I did have a few caveats:

- I didn't want to do it under my own name (imposter syndrome?).
- I have very little creative skills.
- I didn't trust anything that was set and forget. 
- I wanted to learn while I did it.

## Stage Two: Defining the Problem Space

The problem space I was comfortable with was limited - I don't know how to make amazing art I could sell on Etsy, 
I don't know how to write a book I could publish forever more and I don't know how to run businesses that have humans.

So with that, I had a target: I needed to build something that would self-iterate over time while continuing to 
generate income.

## Stage Three: Fail Fast

I always like the fail-fast mentality. This meant that I wanted to spend very little time worrying about re-building
things, but I also needed fast input. I have a background in game development, generative & predictive AI and machine
learning - so these skills can surely be used in some way to make things work...

Problem is that games need a few skills I don't have, and don't want to learn - art, music, design, story 
(the creative stuff). And these things don't just passively generate money unless they are high quality. I don't have
time for that! 

So I published about 10 different, bad, games to see what the market was like. I targeted self-hosted internet-based
games to get fast, iterative release. I polled my friends for story ideas and I just accepted to music or art quality
would be available.

This failed... Spectacularly. I spent more money in the first few months hosting and investigating marketing streams
and advertising paths and sponsorships, and I had not slept in a week trying to keep a full time job on top of all of 
this.

Here is an example - before you look at it, please remember that I am a backend dev and the internal game loops were
amazingly optimised.....

![before.png](/img/2024-04-02_automating_businesses_with_ai_bad.png)

Yes this was actually a published, designed game - now you know why I didn't want my name on them...

I stopped and spent a month of thinking inwardly - was passive income actually beneficial to my life, if it introduced
this much stress? I re-assessed my goals, am I still on track? Where did I go wrong.

I realised that I was doing all the things I said I didn't want to do - I was spending **more** time and **more** money on 
something that didn't bring me any passion. I wondered to myself, is there something I could do to make my life easier?

## Stage Four: The uplifting montage

At this point, I looked at everything I wasn't good at - and instead of trying to become good I automated it using
generative AI. I started small - I had games that sucked, but I had a framework that kinda worked. I then looked at 
some open-source models that allowed art generation, and made sure that the models were trained only on art that the
artists were signing off or selling for training, and used it to generate incredibly bad art. But it was a start.

![AI Energy After](/img/2024-04-02_automating_businesses_with_ai_after.png)

I then took a look at the ROI for this game - it was incredibly low. I spent more on hosting than I got back from it -
what could I do for that? Well, I monetised the game via ads and everything else was able to be statically hosted rather
than hosted by some conglomerate, so I just moved everything to static hosting and let the consumers run the games. Easy
win, that honestly I should have thought about sooner. This dropped my hosting costs drastically as now it was just a 
relatively small javascript hosted in blob storage.

I spent the next month monitoring feedback on the games, they were mostly okay but the retention scores were low. I 
wasn't going to get long term passive income from this. So now I had to figure out a way to take that idea, and make it
repeatable.

## Stage Five: Stabilise

I didn't want to automate everything too early, I didn't know how long this would last. I spent a few months manually
making new, short, games. I wanted to make sure this was actually something before I turned on the firehose. So far,
my games weren't costing me anything but my time and the income was incredibly small but there.

I realised that the next thing I was most-bad at was idea generation. My games were just bland and uninspiring remakes
on the same themes. They were all idle, incremental or JRPG games that played for 4-6 hours of active time and centered
around an uninspiring story.

Luckily, there was a tool called generative AI I could use to help here. I cut some corners here I am not proud of - 
unfortunately I did use some models that were trained on non-public data (a problem I have now resolved). I chose to 
just accept the lack of music in my games, noone seems to mind for the style of games.

The metrics showed that the JRPG genre was a lot more expensive to make and less profitable, with a lot worse reviews 
so I chose to drop those from the list.

I slowly automated decision-making processes as much as possible - need new ideas? Well let's find a way to generate 
those in a higher capacity, or more varied. I refined my prompting from vague "make me an idle game" to using more
advanced techniques like N-shot prompting, and chain-of-thought prompting methods to try and get better examples out
of my existing systems as well as refining my model on feedback from the already published games.

Writing code is what I do for a living, and it is my passion, but spending 3-4 hours every day writing game code was 
killing me (javascript is not my preferred language) so I even started automating parts of that. I slowly got my time
down to where I was purely just QA-ing the games by playing a game genre I loved, eventually I realised that I was 
actually just redundant and slowing the process down. I did catch the occasional bug, but my market also didn't care
about those - I wasn't making AAA games.

## Stage Six: Profit

I have not touched this system (other than to pay my cloud bill) in over 6 months, yet the pay keeps rolling in.

After 5 years, I have now "finished" tinkering with the pipe, and it is working consistently. Every week, it starts up
and scans my accounts for activity. It follows a rough flow like:

- Check advertising revenue and reddit threads, and make a determination of whether a new game should be published
- Scan reddit and a few key game-hosting sites (itch.io, incrementaldb.com and galaxy.click) for games and comments
- Generate a new game
- Publish the game to the Android Play Store and/or to a publicly hosted game site

As you can see, this runs completely automated, I publish a new game every couple of days in most scenarios with my
Android games being much more profitable than my web games however I chose to continue both streams to ensure that 
I have redundant income streams.

## Stage Seven: Learn

Now that my proof of concept is there, I will never stop tinkering with it. I have proven I could stop now and 
comfortably live off this, however it is way too much fun to play with.


# (Some) Tools I Used

Not all the tools are listed here, because honestly over 5 years I have probably forgot more than I remember. However,
the final stack looks like:

- Back-office frontend re-built recently using Loveable
- Most LLMs are fine-tuned based on models from HuggingFace
- Hosting on GCP using GKE
- Languages are a mix of Golang, Javascript & Python depending on the day of the week I wrote it
- Artifacts are published to `itch.io` and `Google Play Store`
