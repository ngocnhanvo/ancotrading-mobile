const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceWidth = Dimensions.get("window").width;

export default {
	container: {
		flex: 1,
		backgroundColor: 'transparent'
	},
	quantityPanel: {
		marginTop: 16,
		marginLeft: 20,
		padding: 14,
		borderRadius: 12,
		backgroundColor: '#f8fafc',
		borderWidth: 1,
		borderColor: '#e2e8f0'
	},
	quantityLabel: {
		fontSize: 14,
		fontWeight: '600',
		color: '#334155',
		marginBottom: 10
	},
	detail_row: {
		color: '#000000',
		fontWeight: 'normal',
		fontSize: 14,
		paddingBottom: 6
	}
};
