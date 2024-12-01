---
layout: default
title: Articles
---
<h1>Articles</h1>
<ul>
    {% for post in site.pages %}
        <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
</ul>
