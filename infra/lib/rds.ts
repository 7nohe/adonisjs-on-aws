import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

interface RdsProps {
  vpc: ec2.Vpc
  rdsSecurityGroup: ec2.SecurityGroup
  subnetGroupName: string
}

export class Rds extends Construct {
  readonly databaseName = 'adonisjs'
  readonly databaseCluster: rds.DatabaseCluster

  constructor(scope: Construct, id: string, props: RdsProps) {
    super(scope, id)

    const { vpc, rdsSecurityGroup, subnetGroupName } = props

    // Create a secret for the RDS credentials
    const rdsCredentials = rds.Credentials.fromGeneratedSecret(
      'AppRunnerUser',
      { secretName: 'RDSSecret' }
    )

    this.databaseCluster = new rds.DatabaseCluster(
      scope,
      'DatabaseCluster',
      {
        engine: rds.DatabaseClusterEngine.auroraPostgres({
          version: rds.AuroraPostgresEngineVersion.VER_16_3,
        }),
        credentials: rdsCredentials,
        writer: rds.ClusterInstance.provisioned('writer', {
          instanceType: ec2.InstanceType.of(
            ec2.InstanceClass.T3,
            ec2.InstanceSize.MEDIUM
          )
        }),
        readers: [
          rds.ClusterInstance.provisioned('reader', {
            instanceType: ec2.InstanceType.of(
              ec2.InstanceClass.T3,
              ec2.InstanceSize.MEDIUM
            )
          }),
        ],
        vpc,
        vpcSubnets: vpc.selectSubnets({ subnetGroupName }),
        securityGroups: [rdsSecurityGroup],
        defaultDatabaseName: this.databaseName,
      }
    )
  }
}
