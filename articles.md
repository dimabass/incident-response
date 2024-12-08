---
layout: default
title: "Все статьи"
permalink: /articles/
---

# Все статьи

{% for article in site.articles %}
- [{{ article.title }}]({{ article.url }}) — {{ article.date }}
{% endfor %}
