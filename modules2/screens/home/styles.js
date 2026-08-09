const React = require("react-native");
const { Dimensions } = React;
const deviceHeight = Dimensions.get("window").height;

export default {
  imageContainer: {
		flex: 1,
	},
	logoContainer: {
		flex: 1,
		marginTop: deviceHeight / 8,
		marginBottom: 30,
		alignItems: "center"
	},
	logo: {
		width: '100%',
		height: 100,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		color: "#D8D8D8",
		bottom: 6,
		marginTop: 5
	}
};
