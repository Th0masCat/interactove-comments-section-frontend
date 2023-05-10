import { useDisclosure, useInputState } from '@mantine/hooks';
import { Modal, Button, PasswordInput, TextInput, Flex, FileInput } from '@mantine/core';
import { useState } from 'react';
import { endpoint } from '../helpers/useUser'
import { userState } from '../atoms/userAtom';
import { useRecoilState } from 'recoil';
import axios from 'axios';

export default function LoginModal(props: any) {
    const [usernameValue, setUsernameValue] = useInputState('');
    const [emailValue, setEmailValue] = useInputState('');
    const [passwordValue, setPasswordValue] = useInputState('');

    const [opened, { open, close }] = useDisclosure(true);

    const [register, setRegister] = useState(false);

    const [user, setUser] = useRecoilState(userState)
    const [imageValue, setImageValue] = useState<File | null>(null);

    const handleSignIn = () => {
        axios.post(endpoint + '/api/user/', {
            name: usernameValue,
            password: passwordValue,
            email: '',
        }).then((res) => {
            console.log(res.data)
            setUser(() => ({
                name: res.data.name,
                email: res.data.email,
                user_image: res.data.user_image,
                isLoggedin: true,
            }))
            close()
            console.log(user)
        }).catch((error) => {
            console.error(error);
            if (error.response.status === 400) {
                alert("Wrong username or password")
            }
        });

        console.log('Sign-In')
    }

    const handleRegisterClick = () => {
        setRegister(!register)
    }

    const handleRegister = () => {
        const formData = new FormData();
        formData.append('name', usernameValue);
        formData.append('password', passwordValue);
        formData.append('email', emailValue);
        formData.append('user_image', imageValue as File);

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            },

        };

        axios.post(endpoint + '/api/user/', formData, config).then((res) => {
            console.log(res.data)
            setUser(res.data)
        }).catch((error) => {
            console.error(error);
        });
        console.log('Registered')
        setPasswordValue('')
        setRegister(!register)
    }

    return (
        <>
            <Modal
                radius={'lg'}
                size={'xs'}
                opened={props.open}
                onClose={props.onClose}
                centered
                withCloseButton={false}
            >
                <Flex
                    direction='column'
                    gap={'lg'}
                    p={'lg'}
                >
                    <TextInput
                        data-autofocus
                        value={usernameValue}
                        onChange={setUsernameValue}
                        w={'100%'}
                        label="Username"
                        radius={'lg'}
                        withAsterisk
                    />

                    {
                        register ?
                            <TextInput
                                value={emailValue}
                                onChange={setEmailValue}
                                w={'100%'}
                                label="Email"
                                radius={'lg'}
                                withAsterisk />
                            : null
                    }
                    <PasswordInput
                        value={passwordValue}
                        onChange={setPasswordValue}
                        w={'100%'}
                        label="Password"
                        radius="lg"
                        withAsterisk
                    />
                    {
                        register ?
                            <FileInput
                                value={imageValue}
                                onChange={setImageValue}
                                radius={'lg'}
                                label="Upload Profile Picture"
                                placeholder="Select Profile Picture" />
                            : null
                    }
                    <Button.Group
                        mt={'lg'}
                        orientation='horizontal'
                        sx={
                            {
                                justifyContent: 'flex-end'

                        }
                    }
                    >
                        <Button
                            onClick={register ? handleRegister : handleRegisterClick}
                            styles={(theme) => ({
                                root: {
                                    backgroundColor: 'transparent',
                                    color: theme.colors.siteNeutral[0],
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    }
                                }
                            })

                            }
                        >
                            Register
                        </Button>
                        {
                            register ? null :
                                <Button
                                    onClick={handleSignIn}
                                    styles={(theme) => ({
                                        root: {
                                            backgroundColor: 'transparent',
                                            color: theme.colors.sitePrimary[0],
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                            }
                                        }
                                    })

                                    }
                                >
                                    Sign-In
                                </Button>
                        }
                    </Button.Group>
                </Flex>
            </Modal>
        </>
    );
}