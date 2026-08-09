import React, { Component } from 'react'
import {
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import {
	Icon
} from "../../tools/native-base";
import { HeaderNTBVNN } from "../../tools/native-base-vnn";
import stylevnn from '../../styles/public.js';
import { Model } from '../../Model/index.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class HeaderSPD extends Component {
	constructor(props) {
        super(props)
        this.state = {
            count_cart: null,
			props: {...props.props}
        }
        this.ref = null;
    }
	onBack = (this_sav) => {
		if(!Model.checkLockScreen())
			this_sav.state.props.navigation.goBack(null);
	}
	render() {
		let this_sav = this;
		return(
			<HeaderNTBVNN
				onLayout={(event) => {
					this_sav.state.height = event.nativeEvent.layout.height
				}}
				btnLeft={
					<TouchableOpacity
						onPress={() => {
							Model.objectM.drawer.toggle();
						}}
					>
						<Icon style={stylevnn.iconHeader} name="menu" />
					</TouchableOpacity>
				}
				txtMiddle={`Home`}
				btnRight={
					<TouchableOpacity
						onPress={() => {
							this_sav.state.props.navigation.navigate("Cart")
						}}
					>
						<Icon style={stylevnn.iconHeader} name="cart" />
						<Text style={stylevnn.txtCountCart}>{this_sav.state.count_cart}</Text>
					</TouchableOpacity>
				}
			/>
		)
    }
}