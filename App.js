import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View, Button, Modal, TextInput,Platform, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function App() {
 

  const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);
  const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: '',
    startTime: '',
    endTime: '',
    note: '',
    notificationTime: '',
  });
  const [eventsData, setEventsData] = useState({}); 

  const openModal = (date) => {
    setSelectedDate(date);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    // Reset event details
    setEventDetails({
      title: '',
      startTime: '',
      endTime: '',
      note: '',
    });
  };

  const saveEvent = () => {
   
    const eventsForSelectedDate = eventsData[selectedDate] || [];
    const updatedEvents = [...eventsForSelectedDate, eventDetails];
    setEventsData({ ...eventsData, [selectedDate]: updatedEvents });
    console.log('Event details:', eventDetails);
    closeModal();
  };

  const showStartTimePicker = () => {
    setIsStartTimePickerVisible(true);
  };

  const hideStartTimePicker = () => {
    setIsStartTimePickerVisible(false);
  };

  const handleStartTimeConfirm = (time) => {
    const formattedTime = `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
    setEventDetails({ ...eventDetails, startTime: formattedTime });
    hideStartTimePicker();
  };

  const showEndTimePicker = () => {
    setIsEndTimePickerVisible(true);
  };

  const hideEndTimePicker = () => {
    setIsEndTimePickerVisible(false);
  };

  const handleEndTimeConfirm = (time) => {
    const formattedTime = `${time.getHours()}:${time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()}`;
    setEventDetails({ ...eventDetails, endTime: formattedTime });
    hideEndTimePicker();
  };


  const removeEvent = (eventId) => {
    const allEvents = Object.values(eventsData).flat(); 
    const eventIndex = allEvents.findIndex((event) => event.id === eventId);

    if (eventIndex !== -1) {
      const { [selectedDate]: remainingEvents, ...updatedEventsData } = eventsData;
      const updatedEventsForDate = remainingEvents.filter((event, index) => index !== eventIndex);
      setEventsData({ ...updatedEventsData, [selectedDate]: updatedEventsForDate });

     
      if (!updatedEventsForDate.length) {
        clearDate(selectedDate); 
      }
    } else {
      console.warn("Event with ID", eventId, "not found to remove.");
    }
  };


  const clearDate = (dateString) => {
    const { [dateString]: _, ...updatedEventsData } = eventsData; 
    setEventsData(updatedEventsData);
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
      <Text style={styles.eventTime}>{`Time: ${item.startTime} - ${item.endTime}`}</Text>
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
              onChangeText={(text) => setEventDetails({ ...eventDetails, title: text })}
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
              onChangeText={(text) => setEventDetails({ ...eventDetails, note: text })}
              value={eventDetails.note}
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
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignment for android
    ...Platform.OS === 'android' ? { marginTop: 25 } : { marginTop: 0 },

    flex: 1,
    backgroundColor: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
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
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 200,
    marginBottom: 20,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 20,
  },
  event: {
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 14,
    color: 'gray',
  },

});
