import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as assets from 'aws-cdk-lib/aws-ecr-assets'
import { AppRunner } from './app-runner'
import { Network } from './network'
import { Rds } from './rds'
import { ECRDeployment, DockerImageName } from 'cdk-ecr-deployment'

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const repository = new ecr.Repository(this, 'AdonisJSAppRunnerRepository', {
      lifecycleRules: [
        {
          tagStatus: ecr.TagStatus.ANY,
          description: 'Keep only the 10 most recent images',
          maxImageCount: 10,
        },
      ],
    })

    const { vpc, rdsSecurityGroup, appRunnerSecurityGroup, privateSubnetName } = new Network(
      this,
      'Network'
    )

    const { databaseName, databaseCluster } = new Rds(this, 'Rds', {
      vpc,
      rdsSecurityGroup,
      privateSubnetName,
    })

    const dockerImageAsset = new assets.DockerImageAsset(this, 'AdonisJSDockerImage', {
      directory: '../',
      exclude: ['infra/cdk.out', 'node_modules', 'infra/node_modules'],
      platform: assets.Platform.LINUX_AMD64,
    })

    new ECRDeployment(this, 'DeployDockerImage', {
      src: new DockerImageName(dockerImageAsset.imageUri),
      dest: new DockerImageName(`${repository.repositoryUri}:latest`),
    })

    new AppRunner(this, 'AppRunner', {
      repository,
      databaseName,
      databaseCluster,
      appRunnerSecurityGroup,
      privateSubnetName,
      vpc,
    })
  }
}
