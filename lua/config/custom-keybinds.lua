vim.keymap.set('n', '<c-f>', function() return ':e ' .. vim.fn.expand '%:p:h' .. '/' end, { expr = true }) -- open file explorer
