import React from "react";
import { StatusBar } from "expo-status-bar";
import {
    Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
 
} from "react-native";
import { Agenda,Calendar } from "react-native-calendars";


export default function CalenderScreen() {
 

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        selected={new Date()}
        // onDayPress={(day) => openModal(day.dateString)}
        markedDates={{
          "2024-05-23": { marked: true, dotColor: "red", },
          "2024-05-24": { marked: true ,dotColor: "red",},
        
        }}
        />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
 
});
