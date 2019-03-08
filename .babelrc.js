module.exports = {
	"presets": [
		[
			"@babel/preset-env",
			{
				"targets": {
					"node": "8.6.0"
				}
			}
		]
	],
	"plugins": [
		"@babel/plugin-syntax-dynamic-import",
		[
			'@babel/plugin-transform-runtime', {
				// useESModules: true
			}
		],
		"@babel/plugin-proposal-optional-chaining",
		"@babel/plugin-proposal-throw-expressions",
		
		["@babel/plugin-proposal-class-properties", { "loose": true }],
		"@babel/plugin-transform-parameters",
		"@babel/plugin-transform-async-to-generator",
		"@babel/plugin-transform-for-of",
		//"@babel/plugin-transform-regenerator"
	]
}
