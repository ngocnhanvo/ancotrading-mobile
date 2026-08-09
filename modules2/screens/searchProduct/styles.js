const React = require("react-native");
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get("window").height;

export default {
  container: {
		flex: 1,
		backgroundColor: '#FFF'
	},
	title_head: {
		color: 'blue',
		fontSize: 20,
		fontWeight: 'bold'
	},
	detail_row: {
		color: '#000000',
		fontWeight: 'normal',
		fontSize: 13,
		paddingBottom: 5
	},
	container1: {
		//backgroundColor: '#F5FCFF',
		//flex: 1,
		paddingTop: 25
	},
	autocompleteContainer: {
		flex: 1,
		width: '100%',
		zIndex: 9999,
	},
	itemText: {
		fontSize: 16,
		margin: 2,
		color: 'blue'
	},
	descriptionContainer: {
		backgroundColor: '#F5FCFF',
		marginTop: 25
	},
	infoText: {
		textAlign: 'center'
	},
	titleText: {
		fontSize: 18,
		fontWeight: '500',
		marginBottom: 10,
		marginTop: 10,
		textAlign: 'center'
	},
	directorText: {
		color: 'grey',
		fontSize: 12,
		marginBottom: 10,
		textAlign: 'center'
	},
	openingText: {
		textAlign: 'center'
	},
	disable: {
		color: '#868181'
	},
	color_force: {
		color: Platform.OS === "ios" ? '#0c4da2' : '#FFF',
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
	underLine: {
		textDecorationLine: "underline",
    	textDecorationStyle: "solid",
		textDecorationColor: "#000"
	}
};
