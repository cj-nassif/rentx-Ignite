import React from 'react';
import { Feather } from '@expo/vector-icons';

import { BackButton } from '../../components/BackButton';

import { useTheme } from 'styled-components';

import { useNavigation } from '@react-navigation/native';

import {
  Container,
  Header,
  HeaderTop,
  HeaderTitle,
  LogOutButton,
  PhotoContainer,
  Photo,
  PhotoButton,
} from './styles';


export function Profile() {

  const theme = useTheme();

  const navigation = useNavigation();

  function handleBack() {
    navigation.goBack();
  }

  function handleSignOut() {

  }
  return (
    <Container>
      <Header>
        <HeaderTop>
          <BackButton
            color={theme.colors.shape}
            onPress={handleBack}
          />
          <HeaderTitle>Editar Perfil</HeaderTitle>
          <LogOutButton onPress={handleSignOut}>
            <Feather
              name='power'
              size={24}
              color={theme.colors.shape}
            />
          </LogOutButton>
        </HeaderTop>
        <PhotoContainer>
          <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/83364789?v=4' }} />
          <PhotoButton onPress={() => { }}>
            <Feather
              name='camera'
              size={24}
              color={theme.colors.shape}
            />
          </PhotoButton>
        </PhotoContainer>
      </Header>

    </Container>
  );
}