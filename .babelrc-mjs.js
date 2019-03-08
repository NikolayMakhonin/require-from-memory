module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ]
  ],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-optional-chaining",

    ["@babel/plugin-proposal-class-properties", { "loose": true }],
	"@babel/plugin-transform-for-of",
	"@babel/plugin-transform-regenerator"
  ]
}
