# [WIP] auto-unrar

## Functions

<dl>
<dt><a href="#autoUnrar">autoUnrar(cwd, callback)</a></dt>
<dd><p>Unrar all files recursively if they don&#39;t exits given by
a entry point root directory.</p>
</dd>
<dt><a href="#poll">poll(options, callback)</a> ⇒ <code>function</code></dt>
<dd><p>Automatically poll defined by interval recursively from root
defined as cwd from the options.</p>
</dd>
</dl>

<a name="autoUnrar"></a>
## autoUnrar(cwd, callback)
Unrar all files recursively if they don't exits given by
a entry point root directory.

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| cwd | <code>String</code> | Path to search for rar-files |
| callback | <code>function</code> | Callback after all data has been unpacked |

**Example**
```js
autoUnrar('~/Documents/myDirectory', function (err, data) {
  // data is an object with archives as keys and entries on data.
  // example:
  // {
  //   'some-file.rar': {
  //     skip: false,
  //     outputFile: 'some/path/some-file.dat',
  //     entry: 'some-file'
  //   }
  // }
});
```
**Example**
CLI Usage
```
auto-unrar

  Automatic unpack all recursive rar-files from a directory.

Options

  -h, --help              Display this usage info
  -v, --verbose           Log all information
  --cwd string            What folder to use as base directory (root search directory)
  -i, --interval number   Set interval in minutes for periodic check. Default value is 5 minutes.

  Full help (project repo): https://github.com/mikaelbr/auto-unrar
```
<a name="poll"></a>
## poll(options, callback) ⇒ <code>function</code>
Automatically poll defined by interval recursively from root
defined as cwd from the options.

**Kind**: global function
**Returns**: <code>function</code> - Function to stop polling for packages.

| Param | Type | Description |
| --- | --- | --- |
| options | <code>String</code> &#124; <code>Object</code> | Path to search for rar-files or options object |
| options.cwd | <code>String</code> | Path to search for rar-files |
| options.interval | <code>Number</code> | Polling interval in minutes |
| options.beforeHook | <code>function</code> | Hook before each unpacking search |
| callback | <code>function</code> | Callback after all data has been unpacked |

**Example**
```js
autoUnrar.poll('~/Documents/myDirectory', function (err, data) {
  // data is an object with archives as keys and entries on data.
  // example:
  // {
  //   'some-file.rar': {
  //     skip: false,
  //     outputFile: 'some/path/some-file.dat',
  //     entry: 'some-file'
  //   }
  // }
});

autoUnrar.poll({
  cwd: '~/Documents/myDirectory',
  interval: 10, // every 10 mintues
  beforeHook: function () { console.log('About to search for files') }
}, function (err, data) {

});
```
