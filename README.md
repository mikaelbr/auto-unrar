# [WIP] auto-unrar

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
