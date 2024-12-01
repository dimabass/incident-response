---
layout: default
title: Articles
---

<h1>Articles</h1>
<ul>
  {% for article in site.articles %}
    <li><a href="{{ article.url }}">{{ article.title }}</a></li>
  {% endfor %}
</ul>
