/* eslint global-require: off */
const developmentEnvironments = ["development", "test"];

module.exports = api => {
  // see docs about api at https://babeljs.io/docs/en/config-files#apicache

  let development = api.env(developmentEnvironments);
  const isTest = api.env("test");
  const useCommonjsModules = isTest
    ? {
        modules: "commonjs",
      }
    : {};

  return {
    presets: [
      [
        require("@babel/preset-env"),
        {
          ...useCommonjsModules,
          "targets": {
            "node": "10"
          }
        },
      ],
      [require("@babel/preset-react"), { development }],
    ],
    plugins: ["@babel/plugin-proposal-object-rest-spread"]
  };  
};
