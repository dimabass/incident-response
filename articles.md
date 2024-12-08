---
layout: default
title: "All Articles"
permalink: /articles/
---

# Articles

Here are all the articles:

{% for article in site.articles %}
- [{{ article.title }}]({{ article.url }}) — {{ article.date }}
{% endfor %}
