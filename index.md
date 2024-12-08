{% for article in site.articles %}
- [{{ article.title }}]({{ article.url }}) — {{ article.date }}
{% endfor %}
