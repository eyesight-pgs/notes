# serverless

## documentation

link: https://www.serverless.com/framework/docs


## how to deploy serverless from local

```sh
serverless deploy --stage dev
```

## Two deployments simultaneously is not possible in two terminals

because both deployment commands will read and write to same .serverless folder

## Running serverless offline in local

```sh
serverless offline --stage=dev
```

## troubleshooting

About 90% of the failures occures due to wrong NodeJs version.
