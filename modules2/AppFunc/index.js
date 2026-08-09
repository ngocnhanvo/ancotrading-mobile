import React from "react";
import { SignalRFunc } from "../SignalR";
import {
	StackNavigator
} from "../tools/react-navigation";
import Drawer from '../react-native-drawer';
import { Model } from '../Model';
//#region Demo Screen
// import Header from "../screens/DemoScreen/Header/";
// import Header1 from "../screens/DemoScreen/Header/1";
// import Header2 from "../screens/DemoScreen/Header/2";
// import Header3 from "../screens/DemoScreen/Header/3";
// import Header4 from "../screens/DemoScreen/Header/4";
// import Header5 from "../screens/DemoScreen/Header/5";
// import Header6 from "../screens/DemoScreen/Header/6";
// import Header7 from "../screens/DemoScreen/Header/7";
// import Header8 from "../screens/DemoScreen/Header/8";
// import HeaderSpan from "../screens/DemoScreen/Header/header-span";
// import HeaderNoShadow from "../screens/DemoScreen/Header/header-no-shadow";
// import HeaderTransparent from "../screens/DemoScreen/Header/header-transparent";
// import BasicFooter from "../screens/DemoScreen/footer/basicFooter";
// import IconFooter from "../screens/DemoScreen/footer/iconFooter";
// import IconText from "../screens/DemoScreen/footer/iconText";
// import BadgeFooter from "../screens/DemoScreen/footer/badgeFooter";
// import Default from "../screens/DemoScreen/button/default";
// import Outline from "../screens/DemoScreen/button/outline";
// import Rounded from "../screens/DemoScreen/button/rounded";
// import Block from "../screens/DemoScreen/button/block";
// import Full from "../screens/DemoScreen/button/full";
// import Custom from "../screens/DemoScreen/button/custom";
// import Transparent from "../screens/DemoScreen/button/transparent";
// import IconBtn from "../screens/DemoScreen/button/iconBtn";
// import Disabled from "../screens/DemoScreen/button/disabled";
// import BasicCard from "../screens/DemoScreen/card/basic";
// import NHCardItemBordered from "../screens/DemoScreen/card/carditem-bordered";
// import NHCardItemButton from "../screens/DemoScreen/card/carditem-button";
// import NHCardImage from "../screens/DemoScreen/card/card-image";
// import NHCardShowcase from "../screens/DemoScreen/card/card-showcase";
// import NHCardList from "../screens/DemoScreen/card/card-list";
// import NHCardHeaderAndFooter from "../screens/DemoScreen/card/card-header-and-footer";
// import NHCardTransparent from "../screens/DemoScreen/card/card-transparent";
// import NHCardCustomBorderRadius from "../screens/DemoScreen/card/card-custom-border-radius";
// import BasicFab from "../screens/DemoScreen/fab/basic";
// import MultipleFab from "../screens/DemoScreen/fab/multiple";
// import FixedLabel from "../screens/DemoScreen/form/fixedLabel";
// import InlineLabel from "../screens/DemoScreen/form/inlineLabel";
// import FloatingLabel from "../screens/DemoScreen/form/floatingLabel";
// import PlaceholderLabel from "../screens/DemoScreen/form/placeholder";
// import StackedLabel from "../screens/DemoScreen/form/stacked";
// import RegularInput from "../screens/DemoScreen/form/regular";
// import UnderlineInput from "../screens/DemoScreen/form/underline";
// import RoundedInput from "../screens/DemoScreen/form/rounded";
// import IconInput from "../screens/DemoScreen/form/iconInput";
// import SuccessInput from "../screens/DemoScreen/form/success";
// import ErrorInput from "../screens/DemoScreen/form/error";
// import DisabledInput from "../screens/DemoScreen/form/disabledInput";
// import PickerInput from "../screens/DemoScreen/form/pickerInput";
// import Icons from "../screens/DemoScreen/icon/icon";
// import BasicIcon from "../screens/DemoScreen/icon/basic";
// import StateIcon from "../screens/DemoScreen/icon/state";
// import PlatformSpecificIcon from "../screens/DemoScreen/icon/platform-specific";
// import IconFamily from "../screens/DemoScreen/icon/icon-family";
// import RowNB from "../screens/DemoScreen/layout/row";
// import ColumnNB from "../screens/DemoScreen/layout/column";
// import NestedGrid from "../screens/DemoScreen/layout/nested";
// import CustomRow from "../screens/DemoScreen/layout/customRow";
// import CustomCol from "../screens/DemoScreen/layout/customCol";
// import BasicListSwipe from "../screens/DemoScreen/listSwipe/basic-list-swipe";
// import SwipeRowCustomStyle from "../screens/DemoScreen/listSwipe/swipe-row-style";
// import MultiListSwipe from "../screens/DemoScreen/listSwipe/multi-list-swipe";
// import NHBasicList from "../screens/DemoScreen/list/basic-list";
// import NHListItemSelected from "../screens/DemoScreen/list/listitem-selected";
// import NHListDivider from "../screens/DemoScreen/list/list-divider";
// import NHListSeparator from "../screens/DemoScreen/list/list-separator";
// import NHListHeader from "../screens/DemoScreen/list/list-headers";
// import NHListIcon from "../screens/DemoScreen/list/list-icon";
// import NHListAvatar from "../screens/DemoScreen/list/list-avatar";
// import NHListThumbnail from "../screens/DemoScreen/list/list-thumbnail";
// import NHListItemNoIndent from "../screens/DemoScreen/list/listitem-noIndent";
// import RegularPicker from "../screens/DemoScreen/picker/regularPicker";
// import PickerWithIcon from "../screens/DemoScreen/picker/picker-with-icon";
// import PlaceholderPicker from "../screens/DemoScreen/picker/placeholderPicker";
// import PlaceholderPickerNote from "../screens/DemoScreen/picker/placeholderPickernote";
// import BackButtonPicker from "../screens/DemoScreen/picker/backButtonPicker";
// import PickerTextItemText from "../screens/DemoScreen/picker/picker-text-itemtext";
// import HeaderPicker from "../screens/DemoScreen/picker/headerPicker";
// import HeaderStylePicker from "../screens/DemoScreen/picker/headerStylePicker";
// import CustomHeaderPicker from "../screens/DemoScreen/picker/customHeaderPicker";
// import BasicTab from "../screens/DemoScreen/tab/basicTab";
// import ConfigTab from "../screens/DemoScreen/tab/configTab";
// import ScrollableTab from "../screens/DemoScreen/tab/scrollableTab";
// import BasicSegment from "../screens/DemoScreen/segment/SegmentHeader";
// import SegmentHeaderIcon from "../screens/DemoScreen/segment/SegmentHeaderIcon";
// import BasicToast from "../screens/DemoScreen/toast/basic-toast";
// import ToastDuration from "../screens/DemoScreen/toast/toast-duration";
// import ToastPosition from "../screens/DemoScreen/toast/toast-position";
// import ToastType from "../screens/DemoScreen/toast/toast-type";
// import ToastText from "../screens/DemoScreen/toast/toast-text";
// import ToastButton from "../screens/DemoScreen/toast/toast-button";
// import RegularActionSheet from "../screens/DemoScreen/actionsheet/regular";
// import IconActionSheet from "../screens/DemoScreen/actionsheet/icon";
// import AdvSegment from "../screens/DemoScreen/segment/segmentTab";
// import SimpleDeck from "../screens/DemoScreen/deckswiper/simple";
// import AdvancedDeck from "../screens/DemoScreen/deckswiper/advanced";
// import HeaderNoLeft from "../screens/DemoScreen/Header/header-noLeft";
// import NHCustomRadio from "../screens/DemoScreen/radio/custom";
// import NHDefaultRadio from "../screens/DemoScreen/radio/default";
// import PickerWithIconStyle from "../screens/DemoScreen/picker/picker-with-iconstyle";
// import AccordionDefault from "../screens/DemoScreen/accordion/accordion-default";
// import AccordionIcon from "../screens/DemoScreen/accordion/accordion-icon";
// import AccordionIconStyle from "../screens/DemoScreen/accordion/accordion-icon-style";
// import AccordionHeaderContentStyle from "../screens/DemoScreen/accordion/accordion-header-content-style";
// import AccordionCustomHeaderContent from "../screens/DemoScreen/accordion/accordion-custom-header-content";

// import Footer from "../screens/DemoScreen/footer/";
// import NHBadge from "../screens/DemoScreen/badge/";
// import NHButton from "../screens/DemoScreen/button/";
// import NHCard from "../screens/DemoScreen/card/";
// import NHCheckbox from "../screens/DemoScreen/checkbox/";
// import NHDeckSwiper from "../screens/DemoScreen/deckswiper/";
// import NHFab from "../screens/DemoScreen/fab/";
// import NHForm from "../screens/DemoScreen/form/";
// import TextArea from "../screens/DemoScreen/form/textArea";
// import NHIcon from "../screens/DemoScreen/icon/";
// import ListSwipe from "../screens/DemoScreen/listSwipe/";
// import NHLayout from "../screens/DemoScreen/layout/";
// import NHList from "../screens/DemoScreen/list/";
// import NHRadio from "../screens/DemoScreen/radio/";
// import NHSearchbar from "../screens/DemoScreen/searchbar/";
// import NHSpinner from "../screens/DemoScreen/spinner/";
// import NHPicker from "../screens/DemoScreen/picker/";
// import NHTab from "../screens/DemoScreen/tab/";
// import NHThumbnail from "../screens/DemoScreen/thumbnail/";
// import NHTypography from "../screens/DemoScreen/typography/";
// import Segment from "../screens/DemoScreen/segment";
// import NHToast from "../screens/DemoScreen/toast/";
// import Actionsheet from "../screens/DemoScreen/actionsheet";
// import NHAccordion from "../screens/DemoScreen/accordion/";
// import NHDatePicker from "../screens/DemoScreen/datepicker/";
//#endregion Demo Screen
import SideBar from "../screens/sidebar";

import Home from "../screens/home/";
import Scan from "../screens/scan/";
import GetData from "../screens/getdata/";
// import ProductDetail from "../screens/productDetail/";
import Cart from "../screens/cart/";
import SearchProduct from "../screens/searchProduct/";
import Quotation from "../screens/quotation/";
import QuotationSent from "../screens/quotationSent/";
import Login from "../screens/login/";
// import PreviewEmail from "../screens/previewEmail/";
class AppFunc {
	constructor() {

	}
	static DrawerF(this_sav, props, name, element) {
		return (
			<Drawer
				ref={
					drawer => {
						Model.objectM.drawer = drawer
					}
				}
				disabled={true}
				type="static"
				tapToClose={true}
				acceptTap={true}
				openDrawerOffset={100}
				captureGestures={false}
				tweenDuration={100}
				panThreshold={0.08}
				closedDrawerOffset={() => 0}
				panOpenMask={0.2}
				negotiatePan
				content={
					<SideBar {...props}
						ref={
							sidebar => {
								Model.objectM.sidebar = sidebar;
							}
						}
					/>
				}
				updateCount={
					() => {
						Model.objectM.sidebar.updateCount();
					}
				}
				styles={{ main: { shadowColor: '#000000', shadowOpacity: 0.3, shadowRadius: 15 } }}
			>
				{element}
			</Drawer>
		)
	}

	static AppNavigatorF(this_sav) {
		let AppNavigator = StackNavigator({
			Home: {
				screen: props => {
					Model.navigatePublic = props;
					return (
						<Home {...props} />
					)
				}
			},
			Scan: {
				screen: props => {
					Model.navigatePublic = props;
					return (
						<Scan {...props} />
					)
				}
			},
			GetData: {
				screen: props => {
					Model.navigatePublic = props;
					return (
						<GetData {...props} />
					)
				}
			},
			SearchProduct: {
				screen: props => {
					Model.navigatePublic = props;
					return (
						<SearchProduct {...props} />
					)
				}
			},
			Cart: {
				screen: props => {
					Model.navigatePublic = props;
					return (
						<Cart {...props} />
					)
				}
			},
			Quotation: {
				screen: props => {
					Model.navigatePublic = props;
					return (
						<Quotation {...props} />
					)
				}
			},
			QuotationSent: {
				screen: props => {
					Model.navigatePublic = props;
					return (
						<QuotationSent {...props} />
					)
				}
			},
			QuotationSent: {
				screen: props => {
					Model.navigatePublic = props;
					return (
						<QuotationSent {...props} />
					)
				}
			},
			Login: {
				screen: props => {
					Model.navigatePublic = props;
					return (
						<Login {...props} />
					)
				}
			}
		}, {
			initialRouteName: 'Home',
			headerMode: "none",
			navigationOptions: {
				gestureEnabled: false
			}
		})

		return AppNavigator;
	}
}

export {
	AppFunc
};
