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
    "clean": "projj_clean"
  },
  "clean": {
    "node_modules": true,
    "git": true
  }
}
```

### git_config_user

Add `user.name`, `user.email` and `user.signingkey` for git config

options

```json
{
  "hooks": {
    "git_config_user": "projj_git_config_user"
  },
  "git_config_user": {
    "github.com": {
      "name": "your name",
      "email": "your email",
      "signingkey": "your signingkey"
    }
  }
}
```

### atom_project

Hook for [atom project](https://github.com/danielbrodin/atom-project-manager)

It will generate `projects.cson` from all projj repositories.

options

```json
{
  "hooks": {
    "atom_project": "projj_atom_project"
  },
  "atom_project": {
    "setting": "/path/to/projects.cson"
  }
}
```

### dirty

Check git repository whether dirty or not.

options

```json
{
  "hooks": {
    "dirty": "projj_dirty"
  }
}
```

### vscode_project_manager

Hook for [vscode-project-manager](https://github.com/alefragnani/vscode-project-manager)

It will generate `projects.json` from all projj repositories.

```json
{
  "hooks": {
    "vscode_project_manager": "projj_vscode_project_manager"
  },
  "atom_project": {
    "setting": "/path/to/projects.json"
  }
}
```

## License

[MIT](LICENSE)
