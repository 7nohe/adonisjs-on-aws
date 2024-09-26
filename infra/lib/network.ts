import * as ec2 from 'aws-cdk-lib/aws-ec2'
import { Construct } from 'constructs'

export class Network extends Construct {
  readonly vpc: ec2.Vpc
  readonly rdsSecurityGroup: ec2.SecurityGroup
  readonly appRunnerSecurityGroup: ec2.SecurityGroup
  readonly privateSubnetName = 'Private'

  constructor(scope: Construct, id: string) {
    super(scope, id)

    this.vpc = new ec2.Vpc(this, 'AppRunnerVPC', {
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: this.privateSubnetName,
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
      ],
    })

    // Security Group for App Runner
    this.appRunnerSecurityGroup = new ec2.SecurityGroup(this, 'AppRunnerSecurityGroup', {
      securityGroupName: 'adonisjs-app-runner-sg',
      vpc: this.vpc,
    })

    // Security Group for RDS
    this.rdsSecurityGroup = new ec2.SecurityGroup(this, 'RDSSecurityGroup', {
      allowAllOutbound: true,
      securityGroupName: 'adonisjs-rds-sg',
      vpc: this.vpc,
    })

    // Allow App Runner to connect to RDS
    this.rdsSecurityGroup.addIngressRule(this.appRunnerSecurityGroup, ec2.Port.tcp(5432))
  }
}
