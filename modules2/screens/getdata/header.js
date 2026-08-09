import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import stylevnn from '../../styles/public.js';
import {
	Icon
} from "../../tools/native-base";

import { Model } from '../../Model';
import { HeaderNTBVNN } from "../../tools/native-base-vnn";
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class HeaderSPD extends Component {
	constructor(props) {
        super(props)
        this.state = {
            count_cart: null,
			dtsl: props.dtsl,
			dts: props.dts,
			props: {...props.props}
        }
        this.ref = null
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
							this_sav.onBack(this_sav);
						}}
					>
						<Icon style={stylevnn.iconHeader} name="ios-arrow-round-back" />
					</TouchableOpacity>
				}
				txtMiddle={`Get Data (${this_sav.state.dtsl})`}
				btnRight={
					<TouchableOpacity
						onPress={() => {
							this.state.props.navigation.navigate("Cart", { data: '' })
						}}
					>
						<Icon style={stylevnn.iconHeader} name="cart" />
						<Text style={stylevnn.txtCountCart}>{this.state.count_cart}</Text>
					</TouchableOpacity>
				}
			/>
		)
    }
}