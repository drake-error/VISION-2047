import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import PushNotification from 'react-native-push-notification';

export default function RemindersScreen() {
  const [reminders, setReminders] = useState([
    {
      id: '1',
      medicine: 'Aspirin 100mg',
      time: '08:00 AM',
      frequency: 'Daily',
      enabled: true,
    },
    {
      id: '2',
      medicine: 'Vitamin D',
      time: '02:00 PM',
      frequency: 'Daily',
      enabled: true,
    },
    {
      id: '3',
      medicine: 'Blood Pressure Med',
      time: '08:00 PM',
      frequency: 'Daily',
      enabled: false,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newReminder, setNewReminder] = useState({
    medicine: '',
    time: new Date(),
    frequency: 'Daily',
  });
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    // Configure notifications
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    // Create notification channel for Android
    PushNotification.createChannel(
      {
        channelId: 'medicine-reminders',
        channelName: 'Medicine Reminders',
        channelDescription: 'Notifications for medicine intake',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  }, []);

  const scheduleNotification = (reminder) => {
    const [hours, minutes] = reminder.time.split(':');
    const [hour, period] = [parseInt(hours), minutes.includes('PM') ? 'PM' : 'AM'];
    
    let scheduledHour = hour;
    if (period === 'PM' && hour !== 12) scheduledHour += 12;
    if (period === 'AM' && hour === 12) scheduledHour = 0;

    PushNotification.localNotificationSchedule({
      channelId: 'medicine-reminders',
      title: '💊 Medicine Reminder',
      message: `Time to take ${reminder.medicine}`,
      date: new Date(Date.now() + 5000), // Test: 5 seconds from now
      repeatType: 'day',
      allowWhileIdle: true,
    });
  };

  const toggleReminder = (id) => {
    setReminders(
      reminders.map((r) => {
        if (r.id === id) {
          const updated = { ...r, enabled: !r.enabled };
          if (updated.enabled) {
            scheduleNotification(updated);
          }
          return updated;
        }
        return r;
      })
    );
  };

  const addReminder = () => {
    const timeString = newReminder.time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const reminder = {
      id: Date.now().toString(),
      medicine: newReminder.medicine,
      time: timeString,
      frequency: newReminder.frequency,
      enabled: true,
    };

    setReminders([...reminders, reminder]);
    scheduleNotification(reminder);
    setModalVisible(false);
    setNewReminder({ medicine: '', time: new Date(), frequency: 'Daily' });
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const renderReminder = ({ item }) => (
    <View style={styles.reminderCard}>
      <View style={styles.reminderLeft}>
        <Icon
          name="medical"
          size={24}
          color={item.enabled ? '#4A90E2' : '#CCC'}
        />
        <View style={styles.reminderInfo}>
          <Text style={styles.medicineName}>{item.medicine}</Text>
          <Text style={styles.reminderTime}>{item.time}</Text>
          <Text style={styles.reminderFrequency}>{item.frequency}</Text>
        </View>
      </View>

      <View style={styles.reminderRight}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            item.enabled ? styles.toggleActive : styles.toggleInactive,
          ]}
          onPress={() => toggleReminder(item.id)}
        >
          <Icon
            name={item.enabled ? 'checkmark' : 'close'}
            size={20}
            color="#FFF"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteReminder(item.id)}
        >
          <Icon name="trash" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medication Reminders</Text>
        <Text style={styles.headerSubtitle}>
          {reminders.filter((r) => r.enabled).length} active reminders
        </Text>
      </View>

      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Reminder</Text>

            <TextInput
              style={styles.input}
              placeholder="Medicine Name"
              value={newReminder.medicine}
              onChangeText={(text) =>
                setNewReminder({ ...newReminder, medicine: text })
              }
            />

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.timeButtonText}>
                Time: {newReminder.time.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={newReminder.time}
                mode="time"
                is24Hour={false}
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    setNewReminder({ ...newReminder, time: selectedTime });
                  }
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addReminder}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8F4FF',
    marginTop: 5,
  },
  list: {
    padding: 15,
  },
  reminderCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reminderInfo: {
    marginLeft: 15,
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  reminderTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginTop: 5,
  },
  reminderFrequency: {
    fontSize: 12,
    color: '#7F8C8D',
    marginTop: 3,
  },
  reminderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  toggleActive: {
    backgroundColor: '#27AE60',
  },
  toggleInactive: {
    backgroundColor: '#95A5A6',
  },
  deleteButton: {
    padding: 10,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 25,
    width: '85%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  timeButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  timeButtonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ECF0F1',
  },
  cancelButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#27AE60',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});