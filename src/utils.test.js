import { 
  buildRemoteSessionCmd,
  compare,
  extractDynamicFilterValues,
  extractInstances,
  getInstanceRawData,
  initFilters,
  launchRemoteSession,
  setSort
} from './utils';
import rawInstancesData from './data/running.instances.json';
import expectedInstance from './fixtures/default-instance';
import expectedFilters from './fixtures/filters';
import expectedInstanceRawData from './fixtures/instance-raw-data';
import extractedInstances from './fixtures/extracted-instances';

describe('utils tests', () => {
  it('compare should perform as expected', () => {
    expect(compare).toBeInstanceOf(Function);

    const expectedSorted = [
      { 'name': 'jack' },      
      { 'name': 'joe' },      
      { 'name': 'john' }
    ];
    const data = [
      { 'name': 'john' },
      { 'name': 'joe' },
      { 'name': 'jack' }
    ];
    const dataSorted = data.concat().sort(compare('name', 'asc'));
    expect(dataSorted).toEqual(expectedSorted);
  });

  it('extractDynamicFilterValues should return expected values from instances', () => {
    expect(extractDynamicFilterValues).toBeInstanceOf(Function);

    const expectedValues = [
      "ami-5442061867f5bff4e",
      "ami-5442621417d9c502d",
      "ami-54426320e5fe48376",
      "ami-54426fc4f22b6dbda",
      "ami-5442773270f1dbc84",
      "ami-5442a46261de55fcc",
      "ami-5442a9d2d27a71bba",
      "ami-5442b4753027ae935",
      "ami-5442d1a288c950739",
      "ami-5442e32fd1aba0456",
      "ami-5442e32fd1aba61a6",
      "ami-5442e32fd1ababf88",
      "ami-5442e32fd1abada2a",
    ];

    const values = extractDynamicFilterValues({ instances: extractedInstances, filterField: 'ImageId' });
    expect(values.length).toBe(13);
    expect(values).toMatchObject(expectedValues);
  });

  it('extractInstances should perform as expected', () => {
    expect(extractInstances).toBeInstanceOf(Function);

    // Note we additionally sort the output as otherwise the order cannot be guaranteed.
    const instances = extractInstances(rawInstancesData).sort(compare('Name', 'asc'));
    expect(instances.length).toBe(32);
    expect(instances[0]).toMatchObject(expectedInstance);
  });

  it('getInstanceRawData should perform as expected', () => {
    expect(getInstanceRawData).toBeInstanceOf(Function);

    const instances = extractInstances(rawInstancesData);
    const instanceRawData = getInstanceRawData(instances, "i-07ae1e2a36d2b88bf");
    expect(instanceRawData).toMatchObject(expectedInstanceRawData);
  });

  it('initFilters should perform as expected', () => {
    expect(initFilters).toBeInstanceOf(Function);

    const filters = initFilters();
    expect(filters).toEqual(expectedFilters);
  });

  it('launchRemoteSession should perform as expected', () => {
    expect(launchRemoteSession).toBeInstanceOf(Function);
    // TODO emmm... more test here?
  });

  it('buildRemoteSessionCmd should perform as expected', () => {
    expect(buildRemoteSessionCmd).toBeInstanceOf(Function);
    let thisPlatform = "";
    let targetPlatform = "";
    let username = "";    
    let ip_address = "";

    let res;

    res = buildRemoteSessionCmd();
    expect(res.errMsg).toBe("You must supply all options!");

    username = "testuser";
    ip_address = "192.168.0.10";
    thisPlatform = "fishbone";
    targetPlatform = "";

    res = buildRemoteSessionCmd(thisPlatform, targetPlatform, username, ip_address);
    expect(res.errMsg).toBe("Don't know how to build remote session for fishbone");

    thisPlatform = "darwin";
    targetPlatform = "fishbone";

    res = buildRemoteSessionCmd(thisPlatform, targetPlatform, username, ip_address);
    expect(res.errMsg).toBe("Don't know how to build remote session for target platform fishbone");

    thisPlatform = "darwin";
    targetPlatform = "";
    res = buildRemoteSessionCmd(thisPlatform, targetPlatform, username, ip_address);
    expect(res.errMsg).toBe("");
    expect(res.cmd).toContain("ssh testuser@192.168.0.10");

    thisPlatform = "darwin";
    targetPlatform = "windows";
    res = buildRemoteSessionCmd(thisPlatform, targetPlatform, username, ip_address);
    expect(res.errMsg).toBe("");
    expect(res.cmd).toContain("rdp://full address=s:192.168.0.10:3389");

    thisPlatform = "linux";
    targetPlatform = "";
    res = buildRemoteSessionCmd(thisPlatform, targetPlatform, username, ip_address);
    expect(res.errMsg).toBe("");
    expect(res.cmd).toContain("ssh testuser@192.168.0.10");

    thisPlatform = "win32";
    targetPlatform = "";
    res = buildRemoteSessionCmd(thisPlatform, targetPlatform, username, ip_address);
    expect(res.errMsg).toBe("");
    expect(res.cmd).toContain("start ssh testuser@192.168.0.10");

    thisPlatform = "win32";
    targetPlatform = "windows";
    res = buildRemoteSessionCmd(thisPlatform, targetPlatform, username, ip_address);
    expect(res.errMsg).toBe("");
    expect(res.cmd).toContain("mstsc /v:192.168.0.10");
  });

  it('setSort should perform as expected', () => {
    expect(setSort).toBeInstanceOf(Function);

    const expectedSortOptions = {
      field: "Name",
      order: "asc"
    };
    const sortOptions = setSort('Name', 'asc');
    expect(sortOptions).toEqual(expectedSortOptions);
  });
});