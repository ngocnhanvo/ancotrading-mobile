import React, {
	PureComponent
} from 'react'
import {
	View,
	Text,
	BackHandler,
} from 'react-native'
import {
	Container,
	Content,
} from "../../tools/native-base";
import { Model } from "../../Model";
import stylevnn from '../../styles/public.js';
import Barcode from 'react-native-smart-barcode'
import { Dimensions } from 'react-native';
import { ThongTinSP } from "../../Model/tableSQL";
import styles from './styles.js';
import HeaderSPD from "./header.js";
import FooterSPD from './footer.js';
import Detail from './detail.js';
const { width, height } = Dimensions.get("window");
const MergeCode = (this_sav, compare) => {
	compare = compare ? Model.this_sav != this_sav : true;
	if(compare) {
		Model.this_sav = this_sav;
		Model.navigatePublic = this_sav.props;
		Model.mainScreen = Model.navigatePublic.navigation.state.routeName;
		
		this_sav.showCamera();
		Model.objectM.sidebar.updateCount((count_cart)=> {
			count_cart = Model.objectM.countCart(count_cart);
			Model.headerScan.setState({count_cart});
		});
	}
};

class Scan extends PureComponent {
	constructor(props) {
		super(props);
		
		this.state = {
			viewAppear: true,
			viewOpacity: 0,
			activeScan: 2,
			data: '',
			goback: 'Home',
			width_bg: width,
			height_bg: height,
			heightF: 0,
			heightH: 0
		};
	}
	onValueChange(this_sav, val) {
		this_sav.setState({value: val});
	}
	openBox(this_sav, res) {
		this_sav.setState({viewAppear: false}, () => {
			Model.objectM.dialogboxMain2.disableOverlayClickClose(true);
			Model.objectM.dialogboxMain2.pop({
				vnnType: 1,
				content: (
					<Detail 
						ref={ref => Model.detailScan = ref} 
						res={res}
					/>
				),
				btns: [
					{
						text: 'Add to Cart',
						callback: () => {
							if(!Model.detailScan) {
								alert(`Have an error, Model.detailScan is not found`);
								return;
							}

							res = Model.detailScan.state.res;
							res.qty = Model.detailScan.state.qty;
							res.note = Model.detailScan.state.note;
							res.scan = true;
							res.selCL = true;
							if(!res.qty)
								res.qty = 1;
							
							if(res.qty < Model.minVal) {
								alert(`The quantity must be greater than "${Model.minVal - 1}"`);
								return;
							}
							if(res.qty > Model.maxVal) {
								alert(`The quantity must be fewer than "${Model.maxVal + 1}"`);
								return;
							}
							
							let data = [res];
							Model.objectM.sidebar.addtoCart(data, (a)=> {
								Model.objectM.spinnerMain.close();
								if(isNaN(a))
									alert(a)
								else {
									Model.headerScan.setState({count_cart: a});
									//this_sav._startScan();
									//this_sav.showCamera(1);
									//Model.objectM.dialogboxMain2.disableOverlayClickClose(false);
									//Model.objectM.dialogboxMain2.close();
								}
							});
						}
					},
					{
						text: 'Cancel',
						callback: () => {
							Model.objectM.dialogboxMain2.disableOverlayClickClose(false);
							Model.objectM.dialogboxMain2.close();
							this_sav.setState({viewAppear: true}, () => {
								
							});
						}
					}
				]
			});
		});
	}
	render() {
		let this_sav = this;
		return (
			<Container ref="myRef" style={[styles.container, stylevnn.container]}>
				<HeaderSPD 
					ref={ref => Model.headerScan = ref} 
					props={this_sav.props} 
					count_cart={this_sav.state.count_cart} 
					barcode={Model._barCode} 
				/>
				<Content>
					{
						this_sav.state.viewAppear
							?
							<Barcode 
								style={{ 
									height: height - Model.headerH - Model.footerH, 
									flex: 1, 
									opacity: this_sav.state.viewOpacity 
								}}
								ref={component => Model._barCode = component}
								scannerRectWidth={180}
								scannerRectHeight={180}
								onBarCodeRead={(e) => {
									let activeS = Model.footerScan.state.activeScan;
									if (activeS > 0 & e.nativeEvent.data.code != null & e.nativeEvent.data.code != '') {
										Model.footerScan.setState({activeScan : activeS == 2 ? 2 : 0});
										try {
											this_sav._stopScan();
											let searchStr = e.nativeEvent.data.code;
											let indexOf = searchStr.lastIndexOf(`?code=`);
											if(indexOf > 0) {
												searchStr = searchStr.substr(indexOf + 6);
											}

											Model.objectM.sidebar.getDateCollectData((dateStr) => {
												ThongTinSP.getThongTinSPs({dateStr, searchStr, page: 1, take: 1, scan: true}, (res) => {
													res = res[0];
													if(res) {
														this_sav.openBox(this_sav, res);
													}
													else {
														Model.objectM.dialogboxMain2.disableOverlayClickClose(true);
														Model.objectM.dialogboxMain2.pop({
															title: 'Product is not found',
															vnnType: 1,
															content: (
																<View>
																	<Text style={{color:'#000'}}>Content QR:</Text>
																	<Text style={{color:'#000'}}>{searchStr}</Text>
																</View>
															),
															btns: [
																{
																	text: 'OK',
																	callback: () => {
																		Model.objectM.dialogboxMain2.disableOverlayClickClose(false);
																		Model.objectM.dialogboxMain2.close();
																		this_sav._startScan();
																	}
																}
															]
														});
													}
												});
											});
										}
										catch (r) { }
									}
								}}
							/>
							:
							<View style={{ flex: 1, justifyContent: "center", alignItems: "center", height: (this.state.height_bg - 120) }}>
								<Text style={{ textAlign: 'center', color: '#000' }}>Loading...</Text>
							</View>
					}
				</Content>

				<FooterSPD 
					ref={ref => Model.footerScan = ref} 
					props={this_sav.props}
				/>
			</Container>
		)
	}
	showCamera(type) {
		if(type == 1) {
			Model.this_sav.setState({viewOpacity: 0}, () => {
				setTimeout(() => {
					Model.this_sav.setState({viewOpacity: 1}, () => {
						Model.this_sav._startScan();
					});
				}, 200);
			});
		}
		else {
			setTimeout(() => {
				Model.this_sav.setState({viewAppear: false}, () => {
					setTimeout(() => {
						Model.this_sav.setState({viewAppear: true, viewOpacity: 1}, () => {
		
						});
					}, type == 1 ? 0 : 10);
				});
			}, type == 1 ? 0 : 10);
		}
	}
	componentDidMount() {
		let this_sav = this;
		if (this_sav.refs.myRef) {
			try {
				this_sav.state.data = this_sav.props.navigation.state.params.data;
			}
			catch (r) {
				this_sav.state.data = '';
			}

			this_sav.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
				if(Model.headerScan)
					Model.headerScan.onBack(Model.headerScan);
				else
					this_sav.props.navigation.goBack();
				return true;
			});
		}

		MergeCode(this_sav);
	}

	async UNSAFE_componentWillMount() {
		let this_sav = this;
		this_sav.willFocusSubscription = await this_sav.props.navigation.addListener(
			'willFocus', () => {
				if(Model.this_sav != this_sav) {
					MergeCode(this_sav);
				}
			}
		);

		this_sav.willBlurSubscription = await this_sav.props.navigation.addListener(
			'willBlur', () => {
				this_sav.setState({viewAppear: false});
			}
		);

		await Model.requestPermission();
	}

	componentWillUnmount() {
		let this_sav = this;
		if(this_sav.backHandler)
			this_sav.backHandler.remove();
		if(this_sav.willFocusSubscription)
			this_sav.willFocusSubscription.remove();
		if(this_sav.willBlurSubscription)
			this_sav.willBlurSubscription.remove();
	}
	_startScan = (e) => {
		if(Model._barCode)
			Model._barCode.startScan();
	}
	_stopScan = (e) => {
		if(Model._barCode)
			Model._barCode.stopScan();
	}

}

export default Scan