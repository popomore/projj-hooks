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

```json
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

Add `user.name` and `user.email` for git config

options

```json
{
  "hooks": {
    "git_config_user": "git_config_user"
  },
  "git_config_user": {
    "github.com": {
      "name": "your name",
      "email": "your email"
    }
  }
}
```


### atom-project

## License

[MIT](LICENSE)
