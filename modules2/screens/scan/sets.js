import React, {
	PureComponent
} from 'react';
import { View, Text } from 'react-native';
import {
	Icon,
} from "../../tools/native-base";
import SelectDropdown from 'react-native-select-dropdown';
import stylevnn from '../../styles/public.js';
import { Model } from '../../Model';
import { ThongTinSP } from '../../Model/tableSQL/ThongTinSP.js';

export default class Sets extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			itemNo: props.itemNo,
			sets: props.sets,
			type: props.type,
		};
	}
	select = (item, this_sav, load = true) => {
		//Tải lại trang này
		let item_sets = item ? item.sizes : [];
		let itemNo = item ? item.itemNo : '';
		let contentSet = [];
		for(let i in item_sets) {
			let itemSize = item_sets[i];
			let itemSize_size = itemSize.itemNo.substr(9, 2);
			let itemSize_Size = itemSize.size;
			contentSet.push(<Text style={[{color: '#000', paddingLeft: 20, paddingTop: 5}]}>Size {itemSize_size}: {itemSize_Size}</Text>);
		}
		
		if(load)
			this_sav.setState({contentSet, itemNo});
	}
	componentDidMount() {
		let this_sav = this;
		let itemNo = this_sav.state.itemNo;
		let sets = this_sav.state.sets;
		let item = sets.filter((a)=>{return a.itemNo == itemNo})[0];
		if(item)
			this_sav.select(item, this_sav, true);
	}
	render() {
		let this_sav = this;
		let res_itemNo = this_sav.state.itemNo;
		let sets = this_sav.state.sets;
		return (
			<View>
				<SelectDropdown
					style={{flex: 1}}
					data={sets}
					ref={ref=>this_sav.state.selectDropDown = ref}
					onSelect={(selectedItem, index) => {
						let itemNo = selectedItem.itemNo;
						let item = sets.filter((a)=>{return a.itemNo == itemNo})[0];
						itemNo = item ? itemNo : '';
						if(res_itemNo == itemNo)
							return;
						
						let res = Model.detailScan.state.res;
						for (const key in item) {
							if(key != 'sizes')
								res[key] = item[key];
							else {
								for(let i in res.sizes) {
									let res_size = res.sizes[i];
									if(res_size.itemNo == item.itemNo)
										res_size.sizes = item.sizes;
								}
							}
						}
						Model.detailScan.forceUpdate();
						//Tải lại kích thước
						let items = Model.scanSizeDetail;
						for(let i in items) {
							if(items[i])
								items[i].setState({itemNo:item.itemNo});
						}
						//Tải lại trang này
						this_sav.select(item, this_sav);
						//Tải lại màu sắc
						let arr = [];
						item.colors.map(function(obj) {
							arr.push(obj.itemNo);
						});
						let where = `and t1.itemNo in ('${arr.join("','")}')`;
						//Model.objectM.spinnerMain.show();
						ThongTinSP.getThongTinSPs({dateStr: res.dateStr, where}, (colorData) => {
							Model.scanColorDetail = [];
							Model.scanColor.state.itemNo = item.itemNo;
							Model.scanColor.setState({colorData});
						});
					}}
					renderButton={(selectedItem, isOpened) => {
						let itemNo = selectedItem ? selectedItem.itemNo : res_itemNo;
						let item = sets.filter((a)=>{return a.itemNo == itemNo})[0];
						
						let set = "";
						if(!item)
							set = sets[0].itemNo;
						else if(item.type == 0)
							set = sets[0].itemNo;
						else
							set = `Set ${itemNo.substr(9,2)}`;

						return (
							<View style={{paddingLeft: 20}}>
								<View style={[stylevnn.dropdownButtonStyle, {alignItems:'center', width: 250}]}>
									<Text style={stylevnn.dropdownButtonTxtStyle}>{set}</Text>
									<Icon style={[stylevnn.iconHeader, {color: '#000'}]} name="arrow-down" />
								</View>
							</View>
						);
					}}
					renderItem={(item, index, isSelected) => {
						if(!item)
							return (<View></View>);
						if(item.type == 0)
							return (<View></View>);

						let set = item.itemNo.substr(9,2);
						let contentChild = [];
						for(let i in item.sizes) {
							let itemSize = item.sizes[i];
							let itemSize_size = itemSize.itemNo.substr(9, 2);
							let itemSize_Size = itemSize.size;
							contentChild.push(<Text style={[{color: '#000', paddingLeft: 20, paddingTop: 5}]}>Size {itemSize_size}: {itemSize_Size}</Text>);
						}
						
						if(!isSelected)
							isSelected = item.itemNo == res_itemNo;

						return (
							<View>
								<View style={{...stylevnn.dropdownItemStyle, ...(isSelected && {backgroundColor: '#D2D9DF'})}}>
									<Text style={[stylevnn.dropdownItemTxtStyle, {textAlign: 'left'}]}>Set {set}</Text>
								</View>
								<View>
									{contentChild}
								</View>
							</View>
						);
					}}
					disableAutoScroll={true}
					showsVerticalScrollIndicator={true}
					dropdownStyle={stylevnn.dropdownMenuStyle}
				/>
				<View style={{paddingLeft: 20}}>
					{this_sav.state.contentSet}
				</View>
			</View>
		);
	}
};