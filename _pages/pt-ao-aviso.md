---
title: Aviso Legal
permalink: "/pt/aviso/"
layout: page
language: pt
description: Aviso legal do website sobre responsabilidade, privacidade, cookies e
  conformidade com o GDPR.
seo:
  title: Aviso Legal
  description: Aviso legal do website sobre responsabilidade, privacidade, cookies
    e conformidade com o GDPR.
---

{% assign i18n = site.data.i18n[page.language] %}
{% assign disclaimer = i18n.pages.disclaimer %}

<p>{{ disclaimer.intro_1 }}</p>

<p>{{ disclaimer.intro_2 }}</p>

<p>{{ disclaimer.intro_3 }}</p>

<p>{{ disclaimer.intro_4 }}</p>

<p><strong>{{ disclaimer.questions_heading }}</strong></p>

<p><strong>{{ disclaimer.email_label }}:</strong> <a href="mailto:{{ site.footer-links.email }}">{{ disclaimer.email_value }}</a></p>

<p><strong>{{ disclaimer.responsible_heading }}</strong></p>

<p>{{ disclaimer.responsible_name }}</p>
