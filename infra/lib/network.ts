import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class Network extends Construct {
  readonly vpc: ec2.Vpc
  readonly rdsSecurityGroup: ec2.SecurityGroup
  readonly subnetGroupName = 'DB'

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.vpc = new ec2.Vpc(this, 'VPC', {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: this.subnetGroupName,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        }
      ]
    })

    // Security Group for App Runner
    const AppRunnerSecurityGroup = new ec2.SecurityGroup(
      this,
      'AppRunnerSecurityGroup',
      {
        securityGroupName: 'adonisjs-app-runner-sg',
        vpc: this.vpc,
      }
    )

    // Security Group for RDS
    this.rdsSecurityGroup = new ec2.SecurityGroup(this, 'RDSSecurityGroup', {
      allowAllOutbound: true,
      securityGroupName: 'adonisjs-rds-sg',
      vpc: this.vpc,
    })

    // Allow App Runner to connect to RDS
    this.rdsSecurityGroup.addIngressRule(
      AppRunnerSecurityGroup,
      ec2.Port.tcp(5432)
    )
  }
}
