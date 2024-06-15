# c programming language


## creating a share object (.so) library
compiling: `gcc -Wall -shared -fPIC libmath.c -o libmath.so`

## using a library

compiling:
```bash
export LD_LIBRARY_PATH=${LD_LIBRARY_PATH}:./src
gcc -Wall -I./include -L./src -lmath tests/test_libmath.c -o tests/test_libmath
```

