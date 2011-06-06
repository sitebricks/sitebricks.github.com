This is the Sitebricks documentation and community information website, hosted completely on Github
Pages.

The public URL for this site is http://sitebricks.org

## Committing

You can clone this repo down, and run `./build` to re-build & deploy it. It is totally static but
 there is code that converts markdown into JSON so it can be fetched for the site layout dynamically.
Take a look in `/src/main/resources/pages` to see what I mean. If you want a page to show up in the left nav, add
 it to `/src/main/resources/pages/nav.markdown`. All content is generated via markdown--see here
  for syntax: [http://daringfireball.net/projects/markdown/syntax]

To preview your changes simply run the *first line* in `./build` (mvn) and open `index.html` in any
 browser. Since the site is static, you should have full previews.

Feel free to send me a pull request. Committers to [Sitebricks](http://github.com/dhanji/sitebricks)
 should have direct commit rights to this repo.

Doc Contributions are welcome from anyone and *strongly* appreciated! =)
