1. Add as submodule in your OpenSCAD project (target repository)

```sh
git submodule add https://github.com/IOIO72/openscad-parameter-set-generator.git
```

```sh
git submodule update --init
```

2. Execute in target repository

```sh
./openscad-parameter-set-generator/run.sh file.scad file.json
```
