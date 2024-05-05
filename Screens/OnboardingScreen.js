import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import Onboarding from "react-native-onboarding-swiper";
import { useNavigation } from "@react-navigation/native";
const OnboardingScreen = () => {
  const navigation = useNavigation();
  return (
    <Onboarding
      titleStyles={{ fontSize: RFValue(20) }}
      subTitleStyles={{
        fontSize: RFValue(12),
        alignContent: "center",
        padding: 10,
        textAlign: "center",
      }}
      onSkip={() => navigation.navigate("Tabs")}
      onDone={() => navigation.navigate("Tabs")}
      pages={[
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={styles.img}
              source={require("../assets/Onboarding/2.webp")}
            />
          ),
          title: "Welcome to Our App!",
          subtitle:
            "Dive into seamless scheduling with our intuitive calendar app. Effortlessly organize meetings, events, and more, all in one place.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={styles.img}
              source={require("../assets/Onboarding/8.png")}
            />
          ),
          title: "Stay Organized",
          subtitle:
            "Keep track of your busy schedule with our powerful calendar features. From setting reminders to managing invitations, we've got you covered.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={styles.img}
              source={require("../assets/Onboarding/3.webp")}
            />
          ),
          title: "Simplify Meeting Planning",
          subtitle:
            "Say goodbye to the hassle of scheduling meetings. Our app streamlines the process, making it easy to find the perfect time for everyone.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              style={styles.img}
              source={require("../assets/Onboarding/4.webp")}
            />
          ),
          title: "Get Started",
          subtitle:
            "Ready to make scheduling a breeze? Jump right in and start exploring all the features our app has to offer. Let's make every meeting count.",
        },
      ]}
    />
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  imgContainer: {
    width: 300,
    height: 300,
  },
  img: {
    width: wp("100%"),
    height: hp("40%"),
    objectFit: "contain",
  },
});
