import React, { Component } from 'react'
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions
} from 'react-native'
import stylevnn from '../../styles/public.js';
import { FooterNTBVNN } from "../../tools/native-base-vnn";
import { Model } from '../../Model/index.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

export default class FooterSPD extends Component {
	constructor(props) {
        super(props)
        this.state = {
            count_cart: props.count_cart,
			activeScan: props.activeScan,
			props: {...props.props}
        }
        this.ref = null
    }
	onChange = (item) => {
        this.setState({item, item});
    }
	render() {
		let this_sav =this;
		return(
			<FooterNTBVNN
				onLayout={(event) => {
					this_sav.state.height = event.nativeEvent.layout.height;
				}}
				childs={
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<TouchableOpacity style={[
							stylevnn.btnFooter,
							{
								flex: 1
								, backgroundColor: 'green'
							}
						]} 
						onPress={() => {
							let ac = this_sav.state.activeScan == 0 ? 1 : 0;
							this_sav.setState({activeScan: ac},() => {
								this_sav.props.onPress(ac);
							});
						}}
						>
							<Text style={{
								fontSize: 16
								, color: "#FFF"
								, fontWeight: 'bold'
								, textAlign: 'center'
							}}>
								{this_sav.state.activeScan == 0 ? 'Get data from Server' : 'Stop action'}
							</Text>
						</TouchableOpacity>
					</View>
				}
			/>
		)
    }
}