# VIM-NVIM

## to upper case, to lower case

Go to visual mode (v), then select text, then press `U` for uppercase, press `u` for lowercase.

## plugin

Installing vim-plug: [vim-plug-github](https://github.com/junegunn/vim-plug)

## macro

```txt
qd 	start recording to register d
... 	your complex series of commands
q 	stop recording
@d 	execute your macro
@@ 	execute your macro again
```

## scroll without moving cursor

```txt
z t ...or... z enter --> moves current line to top of screen
z z ...or... z . --> moves current line to center of screen
z b ...or... z - --> moves current line to bottom
```

## scroll

https://stackoverflow.com/a/60607857/9077311

```txt
+-------------------------------+
^                               |
|c-e (keep cursor)              |
|H(igh)             zt (top)    |
|                   ^           |
|           ze      |      zs   |
|M(iddle)  zh/zH <--zz--> zl/zL |
|                   |           |
|                   v           |
|L(ow)              zb (bottom) |
|c-y (keep cursor)              |
v                               |
+-------------------------------+
```

## markers (bookmark)

```txt
 mk      - mark current position (can use a-z)
 'k      - move to mark k
 d'k     - delete from current position to mark k
 'a-z    - same file
 'A-Z    - between files
```

## editing in a stream

find . | vim -


## jump list, tag list

```txt
C-o for jump list
C-t for tag list
```

## using vimscript inside lua

```lua
local result = vim.api.nvim_exec(
[[
  " vim script here
  nmap <leader>mp <Plug>MarkdownPreviewToggle
]],
true)
```

