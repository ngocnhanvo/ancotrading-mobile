import React, {
	Component,
	PureComponent
} from 'react'
import {
	View,
	Text,
	Platform,
	Dimensions,
	PermissionsAndroid,
} from 'react-native';
import { Model } from '../../../Model';
import { BaoGiaSP } from "../../../Model/tableSQL";
import WebView from 'react-native-webview';
import RNPrint from 'react-native-print';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
let sizeScreen = Dimensions.get("window");
const deviceHeight = sizeScreen.height;
const deviceWidth = sizeScreen.width;


const androidSDKVersion = Platform.Version;
const isAndroid13OrHigher = androidSDKVersion >= 33;

const requestPermission = async() => {
	try {
		if (Platform.OS === 'ios')
			return true;
	
		if (isAndroid13OrHigher)
			return true;

	  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
	  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
		console.log('Bạn đã có quyền truy cập bộ nhớ');
		return true;
	  } else {
		alert("permission denied");
		return false;
	  }
	} catch (err) {
	  console.error('Lỗi khi xin quyền:', err);
	  return false;
	}
}

const templateHTML = `
<!DOCTYPE html>
<html>
	<head>
		<title>Cart</title>
		<style>
			body {
				font-size: 80%;
			}

			.tblContent th {
				border: 1px solid #CCC;
			}

			.tblContent td {
				border: 1px solid #CCC;
			}
			.tblContent td.num {
				text-align: center;
				width: 40px;
			}
			.tblContent .image {
				text-align: center;
				width: 50px;
			}
			.tblContent td.itemNo {
				text-align: center;
				min-width: 100px;
			}

			.tblContent td.price {
				text-align: right;
			}

			.tblContent td {
				padding-left: 10px;
				padding-right: 10px;
			}

			.tblTitle, .tblContent {
				width: 95%;
				margin:  0px auto 10px auto;
			}

			.tblPartner {
				width: 95%;
				margin:  0px auto 10px auto;
				padding-left: 150px;
				font-weight: bold
			}
			
			.tblTitle td {
				text-align: center;
				padding-bottom: 5px;
			}

			.tblTitle .titName {
				font-size: 150%;
				font-weight: bold;
			}

			.tblTitle .titAdd {
				font-size: 90%;
			}

			.tblPartner .titName, .tblPartner .titEmail, .tblPartner .titAddress {
				width: 120px;
				padding: 3px;
			}

			#btnPrintPDF { display:none }

			#btnPrintHTML {
				margin: 0px auto 20px auto;
				font-size: 300%;
				padding: 10px 20px 10px 20px;
				display: table;
			}

			@media print {
				#btnPrintHTML, #btnPrintPDF {
					display: none;
				}
				.tblTitle, .tblContent, .tblPartner {
					width: 100%;
				}
			}

			@page {
				size: A4; /* Hoặc portrait nếu bạn muốn in dọc */
				margin: 0.5cm; /* Thiết lập margin cho trang in */
			}
		</style>
	</head>
	<body>
		<input id="btnPrintHTML" type="button" value="Save and Share" onclick="window.ReactNativeWebView.postMessage('printPDF')"/>
		<input id="btnPrintPDF" type="button" value="Print PDF" onclick="window.ReactNativeWebView.postMessage('printPDF')"/>
		{Content}
	</body>
</html>
`;
export default class PrintMain extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			datas: [],
			BaoGiaID: props.BaoGiaID,
			partner: props.partner ? props.partner : {ma_dtkd: '', ten_dtkd: '', email: '' , address: ''},
			html: templateHTML.replace('{Content}', '<h1 style="margin: 50px auto; display: table">Loading...</h1>')
		};
	}
	printHTML = async (this_sav) => {
		await RNPrint.print({
			html: this_sav.state.html
		})

		// const results = await RNHTMLtoPDF.convert({
		// 	html: this_sav.state.html,
		// 	fileName: 'test.pdf',
		// 	jobName: 'nhan'
		//   })
	  
		//   await RNPrint.print({ filePath: results.filePath, jobName: 'Download', isLandscape: true })
	}
	printPDF = async(this_sav) => {
		const access = await requestPermission();
		if(!access)
			return;

		const results = await RNHTMLtoPDF.convert({
		  html: this_sav.state.html,
		  fileName: `Cart`,
		  base64: true,
		});

		//await RNPrint.print({ filePath: results.filePath });
		//let filePath = `file://${results.filePath}`;
		let data64 = `data:application/pdf;base64,${results.base64}`;
		try {
			const partner = this_sav.state.partner;
			const code = partner.ma_dtkd;
			const type = Model.qoTypes[partner.qotype].value;
			const today = new Date();
  			const formattedDate = today.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });

			await Share.open({
				url: data64, // Đường dẫn file PDF cần chia sẻ
				type: 'application/pdf', // Loại file (MIME type)
				title: 'Share', // Tiêu đề hộp thoại chia sẻ (tùy chọn)
				filename: `${code}-AncoQuotatuon-${formattedDate} (${type})`, // Tên file hiển thị khi chia sẻ (tùy chọn)
			});
		} 
		catch (error) {
			console.log(error);
		}
	}
	handleWebViewMessage = (this_sav, event) => {
		const message = event.nativeEvent.data;
		if (message === 'printHTML') {
			this_sav.printHTML(this_sav);
		}
		else if (message === 'printPDF') {
			this_sav.printPDF(this_sav);
		}
	}
	componentDidMount() {
		let html = '';
		let this_sav = this;
		let display = this_sav.state.partner.qotype == 0 ? 'none' : '';
		let where = `BaoGiaID = '${this.state.BaoGiaID}'`;
		BaoGiaSP.getBaoGiaSPs({where}, (datas)=> {
			let sum_qty = 0, sum_amount = 0;
			datas.forEach((item, index) => {
				let Size = item.size;
				if(!Model.is0orS(item.itemNo, true)) {
					let arr = [];
					let itemSize = item.sizes.filter((s)=>{ return s.itemNo == item.itemNo })[0];
					if(itemSize) {
						itemSize.sizes.map((s) => {
							arr.push(s.size);
						});
						Size = arr.join('<div style="height:6px"></div>');
					}
				}
				html += `
					<tr>
						<td class="itemNo">${item.itemNo}</td>
						<td class="image"><img width=50 height=50 src="data:image/jpeg;base64,${item.image}"/></td>
						<td style="padding:10px">${Size}</td>
						<td>${item.packing}</td>
						<td>${item.qtyCont}</td>
						<td class="price">${Model.toNumberStr(item.qty)}</td>
						<td class="price" style="display:${display}">${Model.toNumberStr(item.price)}</td>
						<td class="price" style="display:${display}">${Model.toNumberStr(item.price * item.qty)}</td>
					</tr>
				`;

				sum_qty +=item.qty;
				sum_amount += item.price * item.qty;
			});

			if(display == '') {
				html += `
					<tr style="height:30px">
						<td colspan=2 class="itemNo" style="text-align:right; font-weight:bold;">Sub Total:</td>
						<td></td>
						<td></td>
						<td></td>
						<td class="price" style="font-weight:bold">${Model.toNumberStr(sum_qty)}</td>
						<td class="price"></td>
						<td class="price" style="font-weight:bold">${Model.toNumberStr(sum_amount)}</td>
					</tr>
				`;
			}

			let employee = Model.UserFullName ? Model.UserFullName : Model.companyInfo.employeeVal;
			html = `
				<table class="tblTitle">
					<tr>
						<td class="titName">${Model.companyInfo.name}</td>
					</tr>
					<tr>
						<td class="titAdd">${Model.companyInfo.address}</td>
					</tr>
					<tr>
						<td class="titMail">${Model.companyInfo.email}</td>
					</tr>
					<tr>
						<td class="titEmp">${Model.companyInfo.employee} ${employee}</td>
					</tr>
				</table>
				<table class="tblPartner">
					<tr>
						<td class="titName">CUSTOMER NAME:</td>
						<td class="valName">${this_sav.state.partner.ten_dtkd}</td>
					</tr>
					<tr>
						<td class="titEmail">Email:</td>
						<td class="valEmail">${this_sav.state.partner.email}</td>
					</tr>
					<tr>
						<td class="titAddress">Address:</td>
						<td class="valAddress">${this_sav.state.partner.address.replace(/\n/g, '<br>')}</td>
					</tr>
				</table>
				<table class="tblContent">
					<tr>
						<th>Product</th>
						<th>Image</th>
						<th style="min-width:190px">Size</th>
						<th>Packing /Master</th>
						<th>Qty/40HC</th>
						<th>Quantity/Req</th>
						<th style="display:${display}">FOB PRICE (USD)</th>
						<th style="display:${display}">Amount (USD)</th>
					</tr>
					${html}
				</table>
			`;

			html = templateHTML.replace('{Content}', html);
			this_sav.setState({html});
		});
	}
	render() {
		let this_sav = this;
		return (
			<WebView
				ref={ref => Model.webview = ref}
				source={{html: this_sav.state.html}}
				style={{flex: 1}}
				onMessage={(e)=>{this_sav.handleWebViewMessage(this_sav, e)}}
			/>
		)
	}
}

