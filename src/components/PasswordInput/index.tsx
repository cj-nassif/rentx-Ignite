import React, { useState } from 'react';
import { TextInputProps } from 'react-native';

import { BorderlessButton } from 'react-native-gesture-handler';

import { useTheme } from 'styled-components';

import { Feather } from '@expo/vector-icons';

import {
    Container,
    InputText,
    IconContainer,
} from './styles';

interface Props extends TextInputProps {
    iconName: React.ComponentProps<typeof Feather>['name']
}

export function PasswordInput(
    { iconName, ...rest }: Props
) {

    const [isPasswordVisible, setIsPasswordVisible] = useState(true);

    const theme = useTheme();

    function handlePasswordVisibilityChange() {
        setIsPasswordVisible(prevState => !prevState);
    }

    return (
        <Container >
            <IconContainer>
                <Feather
                    name={iconName}
                    size={24}
                    color={theme.colors.text_details}
                />
            </IconContainer>
            <InputText
                secureTextEntry={isPasswordVisible}
                {...rest}
            />
            <BorderlessButton onPress={handlePasswordVisibilityChange}>
                <IconContainer>
                    <Feather
                        name={isPasswordVisible ? 'eye' : 'eye-off'}
                        size={24}
                        color={theme.colors.text_details}
                    />
                </IconContainer>
            </BorderlessButton>
        </Container>
    );
}