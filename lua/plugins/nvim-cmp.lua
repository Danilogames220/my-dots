return {
	"hrsh7th/nvim-cmp",
	event = {"InsertEnter", "CmdlineEnter"},
	dependencies = {
		"hrsh7th/cmp-buffer",
		"hrsh7th/cmp-path",
		{
			"L3MON4D3/LuaSnip",
			version = "v2.*",
			build = "make install_jsregexp",
		},
		"saadparwaiz1/cmp_luasnip",
		"rafamadriz/friendly-snippets",

		"hrsh7th/cmp-cmdline", -- command line completion
	},

	opt = {
		clangd = {
			cmd = {"clangd", "--header-insertion=never"},
		}
	},

	config = function()
		local cmp = require("cmp")

		local luasnip = require("luasnip")

		-- loads vscode style snippets from installed plugins (e.g. friendly-snippets)
    		require("luasnip.loaders.from_vscode").lazy_load()


		cmp.setup({
      			snippet = { -- configure how nvim-cmp interacts with snippet engine
        			expand = function(args)
          				luasnip.lsp_expand(args.body)
        			end,
      			},

      			mapping = cmp.mapping.preset.insert({
        			["<C-k>"] = cmp.mapping.select_prev_item(), -- previous suggestion
        			["<C-j>"] = cmp.mapping.select_next_item(), -- next suggestion
        			["<C-b>"] = cmp.mapping.scroll_docs(-4),
        			--["<C-f>"] = cmp.mapping.scroll_docs(4),
        			["<C-Space>"] = cmp.mapping.complete(), -- show completion suggestions
        			--["<C-e>"] = cmp.mapping.abort(), -- close completion window
				["<C-e>"] = cmp.mapping({
				i = function()
					if cmp.visible() then
						cmp.abort()
						require("config.others").toggle_completion()
					else
						--cmp.complete()
						require("config.others").toggle_completion()
					end
				end,
				}),
        			
				["<CR>"] = cmp.mapping.confirm({ select = false }),
        			--["<Tab>"] = cmp.mapping.confirm({ select = true }),
      			}),
      
			-- sources for autocompletion
      			sources = cmp.config.sources({
        			{ name = "nvim_lsp" },
        			{ name = "luasnip" }, -- snippets
        			{ name = "buffer" }, -- text within current buffer
        			{ name = "path" }, -- file system paths
      			}),


			completion = {
    				completeopt = 'menu,menuone,noinsert'
  			}
			--preselect = cmp.PreselectMode.None,

    		})
		
		-- `:` cmdline setup.
    		cmp.setup.cmdline(':', {
      	                mapping = cmp.mapping.preset.cmdline({
				['<C-j>'] = cmp.mapping({
    					c = function(fallback)
        					if cmp.visible() then
            						return cmp.select_next_item()
        					end

        					fallback()
    					end,
				}),
				['<C-k>'] = cmp.mapping({
    					c = function(fallback)
        					if cmp.visible() then
            						return cmp.select_prev_item()
        					end

        					fallback()
    					end,
				}),

          			["<Tab>"] = {
            				c = cmp.mapping.confirm({ select = false }),
          			},
        		}),
	

			sources = cmp.config.sources({
        			{ name = 'path' }
     			}, {
        			{ name = 'cmdline',
          				option = {
            					ignore_cmds = { 'Man', '!' }
          				}
        			}
      			}),

			completion = {
    				completeopt = 'menu,menuone,noinsert'
  			},


    		})	

	end,
}
