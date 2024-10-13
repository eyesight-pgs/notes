# AWS Policy

Sample:
```json
{
  "Version": "2024-10-13", // policy version
  "Id": "S3-account-permissions", // policy id
  "Statement": [ // could be multiple
    {
      "Sid": "1", // statement id, optional
      "Effect": "Allow", // Allow / Deny
      "Principal": { // user
        "AWS": "arn:aws:iam::123456789012:root",
      }
      "Action": [
        "s3:GetObject",
        "s3":PutObject"
      ],
      "Recource": [
        "arn:aws:s3::mybucket/*"
      ]
    }
  ]
}
```
