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
 m<a-zA-Z>      - save mark
 '<a-zA-Z>      - move to mark
 d'<a-zA-Z>     - delete from current position to mark <a-zA-Z>
```

`a-z` works within single file, where as `A-Z` works between files

## editing in a stream

find . | vim -


## jump list, tag list

```txt
C-o for jump list
C-t for tag list
```

## jump to the next word as of current

`*` is used to jump to the next matching word as of current word under the
cursor. Followed by `n` will move the cursor to next matching word (`N` for
opposite direction).

## using vimscript inside lua

```lua
local result = vim.api.nvim_exec(
[[
  " vim script here
  nmap <leader>mp <Plug>MarkdownPreviewToggle
]],
true)
```

## debugging

### debugging php

TLDR: install xdebug extension for php and configure it in `php.ini`.
in nvim, install vscode php debugger using mason and configure it to 
listen on port 9003.

php debuging setup is bit confusing to understand, so let take an example
to get more clarity. Let us say we have a php source code in `hello.php`.
and we can run this code using php executable like `php hello.php`.
So now understand how to debug `hello.php`. First step is we will open `hello.php`
in `nvim`. we will press `F5` (debug continue) which will start the "vscode php debugger".
This "vscode php debugger" will start listening on port `9003`. Now in any terminal, if
we run the php program like `php hello.php`, the `php` command will first load the
ini file (which we can locate by `php --ini`). This ini file has details related to
xdebug extension. It will start `xdebug`. xdebug will try to connect to "vscode php debugger"
using host and port provided in the ini file. "vscode php debugger" will accept the request
from xdebug. Now the `php` will starts executing the code in `hello.php` and stops when
it hits the breakpoint. Congratulations!! now you now how it works :) .

Here is detailed instruction to set it up:

- Install the xdebug using the instruction provided here: https://xdebug.org/wizard
- Add the following to the `php.ini` file (lotate ini file using `php --ini`)
  ```ini
  ; for debugging
  zend_extension=path/to/xdebug

  [Xdebug]
  xdebug.mode = debug
  xdebug.start_with_request = yes
  xdebug.remote_host=localhost
  ; it seems like xdebug use port 9003 even if provide port value as 9000
  xdebug.remote_port=9000
  xdebug.remote_enable=1
  ```
- Configure vscode php debugger (the debug adapter)
  ```lua
  dap.adapters.my_php_adapter = {
    type = 'executable',
    command = '/home/es/.local/share/nvim/mason/packages/php-debug-adapter/php-debug-adapter',
  }
  -- configure
  dap.configurations.php = {
    {
      type = 'my_php_adapter',
      request = 'launch',
      name = 'waiting for Xdebug to ping me',
      port = 9003
    }
  }
  ```

## missing features

- vscode like smart selection missing
  - vscode shortcuts:
  ```txt
  editor.action.smartSelect.expand
  editor.action.smartSelect.shrink
  ```
  - plugin `terryma/vim-expand-region` tries to implement this.
  But it is not smart enough to expand to function header after function body.


