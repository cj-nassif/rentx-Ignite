import React, { useState, useEffect } from 'react';
import { StatusBar, FlatList } from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import { useTheme } from 'styled-components';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { Car as ModelCar } from '../../database/model/Car';
import { api } from '../../services/api';

import { format, parseISO } from 'date-fns';

import { BackButton } from '../../components/BackButton';
import { Car } from '../../components/Car';
import { LoadAnimation } from '../../components/LoadAnimation';

import {
    Container,
    Header,
    Title,
    SubTitle,
    Content,
    Appointments,
    AppointmentsTitle,
    AppointmentsQuantity,
    CarWrapper,
    CarFooter,
    CarFooterTitle,
    CarFooterPeriod,
    CarFooterDate,

} from './styles';
import { useAuth } from '../../hooks/auth';



interface DataProps {
    id: string;
    car: ModelCar;
    start_date: string;
    end_date: string
}

export function MyCars() {

    const [cars, setCars] = useState<DataProps[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    const theme = useTheme();

    const navigation = useNavigation();

    const screenIsFocus = useIsFocused();

    function handleBack() {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchCars() {
            try {
                const response = await api.get('/rentals', {
                    headers: { authorization: `Bearer ${user.token}` }
                });
                const dataFormatted = response.data.map((data: DataProps) => {
                    return {
                        id: data.id,
                        car: data.car,
                        start_date: format(parseISO(data.start_date), 'dd/MM/yyy'),
                        end_date: format(parseISO(data.end_date), 'dd/MM/yyy'),
                    }
                })
                setCars(dataFormatted);

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchCars();
    }, [screenIsFocus])
    return (
        <Container>
            <Header>
                <StatusBar
                    barStyle='light-content'
                    translucent
                    backgroundColor='transparent'
                />
                <BackButton
                    onPress={handleBack}
                    color={theme.colors.shape}
                />
                <Title>
                    Escolha uma {'\n'}
                    data de início e  {'\n'}
                    fim do aluguel
                </Title>
                <SubTitle>
                    Conforto, segurança e praticidade.
                </SubTitle>

            </Header>
            {
                loading ? <LoadAnimation />
                    :
                    <Content>
                        <Appointments>
                            <AppointmentsTitle>Agendamentos Feitos</AppointmentsTitle>
                            <AppointmentsQuantity>{cars.length}</AppointmentsQuantity>
                        </Appointments>
                        <FlatList
                            data={cars}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <CarWrapper>
                                    <Car
                                        data={item.car}
                                    />
                                    <CarFooter>
                                        <CarFooterTitle>Período</CarFooterTitle>
                                        <CarFooterPeriod>
                                            <CarFooterDate>{item.start_date}</CarFooterDate>
                                            <AntDesign
                                                name='arrowright'
                                                size={20}
                                                color={theme.colors.title}
                                                style={{ marginHorizontal: 10 }}
                                            />
                                            <CarFooterDate>{item.end_date}</CarFooterDate>
                                        </CarFooterPeriod>
                                    </CarFooter>

                                </CarWrapper>
                            )}
                        />
                    </Content>
            }
        </Container>
    );
}