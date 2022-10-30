# k8s

## Copy /tmp/foo from a remote pod to /tmp/bar locally

`kubectl cp <some-namespace>/<some-pod>:/tmp/foo /tmp/bar`

## shell to a container

`kubectl exec -it pod_name /bin/bash`

## view events

`kubectl get events`

## view resource

`kubectl top pod -n namespace`

