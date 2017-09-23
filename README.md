# fetchdom

You are in the middle of a web scraping job when you realize the page that
holds all the juicy info you desire uses ReactJS and AJAX.

**If you are me**, you write a PhantomJS script to fetch the page, then realize
that it was worse than you thought, as the page uses lazy loading to load more
content as you scroll. So you recursively scroll down until scrolling does not
trigger any more requests. You think this could be useful for others, so you
publish it to [npm](https://www.npmjs.com/package/fetchdom).

**If you are not me**, you just run `npm install --global fetchdom`, and
continue writing your [regular expressions to parse the HTML](https://stackoverflow.com/a/1732454/159036).

## Usage

```
Usage: fetchdom [options] <url>

  A command-line tool for saving the rendered DOM of a website.


  Options:

    -V, --version            output the version number
    -s, --save-image <path>  write PNG screenshot to <path>
    -h, --help               output usage information
```
