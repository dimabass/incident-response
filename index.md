---
layout: default
title: "Main title"
---
# Articles

{% for article in site.articles %}
- [{{ article.title }}]({{ article.url }})
{% endfor %}

