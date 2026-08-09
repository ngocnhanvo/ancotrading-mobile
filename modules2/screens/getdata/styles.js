const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceWidth = Dimensions.get("window").width;

export default {
	container: {
		flex: 1,
		backgroundColor: 'transparent'
	},
	container2: {
		justifyContent: 'center',
		position: 'absolute',
		zIndex: 99999,
		height: 60,
		width: deviceWidth
	},
	horizontal: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		padding: 10,
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	backRightBtn: {
		width: 75,
		height: '100%'
	},
	detail_row: {
		color: '#000000',
		fontWeight: 'normal',
		fontSize: 14,
		paddingBottom: 6
	}
};
