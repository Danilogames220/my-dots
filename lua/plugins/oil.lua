return {
  	'stevearc/oil.nvim',
  	---@module 'oil'
  	---@type oil.SetupOpts
  	opts = {},
  	-- Optional dependencies
  	dependencies = { 
		{ "nvim-mini/mini.icons", opts = {} },
		"benomahony/oil-git.nvim",
	},
	-- dependencies = { "nvim-tree/nvim-web-devicons" }, -- use if you prefer nvim-web-devicons
	-- Lazy loading is not recommended because it is very tricky to make it work correctly in all situations.
	lazy = false,

	config = function ()
		local oil = require("oil")

		oil.setup({
			delete_to_trash = true,

			win_options = {
				number = false,
				relativenumber = false,
				--winbar = "%!v:lua.get_oil_winbar()",
			},

			-- Set to false to disable all of the below keymaps
  			use_default_keymaps = true,
			keymaps = {
    				["g?"] = { "actions.show_help", mode = "n" },
				["<CR>"] = "actions.select",
    				["<C-s>"] = { "actions.select", opts = { vertical = true } },
    				["<C-h>"] = { "actions.select", opts = { horizontal = true } },
    				["<C-t>"] = { "actions.select", opts = { tab = true } },
    				["<C-p>"] = "actions.preview",
    				["<C-f>"] = { "actions.close", mode = "n" },
    				["<C-l>"] = "actions.refresh",
    				["-"] = { "actions.parent", mode = "n" },
    				["_"] = { "actions.open_cwd", mode = "n" },
    				["`"] = { "actions.cd", mode = "n" },
    				["g~"] = { "actions.cd", opts = { scope = "tab" }, mode = "n" },
    				["gs"] = { "actions.change_sort", mode = "n" },
    				["gx"] = "actions.open_external",
    				["g."] = { "actions.toggle_hidden", mode = "n" },
    				["g\\"] = { "actions.toggle_trash", mode = "n" },
  			},

			view_options = {
    				-- Show files and directories that start with "."
    				show_hidden = true,
    				-- This function defines what is considered a "hidden" file
    				is_hidden_file = function(name, bufnr)
      					local m = name:match("^%.")
      					return m ~= nil
    				end,
    				-- This function defines what will never be shown, even when `show_hidden` is set
    				is_always_hidden = function(name, bufnr)
      					return false
    				end,
    				-- Sort file names with numbers in a more intuitive order for humans.
    				-- Can be "fast", true, or false. "fast" will turn it off for large directories.
    				natural_order = "fast",
    				-- Sort file and directory names case insensitive
    				case_insensitive = false,
    				sort = {
      					-- sort order can be "asc" or "desc"
      					-- see :help oil-columns to see which columns are sortable
      					{ "type", "asc" },
      					{ "name", "asc" },
  				},
    				-- Customize the highlight group for the file name
    				highlight_filename = function(entry, is_hidden, is_link_target, is_link_orphan)
					--return "DiagnosticWarn"
					
					return nil -- use telescope to find highlight names
    				end,

				
  			},

			-- Extra arguments to pass to SCP when moving/copying files over SSH
  			extra_scp_args = {},
  			-- Extra arguments to pass to aws s3 when creating/deleting/moving/copying files using aws s3
  			extra_s3_args = {},
  			-- EXPERIMENTAL support for performing file operations with git
  			git = {
    				-- Return true to automatically git add/mv/rm files
    				add = function(path)
      					return false
    				end,
    				mv = function(src_path, dest_path)
      					return false
    				end,
    				rm = function(path)
      					return false
    				end,
  			},

		})
	end,
}
