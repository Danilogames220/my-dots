return {
	{
		"mason-org/mason-lspconfig.nvim",
		opts = {
			-- list of servers for mason to install
			ensure_installed = {
				"lua_ls",
				"pyright",

				"clangd",
				--"harper_ls",
				"neocmake",

				"html",
				"ts_ls",
				"cssls",
			},
		},
		dependencies = {
			{
				"mason-org/mason.nvim",
				dependencies = { "WhoIsSethDaniel/mason-tool-installer", },

				opts = {
					ui = {
						icons = {
							package_installed = "✓",
							package_pending = "➜",
							package_uninstalled = "✗",
						},
					},
				},
			},
			"neovim/nvim-lspconfig",
		},
	},
}
