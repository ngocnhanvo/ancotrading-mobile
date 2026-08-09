const React = require("react-native");

const { StyleSheet, Dimensions, Platform } = React;

const deviceHeight = Dimensions.get("window").height;

export default {
	container: {
		top: Platform.OS === "ios" ? 0 : 0,
	},
	icon_menu: {
		fontSize: 30,
		color: 'blue'
	},
	color_force: {
		color: "#FFF",
	},
	color_background: {
		backgroundColor:  Platform.OS === "ios" ? '#FAFAFA' : 'blue',
	},
	iconHeader: {
		fontSize: 36, 
		color: '#FFF'
	},
	btnFooter: {
		textAlign: "center" 
		, alignItems: "center" 
		, alignSelf: "center" 
		, justifyContent:"center"
		, height: "100%"
	},
	txtBtnFooter: {
		fontSize: 16
		, textAlign: 'center'
		, color: '#FFF'
	},
	txtCountCart: {
		position:"absolute", 
		fontWeight: "bold", 
		right: -6.5, 
		top: 2,
		textAlign:"center", 
		width: "100%",
		color: "red",
		fontSize: 14
	},
	txtCountQO: {
		position:"absolute", 
		fontWeight: "bold", 
		right: -16, 
		top: -2,
		textAlign:"center", 
		width: "50%",
		color: "red",
		fontSize: 14,
		backgroundColor: '#FFF',
		padding: 0,
		borderRadius: 6
	},
	dropdownButtonStyle: {
		width: 200,
		height: 50,
		backgroundColor: '#E9ECEF',
		borderRadius: 12,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 12,
	},
	dropdownButtonTxtStyle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '500',
		color: '#151E26',
	},
	dropdownButtonArrowStyle: {
		fontSize: 28,
	},
	dropdownButtonIconStyle: {
		fontSize: 28,
		marginRight: 8,
	},
	dropdownMenuStyle: {
		backgroundColor: '#E9ECEF',
		borderRadius: 8,
		height: 200
	},
	dropdownItemStyle: {
		width: '100%',
		flexDirection: 'row',
		paddingHorizontal: 12,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 8,
	},
	dropdownItemTxtStyle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '500',
		color: '#151E26',
		textAlign: 'center'
	},
	dropdownItemIconStyle: {
		fontSize: 28,
		marginRight: 8,
	},
	underLine: {
		textDecorationLine: "underline",
    	textDecorationStyle: "solid",
		textDecorationColor: "#000"
	}
};
