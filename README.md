# Projj-hooks

Hooks for [Projj](https://github.com/popomore/projj)

## Usage

```bash
$ npm i projj-hooks -g
```

Config it in [hooks](#Hooks)

```json
{
  "hooks": {
    "clean": "clean"
  }
}
```

## Hooks

### clean

Clean node_modules and ignored git files.

default options

```js
{
  "hooks": {
    "clean": "clean"
  },
  "clean": {
    "node_modules": true,
    "git": true
  }
}
```

### git_config_user

### atom-project

## License

[MIT](LICENSE)
