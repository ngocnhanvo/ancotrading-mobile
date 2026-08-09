import React, { PureComponent } from 'react'
import {
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import stylevnn from '../../styles/public.js';
import {
	Icon
} from "../../tools/native-base";
import { HeaderNTBVNN } from "../../tools/native-base-vnn";
import { Model } from '../../Model/index.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class HeaderSPD extends PureComponent {
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
							this_sav.onBack(this_sav);
						}}
					>
						<Icon style={stylevnn.iconHeader} name="ios-arrow-round-back" />
					</TouchableOpacity>
				}
				txtMiddle={`Scan QRCode`}
				btnRight={
					<TouchableOpacity
						onPress={() => {
							if(Model._barCode)
								Model._barCode.stopScan();
							this_sav.state.props.navigation.navigate("Cart");
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