import config from './data/config.json';

export const compare = (fieldName, order) => {
  return function(a,b){
    const fieldValueA = a[fieldName].toLowerCase();
    const fieldValueB = b[fieldName].toLowerCase();
    
    let comparison = 0;
    if (fieldValueA > fieldValueB) {
      comparison = 1;
    } else if (fieldValueA < fieldValueB) {
      comparison = -1;
    }
    return order === "desc" ? (comparison * -1) : comparison;
  };
}
export const extractDynamicFilterValues = ({ filterField, instances }) => {
  let values = [];
  let filterSeen = {};
  for (let j in instances.sort(compare(filterField, "asc"))) {
    const fieldValue = instances[j][filterField];
    if (!filterSeen[fieldValue]) {
      values.push(fieldValue);
      filterSeen[fieldValue] = true;
    }
  }
  return values;
}

export const extractInstances = (data) => {
  const Instances = [];

  for (let i = 0; i < data.Reservations.length; i++) {
    const instances = data.Reservations[i].Instances;
    for (let j= 0; j < instances.length; j++ ) {
      const instData = instances[j];
      const Instance = {};

      Instance.Name = "";
      Instance.Environment = "";
      Instance.AutoScalingGroupName = "";

      for (let k = 0; k < instData.Tags.length; k++) {
        const Tag = instData.Tags[k];

        if (Tag.Key === "Name") {
          Instance.Name = Tag.Value;;
        }
        else if (Tag.Key === "Environment") {
          Instance.Environment = Tag.Value;
        }
        else if (Tag.Key === "aws:autoscaling:groupName") {
          Instance.AutoScalingGroupName = Tag.Value;
        }
      }

      Instance.StateName        = instData.State.Name || "";
      Instance.Platform         = instData.Platform || "";
      Instance.PublicIpAddress  = instData.PublicIpAddress || "";
      Instance.PrivateIpAddress = instData.PrivateIpAddress || "";
      Instance.InstanceId       = instData.InstanceId || "";
      Instance.ImageId          = instData.ImageId || "";
      Instance.InstanceType     = instData.InstanceType || "";

      // Convert launch time to yyyy-mm-dd hh:mm:ss format.
      Instance.LaunchTime       = instData.LaunchTime || "";
      const date = new Date(Instance.LaunchTime);
      Instance.LaunchTime = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+),\s+(\d{2}:\d{2}:\d{2})/, '$3-$2-$1 $4');

      Instance._data = instData;
      Instances.push(Instance);
    }
  }

  return Instances;
}

// get original raw data.
export const getInstanceRawData = (instances, instance_id) => {
  let data = {};
  for (let idx in instances) {
    const instance = instances[idx];
    if (instance.InstanceId === instance_id) {
      data = instance._data;
      break;
    }
  }

  return data;
}

export const initFilters = () => {
  const filtersArray = config.filters;
  let filters = {};
  filtersArray.map((filter) => {
    filters[filter.field] = { ...filter, currentValue: "" };
  });
  return filters;
}

export const launchRemoteSession = (ip_address, targetPlatform) => {
  if (!(ip_address.length > 0)) {
    return false; // No ip address supplied, can happen when instance is not running.
  }

  let { cmd, errMsg } = buildRemoteSessionCmd(process.platform, targetPlatform, config.username, ip_address);

  if (errMsg) {
    alert(errMsg);
    return;
  }

  if (cmd.length > 0) {
    const child = require('child_process');
    child.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.log(`node couldn't execute ${cmd}, err==`, err);
        return;
      }

      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }
}

export const buildRemoteSessionCmd = (thisPlatform, targetPlatform, username, ip_address) => {
  let cmd = "";
  let errMsg = "";
  if (!thisPlatform || !ip_address || !username) {
    errMsg = "You must supply all options!";
    return { errMsg };
  }

  if (!thisPlatform.match(/^(darwin|linux|win32)$/)) {
    errMsg = `Don't know how to build remote session for ${thisPlatform}`;
    return { errMsg };
  }

  if (!targetPlatform.match(/^(windows|)$/)) {
    errMsg = `Don't know how to build remote session for target platform ${targetPlatform}`;
    return { errMsg };
  }

  if (thisPlatform === "darwin") {
    const atc = `/tmp/awsim.terminal.command`;

    if (targetPlatform === 'windows') {
      const msRemoteDesktop = "\"/Applications/Microsoft\ Remote\ Desktop.app\"";
      const port = 3389;
      const address = `rdp://full address=s:${ip_address}:${port}`;
      const width = "desktopwidth:i:1024";
      const height = "desktopheight:i:768";
      const audio = "audiomode=i:0";
      const theme = "disable themes=i:1";
      const prompt = "prompt for credentials on client:i:0";
      cmd = `open -n -F -a ${msRemoteDesktop} "${address}&${audio}&${theme}&${width}&${height}&${prompt}"`;
    } else {
      cmd =
      `echo '#!/bin/bash' > ${atc};` +
      `echo 'ssh ${username}@${ip_address}' >> ${atc};` +
      `chmod 755 ${atc};` +
      `open -a Terminal -F ${atc}`;
    }
  }
  else if (thisPlatform === "linux") {
    const atc = `/tmp/awsim.terminal.command`;

    if (targetPlatform === 'windows') {
      // TODO
      errMsg = `Emmm..., sorry, no idea how to launch remote windows connection on ${platform}! :( )`;
    } else {
      cmd =
      `echo '#!/bin/bash' > ${atc};` +
      `echo 'ssh ${username}@${ip_address}' >> ${atc};` +
      `chmod 755 ${atc};` +
      `gnome-terminal -- ${atc}`;
    }
  }
  else if (thisPlatform === "win32") {
    if (targetPlatform === 'windows') {
      const width = 1024;
      const height = 768;
      cmd = `mstsc /v:${ip_address} /h:${height} /w:${width}`;
    }
    else {
      cmd = `start ssh ${username}@${ip_address}`;
    }
  }
  else {
    errMsg = `Emmm..., sorry, no idea how to launch remote connection on ${platform}! :( )`;
  }

  return { cmd, errMsg };
}

export const setSort = (fieldValue, orderValue) => {
  return {
    field: fieldValue,
    order: orderValue
  };
}