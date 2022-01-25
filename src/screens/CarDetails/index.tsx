import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';

import { BackButton } from '../../components/BackButton';
import { ImageSlider } from '../../components/ImageSlider';
import { Acessory } from '../../components/Acessory';
import { Button } from '../../components/Button';

import { useTheme } from 'styled-components';

import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';


import { useNavigation, useRoute } from '@react-navigation/native';


import { CarDTO } from '../../dtos/CarDTO';
import { Car as ModelCar } from '../../database/model/Car';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import { api } from '../../services/api';

import { useNetInfo } from '@react-native-community/netinfo';

import {
    Container,
    Header,
    CarImages,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    About,
    Accessories,
    Footer,
    OfflineInfo
} from './styles';
interface Params {
    car: CarDTO;
}

export function CarDetails() {


    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);

    const navigation = useNavigation();
    const route = useRoute();
    const { car } = route.params as Params;

    const netInfo = useNetInfo();

    const theme = useTheme();

    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    })

    const headerStyleAnimation = useAnimatedStyle(() => {
        return {
            height: interpolate(
                scrollY.value,
                [0, 200],
                [200, 70],
                Extrapolate.CLAMP
            )
        }
    })

    const sliderCarsStyleAnimation = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, 150],
                [1, 0],
                Extrapolate.CLAMP
            )
        }
    })
    function handleConfirmRental() {
        navigation.navigate('Scheduling' as never, { car } as never)
    }

    function handleBack() {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchCarUpdated() {
            const response = await api.get(`/cars/${car.id}`)
            setCarUpdated(response.data);
            console.log(carUpdated)
        }
        if (netInfo.isConnected === true) {
            fetchCarUpdated();
        }
    }, [netInfo.isConnected])

    return (
        <Container>
            <StatusBar
                barStyle='dark-content'
                translucent
                backgroundColor='transparent'

            />
            <Animated.View
                style={[headerStyleAnimation,
                    styles.header,
                    { backgroundColor: theme.colors.backgroud_secondary }

                ]}
            >


                <Header>
                    <BackButton
                        onPress={handleBack}

                    />
                </Header>


                <Animated.View style={sliderCarsStyleAnimation}>
                    <CarImages>
                        <ImageSlider
                            imageUrl={
                                !!carUpdated.photos ?
                                    carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]

                            }
                        />

                    </CarImages>
                </Animated.View>
            </Animated.View>
            <Animated.ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: getStatusBarHeight() + 160,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={32}
            >
                <Details>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>

                    <Rent>
                        <Period>{car.period}</Period>
                        <Price>R$ {netInfo.isConnected ? car.price : '...'}</Price>
                    </Rent>
                </Details>
                {
                    carUpdated.accessories &&
                    <Accessories>
                        {
                            carUpdated.accessories.map(accessory => (

                                <Acessory
                                    key={accessory.type}
                                    name={accessory.name}
                                    icon={getAccessoryIcon(accessory.type)}
                                />
                            ))

                        }
                    </Accessories>
                }
                <About>
                    {car.about}
                    {car.about}
                    {car.about}
                    {car.about}
                    {car.about}
                </About>
            </Animated.ScrollView>
            <Footer>
                <Button
                    title='Escolher período do aluguel'
                    onPress={handleConfirmRental}
                    enabled={netInfo.isConnected === true}
                />
                {
                    netInfo.isConnected === false &&
                    <OfflineInfo>
                        Conecte-se a internet para ver mais detalhes e agendar seu carro.
                    </OfflineInfo>

                }
            </Footer>

        </Container>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 1,
    }
})