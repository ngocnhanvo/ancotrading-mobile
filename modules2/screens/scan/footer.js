import React, { PureComponent } from 'react'
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

export default class FooterSPD extends PureComponent {
	constructor(props) {
        super(props)
        this.state = {
            count_cart: props.count_cart,
			props: {...props.props},
			activeScan: 2
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
					this_sav.state.height = event.nativeEvent.layout.height
				}}
				childs={
					<View style={{ flex: 1, flexDirection: 'row' }}>
						<TouchableOpacity style={[
							stylevnn.btnFooter,
							{
								flex: 0.5
								, backgroundColor: this_sav.state.activeScan < 2 ? 'green' : 'transparent'
							}
						]} onPress={() => {
							this_sav.setState({ activeScan: this_sav.state.activeScan > 0 ? 0 : 1 }, function () {
								if(Model._barCode)
									Model._barCode.startScan();
							});
						}}>
							<Text style={{
								fontSize: 16
								, color: this_sav.state.activeScan < 2 ? "#FFF" : '#868f8e'
								, fontWeight: this_sav.state.activeScan < 2 ? 'bold' : 'normal'
								, textAlign: 'center'
							}}>
								{this_sav.state.activeScan == 2 ? 'Press to Scan' : this_sav.state.activeScan == 0 ? 'Start Scan' : 'Stop Scan'}
							</Text>
						</TouchableOpacity>

						<TouchableOpacity style={[
							stylevnn.btnFooter,
							{
								flex: 0.5
								, backgroundColor: this_sav.state.activeScan == 2 ? 'green' : 'transparent'
							}
						]} onPress={() => {
							this_sav.setState({ activeScan: 2 }, ()=> { Model.this_sav._startScan(); });
						}}>
							<Text style={{
								fontSize: 16
								, color: this_sav.state.activeScan == 2 ? "#FFF" : '#868f8e'
								, fontWeight: this_sav.state.activeScan == 2 ? 'bold' : 'normal'
								, textAlign: 'center'
							}}>
								Auto Scan
							</Text>
						</TouchableOpacity>
					</View>
				}
			/>
		)
    }
}