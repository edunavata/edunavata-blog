---
title: 'Disposable LLM tools: when to build and when not to'
date: 2026-07-09
draft: false
slug: 'disposable-llm-tools'
description: 'Three tools built with an LLM and boto3 on AWS, and why only one was worth it. A practical criterion for deciding what to build.'
summary: 'I built three scripts with an LLM and boto3 for Athena, Glue and Redshift. Only one survived. The difference wasn''t technical: it was whether anyone else needed it.'
category: carrera
tags: [tools, productivity, llm, aws, best-practices]
lang: 'en'
translationKey: 'llm-tool'
cover:
  image: './cover.png'
  alt: 'Disposable LLM tools on AWS'
---

We can probably agree that the AWS web interface is heavy and slow. If you've worked with it you'll recognize that feeling of waiting for it to load or missing basic productivity features. It all gets worse if you work on low-resource machines or remote desktops: in my case, I easily wasted **30% of my workday** waiting for the interface.

On the other hand, we all know the AWS CLI. For the tasks you've mastered, it's as fast as opening a terminal and firing off the command. But the moment you want to do something you're not familiar with, it's documentation time and fighting the initial errors before you gain any productivity. And this is 2026: the first thing we do before opening that documentation is ask the AI and let it be the one to fight the commands.

After doing this several times, and getting tired of copy-pasting, I remembered a third path: the AWS SDK (`boto3`). Why not wrap my use case in a script and let a coding agent use it freely? That way I'd only have to ask the AI, in natural language, for the action I wanted to run, and as a bonus I'd end up with a script I could use myself if it gave me better UX than the interface.

That was the first tool. Then I built two more, and all three met a different fate. That's what this article is about: today building costs almost nothing, so the question is no longer **whether you can build something**, but **whether it deserves to exist**.

## Case 1: Nobody needed it

I find the Athena interface especially slow and heavy, above all with several databases and multiple tables. I'm used to using DBeaver, and against a client like that Athena's UX drops sharply. In corporate environments you usually don't have permissions to configure services like Spectrum either, so that path was ruled out. I needed to improve my workflow using only the authentication I already had.

So I asked Opus, *my trusted partner for these things*, to develop a simple script to run queries on Athena, with the elementary flags (`workgroup`, AWS profile, etc.). In **five minutes** I had the tool ready, I pushed it to my repo, and within a few more minutes my coding agent was already querying Athena freely. I could also write the queries myself and see the results in the terminal.

The tool worked, but it fell short as soon as the table grew: it only served for one-off queries of a few columns. It didn't replace the original interface, and **the pain it avoided was smaller than the one it introduced**.

Nobody on my team ever used it. I used it a couple more times myself and then stopped touching it. It didn't fail through poor execution —in five minutes I had something functional— but because it solved **a personal, one-off annoyance of mine that wasn't frequent enough nor shared enough** to justify maintaining it.

And there's a second confirmation, in hindsight: today my team uses Kiro, which has a tool available for interacting with Athena among other AWS services. My tool today would be flat-out redundant.

> **Lesson 1:** don't solve a problem that already has a solution. Before building, the first thing is to check whether it already exists.

## Case 2: The team made it their own

In this case the problem was the same: the slow, clunky interface. In large data projects, especially at the start when the architecture is still being assembled, debugging is constant. There were days when I modified a Glue job **15 or 20 times**. What does that process involve via the interface?

1. Copy the code to the clipboard.
2. Open the browser.
3. Reload the AWS session (which closes periodically, in my case every 30-60 minutes).
4. Navigate to Glue.
5. Enter the job.
6. Paste.
7. Save.
8. Run.

It seems fast, but I easily lost **5 minutes** per deployment.

I had already created some loose script to interact with Glue on very specific tasks. At that moment the lightbulb went off: how nice a shell-like console for Glue would be. I called my *trusted partner* again and the result was incredible; I didn't even spend time thinking the requirements through properly, I just vaguely defined the UX I wanted and that it should use only `boto3` as a dependency. In a few minutes I had a personal shell with command history where I could see jobs, run them, view logs, download and upload code. What used to take **5 minutes** was now **20 seconds**, without leaving VS Code.

At first only I used it. When I finished validating it I showed it to a coworker; there was the typical initial friction (he gave me a funny look). A few days later he told me *"it'd be nice to add this feature"*; the following week, *"look what I added to the tool"*. That's the best feedback possible.

Today I use it daily. If I need to review logs in depth I hand it off to Kiro, which has its own tool for that and does it ten times faster than me. But I always have a Glue console open in my environment, for quick checks or to re-launch something by hand.

The ROI has been sky-high: minutes of initial development plus a few hours polishing it and adding use cases, in exchange for **10x or 20x** productivity, and the peace of mind the AWS interface never gave.

This is the difference with Athena. Me saying a tool is useful proves nothing; a coworker extending it on their own, without me asking, does.

> **Lesson 2:** the signal that really separates an adopted tool from one that just looks like a good idea is that someone else invests their time in improving it.

## Case 3: I still don't know if it deserves to exist

When you're in the middle of a large data migration, one of the most important steps —maybe the most— is making sure the new data is genuinely correct and there's been no corruption in the process. You'll know what that means: infernal queries comparing tables with dozens of columns, constant headaches and high initial friction.

These queries we develop with AI today, but you always have to run them, analyze results, keep making small adjustments. And deep down it's mechanical work, low added value. Once you detect the discrepancies, what really adds value is deciding whether the new is better, worse or neutral, and whether the new processes deserve fixing. But that's the smallest part of the time.

A few months ago I had already explored the idea of giving an LLM access to a database via an MCP ([I'll leave it here](https://github.com/edunavata/GPU-MCP) in case it's of interest), in a rudimentary and experimental way, we still weren't fully in the agentic era. Seeing what coding agents could already do, I picked the idea back up, but much simpler: a Skill approach instead of MCP. I created a script that, using `boto3`, allowed queries to Redshift with certain guardrails (*whitelist*, `SELECT` operations only, credentials opaque to the LLM). And I created a Kiro agent to which I explained the validation flow, with the goal of generating a report that made life easier for the developer in charge of validating.

The result? In **a few minutes**, a clean report, obtained through a replicable procedure, with every query used numbered and logged. That same report manually takes **hours**. The tool sparked a lot of hype on my team, especially among non-technical users; even my boss validated the value of the report the moment he saw it. It seems like magic to ask the LLM to review the new tables against the reference ones and get a report in minutes, with real data.

But there's something to underline: this tool is young, not even I have used it in depth yet. And there lies the honest tension: **enthusiasm is not the same as use**. Nobody has yet added a feature to it, flagged a bug, or complained that it isn't in the repo —the same signals Glue did have and that Athena never got. It has potential, the boss validated it, the team applauded it. But the question that really matters (is it worth continuing to invest in it?) still has no answer.

> **Lesson 3 (pending):** that answer isn't one I'm going to decide by looking at it; the team is going to decide it, by using it or not, over the coming weeks.

## Conclusions

Let's go back to the initial question: today building is cheap, so the relevant question isn't whether I can build something, but whether it's worth doing. What lessons do I draw from my experience with these three tools?

### The pain must be real and frequent

If you're not going to use the tool for weeks, or at least intensely for a few days, maybe you should simply ask the AI directly, or create the simplest, most disposable solution possible, spending minimal time. Or, why not, do it by hand, many times over —in the time we spend deciding whether it's worth it, we'd already have done it manually.

**The problem it solves must hurt you and the rest of your team.** If it's a recurring complaint that comes up over coffee, or the target of constant jokes, that's a good candidate to become a tool.

### Would anyone use it without me asking them to?

**This is the acid test.** If the pain is high enough, your coworkers won't just use it without you asking; they'll come looking for it the moment they know it exists. In my case, they even extended it on their own.

With Athena I did exactly the opposite of what I'd now recommend: I built it for a pain only I felt, without checking whether anyone else shared it, and that's why nobody claimed it. With Glue I didn't ask anyone before building it —the pain was mine and strong enough to justify it anyway— but the signal that it was worth maintaining came afterward, when they used it without my offering it. There's the difference: **asking beforehand saves you from building for a pain that was only yours; later adoption is what confirms whether it was really worth it**.

### Is the saving noticeable?

Often, wanting to simplify our workflow, we end up overcomplicating it, spending a huge amount of time and energy on that redundant optimization process. As I said before, on many occasions, after trying to do something simpler, I found myself thinking: "if I'd done it by hand it would already be done".

Personally I like to estimate:

- How much do I waste on this task?
- How many times do I do it per week?
- For how long am I going to have to do it?
- How many more people will have to do it?

The underlying idea is to calculate how many hours are wasted and, therefore, how much money that problem costs.

If you run into a personal pain point, but you'll only have to deal with it for a short period of time, maybe it's not worth spending your time, mental energy and tokens automating it.

### And if you build, apply the 80/20

Once you decide it's worth it, don't turn it into a product. Glue was born without me spending time thinking the requirements through: I vaguely defined the UX and little more. **That 20% of effort captured 80% of the value**, and what was missing was added by the team when they really needed it. Building the minimum also protects you: if it turns out the tool was a mistake, like Athena, you've lost **minutes**, not days. Sometimes the right thing is to build something knowing it'll live a week, use it and throw it away. That's not a failure; it's exactly what building costing almost nothing is for.

---

Before I had access to an LLM that programs for me, the cost of building a tool already filtered out most bad ideas on its own: if something wasn't worth two days of my time, I didn't even try. **That filter has disappeared.** Today I can build in minutes something that would have cost me an afternoon before, and that's a huge advantage, but it also means nothing stops me anymore from building things I shouldn't.

Athena, Glue and Redshift cost the same in development time: **minutes**. The difference isn't in how I built them, but in **whether they deserved to exist**, and that's a question I now have to ask myself, because the LLM won't ask it for me.

I used to measure a tool by what it cost to build. Today I measure it by something simpler: **if it disappeared tomorrow, would anyone miss it?**

| Tool | Would anyone miss it? |
| --- | --- |
| Athena | Nobody |
| Glue | The whole team |
| Redshift | I don't know yet |

And that's why, with Redshift, I still don't know if it deserved to exist.

> Building already stopped being the problem. Deciding what deserves to exist is the work that remains.
