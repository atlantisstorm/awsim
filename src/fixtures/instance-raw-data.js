export default {
  Monitoring: { State: 'disabled' },
  PublicDnsName: 'ec2-54-42-117-131.eu-west-1.compute.amazonaws.com',
  State: { Code: 16, Name: 'running' },
  LaunchTime: '2019-08-14T14:08:39.000Z',
  PublicIpAddress: '54.42.117.131',
  PrivateIpAddress: '192.168.34.117',
  ProductCodes: [],
  InstanceId: 'i-07ae1e2a36d2b88bf',
  ImageId: 'ami-5442e32fd1ababf88',
  PrivateDnsName: 'ip-192-168-34-117.eu-west-1.compute.internal',
  SecurityGroups: [
    { GroupName: 'default', GroupId: 'sg-6d6b6e09' },
    { GroupName: 'dev_admin_access', GroupId: 'sg-aa7570ce' }
  ],
  InstanceType: 't2.micro',
  NetworkInterfaces: [
    {
      Status: 'in-use',
      MacAddress: '54:42:89:91:2f:bc',
      SourceDestCheck: true,
      VpcId: 'vpc-1ecfc27b',
      Description: 'this is the primary network interface',
      NetworkInterfaceId: 'eni-54429ac82af7b95b3',
      PrivateDnsName: 'ip-192-168-34-117.eu-west-1.compute.internal',
      Ipv6Addresses: [],
      OwnerId: '544218388433',
      PrivateIpAddress: '192.168.34.117',
      SubnetId: 'subnet-08544b7f',
    }
  ],
  SourceDestCheck: true,
  Hypervisor: 'xen',
  Architecture: 'x86_64',
  RootDeviceType: 'ebs',
  IamInstanceProfile: {
    Id: 'AIPAIZTNPCWQKKACIBK6C',
    Arn: 'arn:aws:iam::544218388433:instance-profile/dev-instance-role-instance-profile'
  },
  RootDeviceName: '/dev/sda1',
  VirtualizationType: 'hvm',
  Tags: [
    { Value: 'atlantisstorm', Key: 'BusinessUnits' },
    { Value: 'user4@atlantisstorm.com', Key: 'CreatorName' },
    { Value: 'alerts@atlantisstorm.com', Key: 'Team' },
    { Value: 'dev', Key: 'Environment' },
    { Value: '5442', Key: 'CostCenter' },
    { Value: 'as_platform', Key: 'Application' },
    { Value: 'ftp-dev.awsbox.es', Key: 'Name' },
    { Value: 'alerts@atlantisstorm.com', Key: 'Owner' }
  ],
  HibernationOptions: { Configured: false },
  AmiLaunchIndex: 0
};