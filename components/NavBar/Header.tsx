import { Box, Button, Container, Grid, Group, Text, Title } from "@mantine/core";
import HomeGif from "../../assets/gif4.gif"
import Image from "next/image";
import { useMediaQuery } from '@mantine/hooks';
import { colors } from "@/utils/colorCode";
export function Header() {
  const matches = useMediaQuery('(max-width: 1000px)');
  return (
    <Box style={{ backgroundColor: colors.bg, height: "100vh" }}>
      <Box style={{ paddingInline: "11%" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingInline: "10px",
            alignItems: "center",
            paddingTop: "10px",
          }}
        >
          <Title order={2} c={"white"}>CERTIFY</Title>
          <Group gap={"xl"}>

            <Button variant="default" radius="xl" c={"black"}>Connect</Button>
          </Group>
        </Box>
        <Box style={{
          paddingInline: "10px",
          paddingTop: "70px"
        }}>
          <Grid>
            <Grid.Col span={matches ? 12 : 6} c={"white"}>
              <Box w={"50%"} style={{}}>
                <Text style={{ fontSize: "65px", lineHeight: "70px", color: colors.text }}>Creative Thoughts Agency</Text>
              </Box>

              <Text pt={"lg"} c={colors.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident veniam aut distinctio, sed soluta, ullam consequuntur deserunt exercitationem</Text>
              <Group pt={"lg"}>
                <Button>Connect to Wallet --></Button>
              </Group>
              {/* <Group pt={"lg"}>
                <Button>Explorer --></Button>
              </Group> */}
            </Grid.Col>
            <Grid.Col span={matches ? 12 : 6} style={{ display: matches ? "none" : "block" }} >
              <Box style={{ display: "flex", alignItems: "start", justifyContent: "start", height: "400px" }}>

                <Image src={HomeGif} alt="kk" style={{ height: "" }} />
              </Box>
            </Grid.Col>
          </Grid>
        </Box>

      </Box>
      <Box style={{
        position: "absolute",
        bottom: 12,
        display: "flex",
        justifyContent: "space-between",
        width: "100%",

        color: "white",
        textAlign: "center",
        paddingInline: "11%"
      }}>
        <Text style={{ fontSize: "13px", color: "gray" }}>@ 2022-2024 All rights reserved</Text>
        <Box c="gray">
          <Group gap={"lg"} style={{ fontSize: "13px" }}>

            <Text >Terms</Text>
            <Text>Policy</Text>
            <Text>Cookies</Text>
          </Group>
        </Box>

      </Box>
    </Box>


  );
}
