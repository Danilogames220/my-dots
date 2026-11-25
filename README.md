# My neovim setup
**Last updated:** 25/11/2026 (dd/mm/yy);

How i like my [neovim](https://neovim.io/) 

## About
I like my neovim pretty vanilla, so i dont have much stuff that changes the interface, and i like to keep it as a text editor instead of a full IDE.

## Plugins
**Plugin manager:** [lazy.nvim](https://github.com/folke/lazy.nvim)\
**Color scheme:** [Flexoki (dark)](https://github.com/kepano/flexoki-neovim)
- [LuaSnip](https://github.com/L3MON4D3/LuaSnip)
- [nvim-cmp](https://github.com/hrsh7th/nvim-cmp)
- [conform.nvim](https://github.com/stevearc/conform.nvim)
- [dressing.nvim](https://github.com/stevearc/dressing.nvim)
- [mason.nvim](https://github.com/mason-org/mason.nvim)
- [nvim-lspconfig](https://github.com/neovim/nvim-lspconfig)
- [telescope.nvim](https://github.com/nvim-telescope/telescope.nvim)
- [oil.nvim](https://github.com/stevearc/oil.nvim)
- [haskell-tools.nvim](https://github.com/mrcjkb/haskell-tools.nvim)

## Custom keybinds
### Normal mode
- **\<C-f\>:** Open/close Oil (file manager)
- **\<C-h\>:** Save buffer and run `make`
- **\<C-n\>:** Show diagnostics popup

### Insert mode
- **\<C-e\>:** Toggle completion suggestions


## Required packages
### Required by the LSP
- python
- python-pip
- java
- javac
- ruby (rubygems)
- cargo (rust)
- luarocks (lua) 
- go

### Required by other pluggins 
- any nerd font (oil.nvim)

# Changelog

25/11/2026

- Added the pluggin `haskell-tools.nvim` 
- Added the custom keybinds
- Some changes in the `README.md`




