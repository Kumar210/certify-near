"use client"

import React from 'react'
import { Card, Image, Text, Badge, Button, Group, Box } from '@mantine/core';
import { colors } from '@/utils/colorCode';

const index = ({ item }: any) => {
    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder h={460} style={{ backgroundColor: colors.bg }}>
                <Card.Section >
                    <Image
                        src={item?.metadata?.media}
                        style={{ height: "250px", objectFit: "fill", width: "100%" }}

                        alt="Norway"
                    />
                </Card.Section>
                <Box pt={'md'}>

                    <Group justify="space-between" mt="md" mb="xs">
                        <Text fw={500} c={colors.text}>{item?.metadata?.title}</Text>
                        <Badge color="pink">
                            {item?.token_id}
                        </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" >
                        {item?.metadata?.description}
                    </Text>
                </Box>


            </Card>
        </>
    )
}

export default index