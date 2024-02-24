# assembly

nasm - Netwide Assembler

yasm - Yet Another Assembler

---

AX - 16 bit

EAX - 32 bit

AH, AL - 8 bit each

---

Diagram which shows the register size
```txt
  31          16 15          8 7            0
+--------------+--------------+--------------+
|           EAX (32 bits)                    |
+--------------+--------------+--------------+
       |              |              |
       |              |              |
       |              |              +----- AL (8 bits)
       |              +-------------------- AH (8 bits)
       +------------------------------------ AX (16 bits)

```

## working with yasm

source main.asm
```asm
section .text
  global _start
_start:
  mov rax, 60
  mov rdi, 42
  syscall
```

generate object file - `yasm -felf64 main.asm` - this will generate `main.o`

generate executable file - `ld main.o -o main -e _start` - this will generate `main`

generate executable file can be run as `./main`

---

Linux system call table: https://chromium.googlesource.com/chromiumos/docs/+/master/constants/syscalls.md

comments: use `#` symbol to comment. any text after # is a comment





