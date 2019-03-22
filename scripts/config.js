let configs = {
	dev: {
		input: "src/platforms/dev.js",
		output: { file: "dist/ant-dev.js", format: "umd", name: "Ant" },
		env: "dev"
	}
}
if (process.env.TARGET) {
	module.exports = configs[process.env.TARGET]
} 
