import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AppButton from '../components/buttons/Tab';
import colors from '../config/colors';
import Geolocation from '@react-native-community/geolocation';
import routes from '../navigation/routes';

export default function MapViewScreen({ navigation }) {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0421,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (pos) => {
        const crd = pos.coords;
        setRegion({
          latitude: crd.latitude,
          longitude: crd.longitude,
          latitudeDelta: 0.0421,
          longitudeDelta: 0.0421,
        });
      },
      (err) => {
        console.error(err);
      },
    );
  }, []);

  const onRegionChange = (nextRegion) => {
    setRegion(nextRegion);
  };
  const confirmLocation = () => {
    navigation.navigate(routes.SHIPPING_ADDRESS, { location: region });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        onRegionChange={onRegionChange}
      >
        <Marker
          draggable
          coordinate={{ latitude: region.latitude, longitude: region.longitude }}
          title={'marker.title'}
          description={'marker.description'}
        />
      </MapView>
      <AppButton
        onPress={() => confirmLocation()}
        style={styles.payButton}
        title={'Confirm Location'}
        width={'70%'}
        color={colors.iondigoDye}
        fontColor={colors.white}
      />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  map: {
    height: '50%',
  },
  payButton: {
    borderRadius: 12,
    marginVertical: 50,
    marginHorizontal: '15%',
  },
});
