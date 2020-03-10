# Yocto-CFA

**[Leandro Facchinetti](https://www.leafac.com)’s dissertation**

[**Dissertation**](dissertation/yocto-cfa.pdf) • [**Source**](https://github.com/leafac/yocto-cfa) • ![.github/workflows/main.yml](https://github.com/leafac/www.leafac.com/workflows/.github/workflows/main.yml/badge.svg)

# Dissertation

## Build

Install [LaTeX](https://www.latex-project.org) and [Node.js](https://nodejs.org/), and run:

```console
$ (cd dissertation && npm install && latexmk)
```

The dissertation will be at `dissertation/yocto-cfa.pdf`.

## Edit Images

The images in the dissertation are drawn with [macOS Keynote](https://www.apple.com/keynote/). Edit them, export as a PDF called `dissertation/images.pdf`, and run:

```console
$ (cd dissertation && pdfcrop images.pdf images.pdf)
```

Then build the dissertation again (see [§ Build](#build)).

# Code

## Run Tests

Install [Node.js](https://nodejs.org/) and run:

```console
$ (cd code && npm install && npm test)
```
