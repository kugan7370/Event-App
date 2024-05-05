import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Modal,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Agenda } from "react-native-calendars";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "../Utils";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function EventScreen() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const [isStartTimePickerVisible, setIsStartTimePickerVisible] =
    useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] =
    useState(false);
  const [
    isNotificationDateTimePickerVisible,
    setIsNotificationDateTimePickerVisible,
  ] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    startTime: "",
    endTime: "",
    note: "",
    notificationTime: "",
    dateWithStartTime: "",
  });
  const [eventsData, setEventsData] = useState({});

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to receive notifications was denied");
        return;
      }
    })();
  }, []);

  const openModal = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);

    setEventDetails({
      title: "",
      startTime: "",
      endTime: "",
      note: "",
      notificationTime: "",
      dateWithStartTime: "",
    });
  };

  const saveEvent = async () => {
   
    let setNotificationTime;
    if (eventDetails.notificationTime === "15 minutes before") {
      setNotificationTime = new Date(eventDetails.dateWithStartTime);
      setNotificationTime.setMinutes(setNotificationTime.getMinutes() - 15);
      console.log("Notification time---:", setNotificationTime);
    } else if (eventDetails.notificationTime === "1 hour before") {
      setNotificationTime = new Date(eventDetails.dateWithStartTime);
      setNotificationTime.setHours(setNotificationTime.getHours() - 1);
    } else if (eventDetails.notificationTime === "1 day before") {
      setNotificationTime = new Date(eventDetails.dateWithStartTime);
      setNotificationTime.setDate(setNotificationTime.getDate() - 1);
    } else {
      setNotificationTime = new Date(eventDetails.notificationTime);
    }

    
    setEventsData({ ...eventDetails, notificationTime: setNotificationTime });
    closeModal();

   
    if (setNotificationTime !== undefined && setNotificationTime !== null) {
      console.log("schedule notification");
      console.log(
        "🚀 ~ saveEvent ~ eventDetails.notificationTime:",
        setNotificationTime
      );

      // Schedule the notification
      const schedulingOptions = {
        content: {
          title: "Event Notification",
          body: eventDetails.title,
          sound: "./level-up-191997.mp3",
        },
        trigger: { date: setNotificationTime },
      };
      await Notifications.scheduleNotificationAsync(schedulingOptions);
    } else {
      console.error("Notification time is invalid");
    }
  };

  const showStartTimePicker = () => {
    setIsStartTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setIsStartTimePickerVisible(false);
  };

  const handleStartTimeConfirm = (time) => {
    const formattedTime = `${time.getHours()}:${
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()
    }`;
    setEventDetails({
      ...eventDetails,
      startTime: formattedTime,
      dateWithStartTime: time,
    });
    hideStartTimePicker();
  };

 

  const showEndTimePicker = () => {
    setIsEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setIsEndTimePickerVisible(false);
  };

  const handleEndTimeConfirm = (time) => {
    const formattedTime = `${time.getHours()}:${
      time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()
    }`;
    setEventDetails({ ...eventDetails, endTime: formattedTime });
    hideEndTimePicker();
  };

  const handleNotificationOption = (option) => {
    setEventDetails({ ...eventDetails, notificationTime: option });
    setNotificationModalVisible(false);
  };

  const handleNotificationDateTimeConfirm = (dateTime) => {
    setEventDetails({ ...eventDetails, notificationTime: dateTime });
    setIsNotificationDateTimePickerVisible(false);
    setNotificationModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Agenda
        items={eventsData}
        selected={new Date()}
        onDayPress={(day) => openModal(day.dateString)}
        renderItem={(item, firstItemInDay) => (
          <TouchableOpacity onLongPress={() => removeEvent(item.id)}>
            <View style={styles.event}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text
                style={styles.eventTime}
              >{`Time: ${item.startTime} - ${item.endTime}`}</Text>
              {item.note && <Text>{`Note: ${item.note}`}</Text>}
            </View>
          </TouchableOpacity>
        )}
      />

    

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              onChangeText={(text) =>
                setEventDetails({ ...eventDetails, title: text })
              }
              value={eventDetails.title}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Time"
              onFocus={showStartTimePicker}
              value={eventDetails.startTime}
            />
            <TextInput
              style={styles.input}
              placeholder="End Time"
              onFocus={showEndTimePicker}
              value={eventDetails.endTime}
            />
            <TextInput
              style={styles.input}
              placeholder="Note"
              onChangeText={(text) =>
                setEventDetails({ ...eventDetails, note: text })
              }
              value={eventDetails.note}
            />
            <TextInput
              style={styles.input}
              placeholder="Notification Time"
              onFocus={() => setNotificationModalVisible(true)}
              value={
                eventDetails.notificationTime
                  ? eventDetails.notificationTime.toLocaleString()
                  : ""
              }
            />
            <View style={styles.buttonContainer}>
              <Button title="Save" onPress={saveEvent} />
              <Button title="Cancel" onPress={closeModal} color="gray" />
            </View>
          </View>
        </View>
      </Modal>

      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={handleStartTimeConfirm}
        onCancel={hideStartTimePicker}
      />

      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={handleEndTimeConfirm}
        onCancel={hideEndTimePicker}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={notificationModalVisible}
        onRequestClose={() => setNotificationModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Select Notification Time</Text>
            <TouchableOpacity
              onPress={() => handleNotificationOption("15 minutes before")}
            >
              <Text>15 minutes before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNotificationOption("1 hour before")}
            >
              <Text>1 hour before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleNotificationOption("1 day before")}
            >
              <Text>1 day before</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isNotificationDateTimePickerVisible}
              mode="datetime"
              onConfirm={handleNotificationDateTimeConfirm}
              onCancel={() => setIsNotificationDateTimePickerVisible(false)}
            />
            <TouchableOpacity
              onPress={() => setIsNotificationDateTimePickerVisible(true)}
            >
              <Text>Select Specific Date & Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 200,
    marginBottom: 20,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
  event: {
    backgroundColor: "white",
    margin: 10,
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventTime: {
    fontSize: 14,
    color: "gray",
  },
});
