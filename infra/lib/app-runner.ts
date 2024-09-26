import * as iam from 'aws-cdk-lib/aws-iam'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as apprunner from 'aws-cdk-lib/aws-apprunner'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as rds from 'aws-cdk-lib/aws-rds'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import { Construct } from 'constructs'

interface AppRunnerProps {
  repository: ecr.Repository
  databaseName: string
  databaseCluster: rds.DatabaseCluster
  vpc: ec2.Vpc
  appRunnerSecurityGroup: ec2.SecurityGroup
  privateSubnetName: string
}

const getValueFromSecret = (secret: secretsmanager.ISecret, key: string): string => {
  return secret.secretValueFromJson(key).unsafeUnwrap()
}

export class AppRunner extends Construct {
  constructor(scope: Construct, id: string, props: AppRunnerProps) {
    super(scope, id)

    const {
      repository,
      databaseName,
      databaseCluster,
      vpc,
      appRunnerSecurityGroup,
      privateSubnetName,
    } = props

    const instanceRole = new iam.Role(scope, 'AppRunnerInstanceRole', {
      assumedBy: new iam.ServicePrincipal('tasks.apprunner.amazonaws.com'),
    })

    const accessRole = new iam.Role(scope, 'AppRunnerAccessRole', {
      assumedBy: new iam.ServicePrincipal('build.apprunner.amazonaws.com'),
      managedPolicies: [
        // This policy is required to access the ECR repository
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSAppRunnerServicePolicyForECRAccess'
        ),
      ],
    })

    const vpcConnector = new apprunner.CfnVpcConnector(scope, 'AppRunnerVpcConnector', {
      subnets: vpc.selectSubnets({
        subnetGroupName: privateSubnetName,
      }).subnetIds,
      securityGroups: [appRunnerSecurityGroup.securityGroupId],
      vpcConnectorName: 'adonisjs-vpc-connector',
    })

    new apprunner.CfnService(this, 'AppRunnerService', {
      instanceConfiguration: {
        instanceRoleArn: instanceRole.roleArn,
      },
      networkConfiguration: {
        egressConfiguration: {
          egressType: 'VPC',
          vpcConnectorArn: vpcConnector.attrVpcConnectorArn,
        },
      },
      sourceConfiguration: {
        authenticationConfiguration: {
          accessRoleArn: accessRole.roleArn,
        },
        autoDeploymentsEnabled: true,
        imageRepository: {
          imageIdentifier: repository.repositoryUriForTag('latest'),
          imageRepositoryType: 'ECR',
          imageConfiguration: {
            port: '8080',
            runtimeEnvironmentVariables: [
              {
                name: 'DB_HOST',
                value: getValueFromSecret(databaseCluster.secret!, 'host'),
              },
              {
                name: 'DB_PORT',
                value: getValueFromSecret(databaseCluster.secret!, 'port'),
              },
              {
                name: 'DB_USER',
                value: getValueFromSecret(databaseCluster.secret!, 'username'),
              },
              {
                name: 'DB_PASSWORD',
                value: getValueFromSecret(databaseCluster.secret!, 'password'),
              },
              {
                name: 'DB_DATABASE',
                value: databaseName,
              },
              {
                name: 'APP_KEY',
                value: '7Lvw78JuzjT9BMO3Fw5Y7H5McDE9pddu',
              },
            ],
          },
        },
      },
    })
  }
}
