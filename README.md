# axisJS
## version 0.1.0
### 2014 [Ændrew Rininsland](http://www.github.com/aendrew) for [The Times and Sunday Times](http://www.github.com/times)

axisJS is a light [Angular](http://angularjs.org)-based app for generating charts. It combines with
the [AxisWP](http://www.github.com/times/Axis) WordPress plugin to
add rich charting capabilities to WordPress.

axisJS is built atop the [Yeoman](http://github.com/yeoman) [Angular](http://github.com/yeoman/generator-angular)
generator and currently makes use of C3 to build charts.

axisJS owes a huge debt of gratitude to [Quartz](http://www.qz.com)'s [ChartBuilder](http://quartz.github.io/ChartBuilder),
from where much of the PNG/SVG output code is taken (in addition to some of the interface design).

### Bower

`bower install axisjs`

### Project goals

1. Enable easy integration of various D3-based frameworks into a simple interface
2. Enable a wide array of data input methods
3. Be modular enough to allow charting frameworks to easily be replaced
4. Allow for straight-forward customisation and styling
5. Allow for easy integration into existing content management systems
6. Allow journalists to easily create charts that are embeddable across a wide array of devices and media


### To build

1. `npm install`
2. `bower install`
3. `grunt build`

### Modifying

The source is in the `app` folder, which gets built to `dist` when you do `grunt build`.
When working on it, run `grunt serve` to invoke a light HTTP server that auto-reloads the page
when you save a file. Styles are in Sass at `app/styles`.

### Contributing

Please do a new feature branch when forking and squash your commits before
making a pull request. Pull requests welcomed and encouraged. I especially welcome
any documentation or unit testing PRs!

### API Docs

Inline documentation is in ngDoc format and gets built to `docs` during `grunt build`.
View API docs online [here](http://times.github.io/axisJS/docs/).

### Roadmap/ToDos

1. Abstract chart configuration into a provider so that `app/scripts/directives/buildchart.js`
and `app/scripts/directives/exportchart.js` aren't so tightly bound to C3
2. **ALL** the unit tests
3. Documentation and cleanup of `buildchart.js` and `exportchart.js`
4. Abstract each output format into factories so more can be modularly added
5. Abstract out vendor functionality — i.e., make the colour picker replaceable
6. Create an external config file with settings like colour scheme
7. Improve inline documentation
8. Fix "ui-grid" for tabular data import
9. Make adding categorical axes more straight-forward
10. Create adapters for [nvd3](http://www.nvd3.org) and other SVG-based charting libraries.
