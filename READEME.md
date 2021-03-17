#Documentation

https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops

## Build Extension

```
tfx extension create --manifest-globs vss-extension.json
```

## Build Extension

Login to Azure DevOps to generate a personal access token

```
tfx extension publish --publisher AmericanAirlines --share-with AADevTest --vsix AmericanAirlines.tot-look-ahead-update-task-0.0.2.vsix  --token <token>
```
