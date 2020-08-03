export default {
    Name: {
      name: 'Name',
      field: 'Name',
      type: 'static',
      match: 'regex',
      values: [
        'ftp',
        'image',
        'loghost',
        'minion',
        'rx',
        'sql',
        'tx',
        'workhorse'
      ],
      includeEmptyDefaultValue: true,
      currentValue: ''
    },
    Environment: {
      name: 'Environment',
      field: 'Environment',
      type: 'static',
      match: 'exact',
      values: [ 'dev', 'qa', 'prod' ],
      includeEmptyDefaultValue: true,
      currentValue: ''
    },
    StateName: {
      name: 'State Name',
      field: 'StateName',
      type: 'static',
      match: 'exact',
      values: [ 'running', 'stopped', 'terminated' ],
      includeEmptyDefaultValue: true,
      currentValue: ''
    },
    Platform: {
      name: 'Platform',
      field: 'Platform',
      type: 'static',
      match: 'exact',
      values: [ 'windows' ],
      includeEmptyDefaultValue: true,
      currentValue: ''
    },
    ImageId: {
      name: 'Image Id',
      field: 'ImageId',
      type: 'dynamic',
      match: 'exact',
      values: [],
      includeEmptyDefaultValue: true,
      currentValue: ''
    },
    InstanceType: {
      name: 'Instance Type',
      field: 'InstanceType',
      type: 'dynamic',
      match: 'exact',
      values: [],
      includeEmptyDefaultValue: true,
      currentValue: ''
    },
    Regions: {
      name: 'Regions',
      field: 'Regions',
      type: 'static',
      match: 'exact',
      values: [
        'eu-west-1',
        'us-east-1',
        'us-west-1',
        'us-west-2',
        'ap-southeast-1',
        'ap-southeast-2',
        'ap-northeast-1',
        'sa-east-1'
      ],
      includeEmptyDefaultValue: false,
      currentValue: ''
    }
  };