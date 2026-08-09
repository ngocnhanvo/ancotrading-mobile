import React, { Component } from "react";
import { Image, View,ImageBackground } from "react-native";
import { Model } from '../../Model';
import FontAwesome from '../../tools/winta-font-awesome';
import { guid } from '../../Public_func';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Content,
  Text,
  List,
  ListItem,
  Container,
  Left,
  Right,
  Badge
} from "../../tools/native-base";
import styles from "./style";
import { ThongTin, GioHang, BaoGia, BaoGiaSP } from "../../Model/tableSQL";

let datas = [
  {
    id: 'home',
    name: "Home Page",
    route: "Home",
    icon: "fa-home",
    bg: "#C5F442"
  },
  {
    id: 'getdata',
    name: "Get Data",
    route: "GetData",
    icon: "fa-cog",
    bg: "#C5F442"
  },
  {
    id: 'scan',
    name: "Scan QRCode",
    route: "Scan",
    icon: "fa-barcode",
    bg: "#C5F442"
  },
  {
    id: 'search',
    name: "Search Products",
    route: "SearchProduct",
    icon: "fa-search",
    bg: "#C5F442"
  },
  {
    id: 'cart',
    name: "Cart",
    route: "Cart",
    icon: "fa-cart-plus",
    bg: "#4CAF50",
    types: "0"
  },
  {
    id: 'quotation',
    name: "Pending Quotations",
    route: "Quotation",
    icon: "fa-calculator",
    bg: "#4CAF50",
    types: "0"
  },
  {
    id: 'quotationSent',
    name: "Sent Quotations",
    route: "QuotationSent",
    icon: "fa-calculator",
    bg: "#4CAF50",
    types: "0"
  },
  // {
  //   id: 'crash',
  //   name: "Crash",
  //   route: "Crash",
  //   icon: "fa-bug",
  //   bg: "#C5F442"
  // }
];

let this_sav = null;
class SideBar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			shadowOffsetWidth: 1,
			shadowRadius: 4
    };
    this_sav = this;
	}
	UNSAFE_componentWillMount() {
    this.updateCount();
    this.updateQuotationCount();
    this.updateQuotationSentCount();
    this.setUser();
		//datas = datas.concat(datasDemo);
  }
  setUser(callback) {
    this.getUser((user)=> {
      if(user.status) {
        datas = datas.filter((a)=>{return a.id != "login";});
        datas.push({
          id: 'logout',
          name: "Sign out",
          route: "Logout",
          icon: "fa-sign-out",
          bg: "#4CAF50",
        });
      }
      else {
        datas = datas.filter((a)=>{return a.id != "logout";});
        datas.push({
          id: 'login',
          name: "Sign in",
          route: "Login",
          icon: "fa-sign-in",
          bg: "#4CAF50",
        });
      }

      if(callback)
        callback(user);
    });
  }
  getUser(callback) {
    AsyncStorage.getItem(Model.nhanvien).then((response) => {
      if(!response)
        response = "{}";
      
        let nhanvien = JSON.parse(response);
        if(nhanvien.status) {
          Model.UserName = nhanvien.user;
					Model.PassWord = nhanvien.key;
          Model.UserFullName = nhanvien.name;
        }

        if(callback)
          callback(nhanvien);
    });
  }
  getDateCollectData(callback) {
    ThongTin.getThongTins({ page: 1, take: 1}, (getdatas) => {
        let dateStr = 'Not found (404)';
        if(getdatas.length > 0) {
          dateStr = getdatas[0].dateStr;
        }
        callback(dateStr);
    });
  }
  updateCount(callback) {
    try {
      let index = datas.findIndex((el)=>{
        return el.route == 'Cart'
      });
      
      const modify_FN = (a)=> {
        Model.this_sav.state.count_cart = a;
        if(Model.headerSPD) {
          Model.headerSPD.setState({count_cart: a});
        }
        if(callback)
          callback(a);
      };

      let count = 0;
      if(index > 0) {
        GioHang.countGioHangs(null, (res)=>{
          if(res)
            count = res.total;
          datas[index].types = count + '';
          this_sav.forceUpdate();
          modify_FN(count);
        });
      }
      else {
        modify_FN(count);
      }
    }
    catch(e) {
      console.error(e);
    }
  }
  updateQuotationCount(callback) {
    let index = datas.findIndex((el)=>{
      return el.route == 'Quotation'
    });

    const modify_FN = (a)=> {
      if(callback)
        callback(a);
    };

    let count = 0;
    if(index > 0) {
      BaoGia.countBaoGias({where: 'status = 0'}, (res) => {
        if(res)
          count = res.total;
        datas[index].types = count + '';
        
        this_sav.forceUpdate();
        modify_FN(count);
      });
    }
    else {
      modify_FN(count);
    }
  }
  updateQuotationSentCount(callback) {
    let index = datas.findIndex((el)=>{
      return el.route == 'QuotationSent'
    });

    const modify_FN = (a)=> {
      if(callback)
        callback(a);
    };

    let count = 0;
    if(index > 0) {
      BaoGia.countBaoGias({where: `status = 1 and username = '${Model.UserName}'`}, (res) => {
        if(res)
          count = res.total;
        datas[index].types = count + '';
        
        this_sav.forceUpdate();
        modify_FN(count);
      });
    }
    else {
      modify_FN(count);
    }
  }
  addtoCart(data, callback) {
    Model.objectM.spinnerMain.show();
    const afterModify = () => {
      Model.objectM.sidebar.updateCount((a)=> {
        Model.objectM.dialogboxMain.disableOverlayClickClose(false);
        if(data[0].scan) {
          Model.objectM.dialogboxMain.alert('Successful');
          Model.objectM.spinnerMain.close();
        }
        else {
          a = null;
        }

        if(callback)
          callback(a);
      });
    };
    let where = `itemNo = '${data[0].itemNo}'`;
    GioHang.getGioHangs({where},(cart) => {
      if(cart.length <= 0) {
        where = `itemNo = '${data[0].itemNo_old}'`;
        GioHang.deleteGioHangs({where}, () => {
          GioHang.insertGioHangs(data, () => {
            afterModify();
          });
        });
      }
      else {
        if(data[0].selCL) {
          callback(`Product "${data[0].itemNo}" already exists`);
        }
        else {
          GioHang.updateGioHangs(data, () => {
            afterModify();
          });
        }
      }
    });
	}
  addtoQuotationCart = (data, callback) => {
    Model.objectM.spinnerMain.show();
    const afterModify = (a) => {
      if(callback)
        callback(a);
    };
  
    let where = `BaoGiaID = ${data[0].BaoGiaID} and itemNo = '${data[0].itemNo}'`;
    BaoGiaSP.getBaoGiaSPs({where, take: 1},(cart) => {
      if(cart.length <= 0) {
        where = `BaoGiaID = ${data[0].BaoGiaID} and itemNo = '${data[0].itemNo_old}'`;
        BaoGiaSP.deleteBaoGiaSPs({where}, () => {
          BaoGiaSP.insertBaoGiaSPs(data, () => {
            afterModify('');
            });
        });
      }
      else {
        if(data[0].selCL) {
          afterModify(`Product "${data[0].itemNo}" already exists`);
        }
        else {
          BaoGiaSP.updateBaoGiaSPs(data, () => {
            afterModify('');
          });
        }
      }
    });
  }
	render() {
    this_sav = this;
		return (
			<Container>
				<Content
				  bounces={false}
				  style={{ flex: 1, backgroundColor: "#fff", top: -1, borderRightWidth: 1.5, borderRightColor: 'rgba(60,114,0,1)' }}
				>
					<ImageBackground source={Model.backGround} style={styles.drawerCover} resizeMode="stretch">
						<View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
							<Image
							  source={Model.Avatar} style={{width: 80, height: 80, borderRadius: 40, borderColor: '#FFF', borderWidth: 1, resizeMode: 'cover'}}
							/>
							<Text style={{color: '#FFF', fontWeight: 'bold'}}>{Model.UserName}</Text>
						</View>
					</ImageBackground>
					<List
					dataArray={datas}
					renderRow={data =>
						<ListItem
							button
							noBorder
							onPress={
								() => {
									if(data.name == 'Sign out') {
										Model.objectM.dialogboxMain.pop({
                      title: `${data.name}`,
                      vnnType: 1,
                      content: (
                      <View style={{alignItems: 'center', width: 300}}>
                        <Text style={{color: '#000', textAlign:'center'}}>Would you like to sign out of your account?</Text>
                      </View>
                      ),
                      btns: [
                        {
                          text: 'No, I don\'t',
                          callback: () => {
                            Model.objectM.dialogboxMain.close();
                          }
                        },
                        {
                          text: 'Yes, I do',
                          callback: () => {
                            AsyncStorage.removeItem(Model.nhanvien, ()=>{
                              Model.UserName = "";
                              Model.UserFullName = "";
                              this_sav.setUser(()=>{
                                this_sav.forceUpdate();
                                if(Model.this_sav) {
                                  if(Model.this_sav.createPage) {
                                    Model.this_sav.createPage(Model.this_sav);
                                  }
                                }
                              });
                            });
                            Model.objectM.dialogboxMain.close();
                          }
                        }
                      ]
                    });
                  }
                  else if(data.name == 'Crash') {
										Model.objectM.dialogboxMain.pop({
                      title: 'Test Bug Crash',
                      vnnType: 1,
                      content: (
                      <View>
                        <Text>Do you want to crash app???.</Text>
                      </View>
                      ),
                      btns: [
                        {
                          text: 'No, I don\'t',
                          callback: () => {
                            Model.objectM.dialogboxMain.close();
                          }
                        },
                        {
                          text: 'Yes, I do',
                          callback: () => {
                            let err = Model.UserName + ': Test Crash' + guid();
                            Model.Sentry.captureException(err);
                            throw new Error(err);
                          }
                        }
                      ]
                    });
									}
									else if(data.params != null) {
										Model.navigatePublic.navigation.navigate(data.route, data.params);
									}
									else {
                    Model.objectM.drawer.closeFast();
                    if(Model.mainScreen != data.route) {
                      Model.navigatePublic.navigation.navigate(data.route, { data: "" });
                      Model.mainScreen = data.route;
                    }
									}
								}
							}
						>
						<Left>
							<FontAwesome
								name={data.icon}
								style={{ color: "#777", fontSize: 26, width: 30 }}
							/>
							<Text style={styles.text}>
								{data.name} {data.types ? "(" + data.types + ")" : ""}
							</Text>
						</Left>
            {
              // data.types &&
              //   <Right style={{ flex: 1 }}>
              //     <Badge
              //       style={{
              //         borderRadius: 3,
              //         height: 25,
              //         width: 30,
              //         backgroundColor: data.bg
              //       }}
              //     >
              //       <Text
              //         style={styles.badgeText}
              //       >
              //         {`${data.types}`}
              //       </Text>
              //     </Badge>
              //   </Right>
              }
            </ListItem>
            }
					/>
				</Content>
			</Container>
		);
	}
}

export default SideBar;
