---
title: The Age of Vulnerabilities
author: Shashank Shekhar
date: 2026-10-25
---

Security has always been considered a big factor when building software.
Yet it is also something a lot of software developers do not want to deal with.
Security often gets treated as a problem for tomorrow. That is becoming harder to do.

A zero-day vulnerability is a software flaw for which there is no available fix when it becomes known or exploited.
A zero-day exploit is the method used to take advantage of that vulnerability.
Depending on the vulnerability, this could result in remote code execution,
data theft, privilege escalation, authentication bypass or complete compromise of a system.

Historically, a lot of software ended up carrying vulnerabilities for years simply because people did not have the time to look into every possible edge case.
A vulnerability could sit dormant for years before a security researcher or a bad actor eventually discovered it.
AI changes this equation by reducing one of the biggest bottlenecks in vulnerability discovery: time and effort.
A lot of security research involves searching through an enormous number of possible inputs, states and unexpected behaviours.
Humans are naturally limited by how much code and how many scenarios they can investigate.
AI systems do not have the same limitation.

What might take a security researcher days or weeks to investigate can increasingly be automated or accelerated.
Instead of one person looking for an unusual combination of inputs that breaks a system, multiple AI agents can continuously analyse code,
test behaviour and search for vulnerabilities.This means bugs which stayed undiscovered and unpatched for years may now be found much faster.

We are already seeing early examples of this.
[Recent vulnerabilities found in the PHP](https://www.wiz.io/blog/php2shell-php-rce) runtime involved AI-assisted security research, including vulnerability discovery and exploit development.
We have also seen [repeated supply-chain attacks around ecosystems such as NPM](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem), where attackers target packages, developer accounts and
publishing infrastructure rather than attacking an application directly.

Vulnerabilities are becoming cheaper and faster to find.
This mean going forward security becomes a de facto part of the development cycle.
We cannot reduce bugs or exploits to zero, but developers will increasingly be expected to maintain a
reasonable level of security from the first build rather than treating security as something another team looks at before production.
Security testing may become continuous in the same way unit testing and CI/CD became normal parts of software development.

AI may also change some of the trade-offs we currently make while choosing programming languages.
Languages like Python and JavaScript became extremely popular partly because they allow developers to build software very quickly.
More strongly typed or memory-safe languages can sometimes require more upfront work, but they also provide additional guarantees
and remove certain classes of problems.
Historically, organisations were often willing to accept some of these trade-offs because development speed mattered more.
But if AI coding tools reduce the amount of manual effort required to write boilerplate and repetitive code, the advantage of choosing a language purely because it is faster to write may reduce.
This could make languages with stronger type systems, memory safety and compile-time guarantees more attractive for certain categories of software.

Companies will likely invest more in automated security tooling and security agents.In a way, it becomes fighting fire with fire.
If attackers use AI systems to continuously search for vulnerabilities, defenders will use AI systems to continuously review code,
discover vulnerabilities, monitor dependencies, detect suspicious behaviour and generate patches.

This may also change the role of software developers.Developers may spend less time simply writing every line of code
manually and more time supervising systems, reviewing generated code, maintaining applications, responding to vulnerabilities
and ensuring that software continues to behave securely after deployment.

We do not know exactly how this plays out.
it seems to me that existing vulnerabilities dramatically less likely to remain undiscovered.

For software engineers, that means keeping our eyes and ears open for security is no longer optional.
It is becoming part of the basic job of building and maintaining software.

_AI disclosure: I wrote this post myself. I used AI tools only to check grammar and sentence structure_
