# vicuna + llama.cpp

This allows us to run a model in local.. ask a question and get reply back.

## steps

- install `llama.cpp`
```sh
git clone https://github.com/ggerganov/llama.cpp.git
cd llama.cpp
make
# at this point you have executable `main` in the current directory
```
- download model
    - link: https://huggingface.co/vicuna/ggml-vicuna-7b-1.1/tree/main
        - here download `ggml-vic7b-q5_1.bin` / `ggml-vic7b-uncensored-q5_1.bin`
    - YT video: https://www.youtube.com/watch?v=vNHjeQxNuS0

- run: `./main --color --model <path to model> --prompt "<question>"`

