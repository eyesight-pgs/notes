# workflow (cloud functions)



```bash
# deploy
gcloud functions deploy fib \
  --runtime=nodejs18 \
  --entry-point fib \
  --trigger-http

# view details of workflow
gcloud functions describe fib

```











