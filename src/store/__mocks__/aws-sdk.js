class EC2 {
  describeInstances() {
    return jest.fn();
  }
}

const AWS = {
  EC2,
  config: {
    update: jest.fn()
  }
};

module.exports = AWS;