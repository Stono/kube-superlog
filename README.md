# kube-superlog
Does your kubernetes cluster have lots of instances of pods like this?:

```
$ kubectl get pods --namespace=thoughtdata
NAME                               READY     STATUS    RESTARTS   AGE
NAME                           READY     STATUS    RESTARTS   AGE
dashboard-1154738117-d78t5     1/1       Running   0          19h
dashboard-1154738117-h7w2m     1/1       Running   0          19h
distribution-914390011-mcj7t   1/1       Running   0          1d
distribution-914390011-v3s0h   1/1       Running   0          1d
gateway-1663823869-dplrz       1/1       Running   0          1d
gateway-1663823869-xcl0m       1/1       Running   0          1d
lambda-api-1230258314-zc9qc    1/1       Running   0          6d
nginx-3556664046-27rjd         2/2       Running   0          21h
nginx-3556664046-9vs1s         2/2       Running   0          21h
pshr-api-0                     1/1       Running   0          13h
rabbitmq-0                     1/1       Running   0          1d
rabbitmq-1                     1/1       Running   0          1d
rabbitmq-2                     1/1       Running   0          1d
rabbitmq-3                     1/1       Running   0          1d
redis-0                        2/2       Running   0          6d
redis-1                        2/2       Running   0          6d
redis-2                        2/2       Running   0          6d
redis-3                        2/2       Running   0          6d
```

What if you wanted to tail stream all the logs from your dashboard, distribution and gateway applications at the same time as they're an interacting collection of microservices?

Well now you can, with kube-superlog.

Simply do `npm install -g kube-superlog` and off you go.

```
$ kube-superlog --namespace thoughtdata --label app=dashboard --label app=distribution --label app=gateway
  superlog Welcome to kube-superlog +0ms
  superlog Logging for namespace=thoughtdata +3ms
  superlog Logging the following labels: +0ms
  superlog  - app=dashboard +1ms
  superlog  - app=distribution +0ms
  superlog  - app=gateway +0ms
  superlog Please wait, loading pod list. +32ms
  superlog:exec kubectl --namespace=thoughtdata get pods -l app=dashboard --no-headers -o json +1ms
  superlog:exec kubectl --namespace=thoughtdata get pods -l app=distribution --no-headers -o json +2ms
  superlog:exec kubectl --namespace=thoughtdata get pods -l app=gateway --no-headers -o json +0ms
  superlog 6 pods found. +290ms
  superlog please wait, starting log trail... +0ms
  superlog:exec kubectl --namespace=thoughtdata logs --tail=1 --follow distribution-914390011-mcj7t +1ms
  superlog:exec kubectl --namespace=thoughtdata logs --tail=1 --follow distribution-914390011-v3s0h +0ms
  superlog:exec kubectl --namespace=thoughtdata logs --tail=1 --follow dashboard-1154738117-d78t5 +0ms
  superlog:exec kubectl --namespace=thoughtdata logs --tail=1 --follow dashboard-1154738117-h7w2m +0ms
  superlog:exec kubectl --namespace=thoughtdata logs --tail=1 --follow gateway-1663823869-dplrz +0ms
  superlog:exec kubectl --namespace=thoughtdata logs --tail=1 --follow gateway-1663823869-xcl0m +0ms
  dashboard-1154738117-h7w2m   Thu, 27 Jul 2017 10:50:38 GMT ioredis:redis write command[0] -> ltrim(td:dashboard:logs,0,199) +449ms
  distribution-914390011-mcj7t   id: '157ff133-8fb4-439f-af33-829eab2458e8' } +1ms
  distribution-914390011-v3s0h   id: '157ff133-8fb4-439f-af33-829eab2458e8' } +0ms
  gateway-1663823869-dplrz     Thu, 27 Jul 2017 10:50:38 GMT td:core:amqp:channel td.rpc.replyTo.BkgLtSHwIb deleting queue +1ms
  gateway-1663823869-xcl0m     Thu, 27 Jul 2017 10:50:38 GMT td:core:amqp:channel -> channel/gateway.reload via td.publish.fanout {} +0ms
  dashboard-1154738117-d78t5     id: '157ff133-8fb4-439f-af33-829eab2458e8' } +1ms
```

Options are:
```
$ kube-superlog --help

  Usage: kube-superlog [options]


  Options:

    -V, --version                 output the version number
    -l, --label [your-pod-label]  filter pods by label in an OR manner
    -n, --namespace [default]     use a namespace other than default
    -h, --help                    output usage information
```

## Known Issues
Currently only works when you have a single contianer in a pod.  If your pod contains multiple containers it'll show an error.  Future versions will show logs from all containers in the pod.
