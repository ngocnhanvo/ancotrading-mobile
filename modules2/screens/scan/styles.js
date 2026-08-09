const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceWidth = Dimensions.get("window").width;

export default {
	container: {
		flex: 1,
		backgroundColor: 'transparent'
	},
	detail_row: {
		color: '#000000',
		fontWeight: 'normal',
		fontSize: 14,
		paddingBottom: 6
	}
};
