## Deployment

```bash
cd infra
cdk bootstrap
NO_PREBUILT_LAMBDA=1 cdk deploy
```

`NO_PREBUILT_LAMBDA=1` must be set to avoid the error of `Uploaded file must be a non-empty zip`.
https://github.com/cdklabs/cdk-ecr-deployment/issues/1017

Go to ECR and find the repository created by CDK.
Get the push command and push the image to the repository.

i.e.
```bash
# in the project root
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin xxxxx.dkr.ecr.ap-northeast-1.amazonaws.com
docker build --platform linux/amd64 -t [TAG_NAME] .
docker tag [TAG_NAME]:latest xxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/[TAG_NAME]:latest
docker push xxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/[TAG_NAME]:latest
```

After pushing the image, you can find the image in the ECR repository.

