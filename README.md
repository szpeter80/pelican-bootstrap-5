# pelican-bootstrap-5
This is a simple Bootstrap 5 theme for Pelican, 
a statitc site generator written in Python.

It includes the Bootstrap 5 themes known as "Bootswatch" from
<https://bootswatch.com/> by Thomas Park.

It also includes the Bootstrap Icons as icon font from
<https://icons.getbootstrap.com>

## An example pelicanconf.py
```
AUTHOR = 'John Doe'
SITENAME = 'JD Blog'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'Europe/Budapest'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('Pelican', 'https://getpelican.com/'),
         ('Python.org', 'https://www.python.org/'),
         ('Jinja2', 'https://palletsprojects.com/p/jinja/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = False

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
```

## Customizing the theme

It is possible to crete two files under the assets directory:

- 'theme_custom.css'
- 'theme_custom.js'

These are included by the generated pages and enable simple customization without
using the frontend tooling.

## References

- <https://docs.getpelican.com/en/4.7.1/themes.html#creating-themes>
- <https://docs.getpelican.com/en/4.7.1/settings.html>
- <https://jinja.palletsprojects.com/en/3.0.x/templates/>
- <https://davidcolton.github.io/articles/2020/03/04/building_my_blog/>
- <https://www.thedigitalcatonline.com/blog/2021/03/25/how-to-write-a-pelican-theme-for-your-static-website/>
