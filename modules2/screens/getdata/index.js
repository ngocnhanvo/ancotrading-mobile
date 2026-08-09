import React, {
	PureComponent,
} from 'react'
import {
	View,
	Text,
	BackHandler,
	TouchableOpacity,
	ActivityIndicator
} from 'react-native'
import {
	Container,
	Icon,
	Button
} from "../../tools/native-base";

import { SwipeListView } from '../../react-native-swipe-list-view';
import { Model } from "../../Model";
import { ThongTin, ThongTinKhachHang, ThongTinSP } from "../../Model/tableSQL";
import stylevnn from '../../styles/public.js';
import styles from './styles.js';
import { Dimensions } from 'react-native';
import axios from 'axios';
import PaginationSPD from '../../react-native-basic-pagination/pagination.js';
import Items from './items.js';
import HeaderSPD from './header.js';
import FooterSPD from './footer.js';
import FooterLW from './footerLW.js';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;

const MergeCode = (this_sav, compare) => {
	compare = compare ? Model.this_sav != this_sav : true;
	if(compare) {
		Model.this_sav = this_sav;
		Model.navigatePublic = this_sav.props;
		Model.mainScreen = Model.navigatePublic.navigation.state.routeName;
		
		this_sav.updateGetData(this_sav);
		Model.objectM.sidebar.updateCount((count_cart)=> {
			count_cart = Model.objectM.countCart(count_cart);
			this_sav.state.headerGDT.setState({count_cart});
		});
	}
};

const renderItem = (item, this_sav) => {
	if(!this_sav.state.itemsGDT)
		this_sav.state.itemsGDT = [];
	let rowData = item.item;
	let id = rowData.dateStr.replace(/\//g, '');
	if(this_sav.state.itemsGDT[id])
		this_sav.state.itemsGDT[id].state.rowData = rowData;
	
	return (
		<Items 
			ref={ref => this_sav.state.itemsGDT[id] = ref}
			rowData={rowData}
		/>
	)
};

const renderHiddenItem = (item) => {
	let rowData = item.item;
	return (
		<View 
			key={item.index}
			style={styles.rowBack}
		>
			<Button
				full
				danger
				onPress={() => { Model.this_sav.removeHistoryGetData(rowData); }}
				style={[styles.backRightBtn]}
			>
				<Icon active name="trash" style={{ fontSize: 30 }} />
			</Button>
			<Button
				full
				danger
				onPress={() => { Model.this_sav.removeHistoryGetData(rowData); }}
				style={[styles.backRightBtn]}
			>
				<Icon active name="trash" style={{ fontSize: 30 }} />
			</Button>
		</View>
	)
};
const setActiveScan = (ac) => {
	if(ac == 0) {
		if(Model.this_sav.intterGDT)
			clearInterval(Model.this_sav.intterGDT);
	}
	Model.this_sav.setState({activeScan: ac});
	Model.footerGDT.setState({activeScan: ac});
};
let ajaxRequest = null;
const getDataFromServer = (skip, take, dateStr, this_sav) => {
	ajaxRequest = axios.CancelToken.source();
	try {
		ThongTin.getThongTins(null, (resArr) => {
			if(skip == 0) {
				if(resArr.length > 0) {
					let resPending = resArr.filter((a) => { return a.slSP < a.tongSLSP });
					if(resPending.length > 0) {
						skip = resPending[0].slSP;
						dateStr = resPending[0].dateStr;
						this_sav.state.totalSeconds = resPending[0].totalSeconds;
					}
				}
			}

			let link = `${Model.linkRoot}/Controllers/API_Data.ashx?oper=sanphams&take=${take}&skip=${skip}&dateStr=${dateStr}`;
			axios.get(link, {
				cancelToken: ajaxRequest.token 
			}).then(function(response) {
				let data = response.data.substring(1);
				if(response.data.startsWith('1')) {
					let resDT = JSON.parse(data);
					//resDT.tongSLSP = 100;

					let res = resArr.filter((a)=>{
						return a.dateStr == resDT.dateStr
					})[0];
					
					if(res) {
						if(skip == 0) {
							res.slSP = resDT.slSP;
							res.slKH = resDT.slKH;
							res.slGet = Number(res.slGet) + 1;
						}
						else {
							res.slSP = Number(res.slSP) + Number(resDT.slSP);
							res.slKH = Number(res.slKH) + Number(resDT.slKH);
						}
						res.tongSLSP = resDT.tongSLSP;
						res.totalSeconds = this_sav.state.totalSeconds;

						if(res.slSP < resDT.tongSLSP) {
							if(this_sav.state.itemsGDT) {
								let id = res.dateStr.replace(/\//g, '');
								if(this_sav.state.itemsGDT[id])
									this_sav.state.itemsGDT[id].setState({rowData:res});
							}
						}
					}
					else {
						res = resDT;
						res.slGet = 1;
						res.totalSeconds = this_sav.state.totalSeconds;
						resArr.push(res);
					}

					this_sav.state.dateStr = dateStr;
					resDT.continue = res.slSP < resDT.tongSLSP;

					ThongTin.deleteThongTins(null, () => {
						ThongTin.insertThongTins(resArr, () => {
							let where = `ThongTinSP.dateStr not in (SELECT ThongTin.dateStr FROM ThongTin)`;
							if(skip == 0)
								where = `${where} or ThongTinSP.dateStr = '${resDT.dateStr}'`;
							ThongTinSP.deleteThongTinSPs({where}, ()=> {
								ThongTinSP.insertThongTinSPs(resDT.sps, (rs) => {
									ThongTinKhachHang.deleteThongTinKhachHangs({where: `ThongTinKhachHang.dateStr not in (SELECT ThongTin.dateStr FROM ThongTin)`}, ()=>{
										ThongTinKhachHang.insertThongTinKhachHangs(resDT.khs, (rs) => {
											this_sav.updateGetData();
											if(resDT.continue) {
												let skip2 = skip + take;
												getDataFromServer(skip2, take, resDT.dateStr, this_sav);
											}
											else {
												Model.objectM.drawer.updateDisabled(false);
												setActiveScan(0);
											}
										});
									});
								});
							});
						});
					});
				}
				else
				{
					Model.objectM.dialogboxMain.alert(data);
					Model.objectM.drawer.updateDisabled(false);
					setActiveScan(0);
				}
			})
			.catch(function (error) {
				if(error.code === 'ERR_NETWORK'){
					Model.objectM.dialogboxMain.alert('No internet connection');
					Model.objectM.drawer.updateDisabled(false);
					setActiveScan(0);
				}
				else if (error.response) {
					if(error.response.status != 400) {
						Model.objectM.dialogboxMain.alert(error.response.status, error.response.data);
						Model.objectM.drawer.updateDisabled(false);
						setActiveScan(0);
					}
				}
			});
		});
	}
	catch(r) {
		Model.objectM.drawer.updateDisabled(false);
		setActiveScan(0);
		Model.objectM.dialogboxMain.alert(r);
	}
};

class GetData extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			viewAppear: false,
			activeScan: 0,
			count_cart: 0,
			dataSource: [],
			data: '',
			goback: 'Home',
			heightViewHeader: 0,
			heightViewFooter: 0,
			pageSep: 1,
			pageNum: 20,
			dtsl: 0
		};
	}
	removeHistoryGetData(rowData) {
		if(Model.this_sav.state.activeScan == 1) {
			alert(`Data is being processed. This function is temporarily unavailable`);
		}
		else {
			Model.objectM.spinnerMain.show();
			let where = `dateStr = '${rowData.dateStr}'`;
			ThongTin.deleteThongTins({where}, () => {
				ThongTinKhachHang.deleteThongTinKhachHangs({where}, () => {
					ThongTinSP.deleteThongTinSPs({where}, () => {
						Model.this_sav.updateGetData();
					});
				});
			});
		}
	}
	render() {
		let this_sav = this;
		let dtsl = Number(this_sav.state.dtsl);
		let dtsSep = this_sav.state.dataSource;
		let paginationH = (dtsl > this_sav.state.pageNum ? Model.paginationH : 0);
		let listviewH = deviceHeight - Model.headerH - Model.footerH - paginationH;

		return (
			<Container ref="myRef" style={[styles.container, stylevnn.container]}>
				<View style={[styles.container2, styles.horizontal, { display: this_sav.state.activeScan == 0 ? 'none': '' }]}>
					<ActivityIndicator size="large" color="#00ff00" />
				</View>
				<HeaderSPD 
					ref={ref => this_sav.state.headerGDT = ref} 
					props={this_sav.props} 
					count_cart={this_sav.state.count_cart} 
					dtsl={dtsl} 
					dts={dtsSep.length} 
				/>
				<SwipeListView 
					style={{ maxHeight: listviewH }}
					getItemLayout={(data, index) => (
						{ length: 80, offset: 80 * index, index }
					)}
					data={dtsSep}
					keyExtractor={item => item.dateStr}
					initialNumToRender={10}
					ListFooterComponent={() => 
						<FooterLW 
							ref={ref => this_sav.state.footerGDTLW = ref} 
							dtsl={dtsl} 
						/>
					}
					renderItem={(item)=>{
						return renderItem(item, this_sav);
					}}
					renderHiddenItem={renderHiddenItem}
					disableRightSwipe={true}
					leftOpenValue={75}
					rightOpenValue={-75}
					previewRowKey={'0'}
					previewOpenValue={-40}
					previewOpenDelay={3000}
					removeClippedSubviews={true}
				/>

				<PaginationSPD
					ref={ref => this_sav.state.paginationGDT = ref} 
					props={this_sav.props} 
					dtsl={dtsl}
					onPageChange={(page, num)=> {
						this_sav.state.pageSep = page;
						this_sav.createPage(this_sav);
					}}
				/>
				
				<FooterSPD 
					ref={ref => Model.footerGDT = ref} 
					props={this_sav.props}
					activeScan={this_sav.state.activeScan}
					onPress={(ac) => {
						this_sav.setState({activeScan: ac}, function() {
							if (ajaxRequest) {
								ajaxRequest.cancel(); 
							}
							if(ac == 0) {
								if(Model.objectM.drawer)
									Model.objectM.drawer.updateDisabled(false);
								if(this_sav.intterGDT)
									clearInterval(this_sav.intterGDT);
							}
							else {
								if(Model.objectM.drawer)
									Model.objectM.drawer.updateDisabled(true);
								
								this_sav.state.totalSeconds = 0;
								this_sav.intterGDT = setInterval(()=> {
									this_sav.state.totalSeconds++;
								}, 1000);
								getDataFromServer(0, 50, '', this_sav);
							}
						});
					}}
				/>
				
			</Container>
		)
	}
	updateGetData() {
		let this_sav = this;
		ThongTin.countThongTins(null, (c)=> {
			if(c) {
				const dtsl = c.total;
				this_sav.state.dtsl = dtsl;
				if(this_sav.state.paginationGDT)
					this_sav.state.paginationGDT.setState({dtsl});
				if(this_sav.state.headerGDT)
					this_sav.state.headerGDT.setState({dtsl});
			}

			ThongTin.getThongTins({ page: this_sav.state.pageSep, take: this_sav.state.pageNum }, (res)=> {
				this_sav.setState({dataSource: res}, () => {
					Model.objectM.spinnerMain.close();
					if(this_sav.state.footerGDTLW)
						this_sav.state.footerGDTLW.setState({dtsl: res.length});
				});
			});
		});
	}
	componentDidMount() {
		let this_sav = this;
		MergeCode(this_sav);

		this_sav.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			if(this_sav.state.headerGDT)
				this_sav.state.headerGDT.onBack(this_sav.state.headerGDT);
			else
				this_sav.props.navigation.goBack();
			return true;
		});
	}
	componentWillUnmount() {
		this.backHandler.remove();
		this.willFocusSubscription.remove();
	}
	UNSAFE_componentWillMount() {
		let this_sav = this;
		this_sav.willFocusSubscription = this_sav.props.navigation.addListener(
			'willFocus', () => {
				MergeCode(this_sav, true);
			}
		);
	}
}

export default GetData