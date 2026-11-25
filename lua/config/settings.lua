-- vim style configs at vim-config.lua

---------- VIM STYLE CONFIGS -----------
vim.cmd([[
	colorscheme flexoki-dark

	set number relativenumber
	"set virtualedit=onemore

	set tabstop=8
	set shiftwidth=8
	"set softtabstop=8
	set expandtab
	"set smarttab
]])

---------- COLORSCHEME --------
-- transparent bg
vim.api.nvim_set_hl(0, 'Normal', { bg = 'none' })
--vim.api.nvim_set_hl(0, 'NormalFloat', { bg = 'none' })
vim.api.nvim_set_hl(0, 'FloatBorder', { bg = 'none' })
vim.api.nvim_set_hl(0, 'Pmenu', { bg = 'none' })


---------- KEYMAPS ---------
-- Open file explorer 
vim.keymap.set(
	'n', 
	'<c-f>', 
	function()
		vim.cmd("Oil");
	end
) 
vim.keymap.set(
	'n', 
	'<c-h>', 
	function()
		vim.cmd("Make")
	end
) 
vim.keymap.set(
	'n', 
	'<c-n>', 
	function()
		vim.diagnostic.open_float()
		--vim.cmd("Make")
	end
) 
---------- FILE SETTINGS ----------
-- Settings for all files
vim.api.nvim_create_autocmd('FileType', {
	callback = function(args)
		-- No automatic indenting
		vim.o.indentexpr=""
	end

})

---------- CUSTOM COMMANDS ----------
local function auto_make()
	vim.cmd("w |!make");
end
vim.api.nvim_create_user_command(
	'Make',             
	auto_make,
	{
		nargs = '*',             
		desc = 'Save file and run make',
	}
)
-- a way of loading formats to files
--[[
function hello()
	--local pos = vim.api.nvim_win_get_cursor(0)[2]
	--local line = vim.api.nvim_get_current_line()
	--local nline = line:sub(0, pos) .. 'hello' .. line:sub(pos + 1)

	--vim.api.nvim_set_current_line("line\n\n")
	vim.api.nvim_buf_set_lines(0, 0, 0, false, {"line 1", "line 2"})
end
]]
