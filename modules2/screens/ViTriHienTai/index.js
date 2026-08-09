import React, { PureComponent } from 'react';
import { Model } from '../../Model';
import {
	View,
	Text,
	ImageBackground,
	Image
} from 'react-native';

import {
	Container,
	Button,
	Header,
	Left,
	Right,
	Body,
	Title
} from "native-base";

import styles from './styles.js';
import MapView from 'react-native-maps';
import FontAwesome from '../../tools/winta-font-awesome';
import BackgroundTimer from 'react-native-background-timer';

export default class ViTriHienTai extends PureComponent {
	constructor(props) {
		super(props)
		this.state = {
			latitude: 0,
			longitude: 0,
			latitudeDelta: 0,
			longitudeDelta: 0,
			latitudeExec: 0,
			longitudeExec: 0,
			error: null,
		}
	}
	componentWillMount() {

	}
	componentDidMount() {
		var this_sav = this;
		navigator.geolocation.getCurrentPosition(
			(position) => {
				let initregion = Model.getRegionForCoordinates([
					{
						latitude: position.coords.latitude,
						longitude: position.coords.longitude
					}
				]);
				this_sav.setState({
					latitude: initregion.latitude,
					longitude: initregion.longitude,
					latitudeDelta: initregion.latitudeDelta,
					longitudeDelta: initregion.longitudeDelta,
					latitudeExec: position.coords.latitude,
					longitudeExec: position.coords.longitude,
					error: null
				});
			},
			(error) => this_sav.setState({ error: error.message }),
			{ enableHighAccuracy: false, timeout: 30000, maximumAge: 1000 },
		);

		BackgroundTimer.runBackgroundTimer(() => 
		{ 
			var jsonStr = {
				Username: Model.UserName,
				Latitude: this_sav.state.latitudeExec,
				Longitude: this_sav.state.longitudeExec
			};
			Model.execSignalR('shareGGMap', jsonStr, () =>{ });
		},
		30000);
	}
	componentWillUnmount() {
		BackgroundTimer.stopBackgroundTimer();
	}
	render() {
		var this_sav = this;
		if (this_sav.state.latitude == 0 &
			this_sav.state.longitude == 0 &
			this_sav.state.latitudeDelta == 0 &
			this_sav.state.longitudeDelta == 0) {
			return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Đang nạp dữ liệu...</Text></View>;
		}
		return (
			<Container>
				<ImageBackground source={Model.backGround} style={styles.drawerCover} resizeMode="stretch">
					<Header
						style={{ backgroundColor: "transparent" }}
						androidStatusBarColor="#000"
						iosBarStyle="light-content"
					>
						<Left style={{ backgroundColor: "transparent" }}>
							<Button transparent onPress={() => { this_sav.props.navigation.navigate('HomeDetail', {routeN: 'VanTai'}) }}>
								<FontAwesome name="ion-md-arrow-back" style={{ color: "#FFF" }} />
							</Button>
						</Left>
						<Body>
							<Title>Vị trí của bạn</Title>
						</Body>
						<Right>
							<Image source={Model.logoHeader} style={{ flex: 1, width: 220, height: 40, resizeMode: 'contain' }} />
						</Right>
					</Header>
				</ImageBackground>
				<MapView
					ref={ref => this_sav.mapView = ref}
					style={styles.map}
					initialRegion={{
						latitude: this_sav.state.latitude,
						longitude: this_sav.state.longitude,
						latitudeDelta: 0.005,
						longitudeDelta: 0.005
					}}
				>
					{!!this_sav.state.latitudeExec && !!this_sav.state.longitudeExec && <MapView.Marker
						coordinate={{ "latitude": this_sav.state.latitudeExec, "longitude": this_sav.state.longitudeExec }}
						title={"Your Location"}
					/>}
				</MapView>
			</Container>
		);
	}
}