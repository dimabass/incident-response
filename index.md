---
layout: default
title: "Home"
---

# Welcome to the Site

Here are all the articles:

{% for article in site.articles %}
- [{{ article.title }}]({{ article.url }}) ({{ article.date }})
{% endfor %}
