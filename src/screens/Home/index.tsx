import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';

import { Ionicons } from '@expo/vector-icons';

import { api } from '../../services/api';

import {
    Container,
    Header,
    TotalCars,
    HeaderContent,
    CarList,
    MyCarsButton
} from './styles';

import Logo from '../../assets/logo.svg';

import { Car } from '../../components/Car';
import { Load } from '../../components/Load';
import { useNavigation } from '@react-navigation/native';

import { CarDTO } from '../../dtos/CarDTO';


export function Home() {

    const [cars, setCars] = useState<CarDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const navigation = useNavigation();

    const theme = useTheme();



    function handleCarDetails(car: CarDTO) {
        navigation.navigate('CarDetails' as never, { car } as never)
    }

    function handleOpenMyCars() {
        navigation.navigate('MyCars' as never)
    }

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get('/cars');
                setCars(response.data)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchCars();
    }, [])

    return (
        <Container>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />
            <Header>
                <HeaderContent>

                    <Logo
                        width={RFValue(108)}
                        height={RFValue(12)}
                    />
                    <TotalCars>
                        Total de {cars.length} carros
                    </TotalCars>
                </HeaderContent>
            </Header>
            {
                loading ? <Load />
                    :
                    <CarList
                        data={cars}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) =>
                            <Car
                                data={item}
                                onPress={() => { handleCarDetails(item) }}
                            />}
                    />
            }

            <MyCarsButton onPress={handleOpenMyCars}>
                <Ionicons
                    name='ios-car-sport'
                    size={32}
                    color={theme.colors.shape}
                />
            </MyCarsButton>
        </Container>
    );
}