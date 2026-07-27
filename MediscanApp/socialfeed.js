import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'http://10.0.2.2:5000';

export default function BloodRequestsScreen() {
  const [requests, setRequests] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newRequest, setNewRequest] = useState({
    hospital_name: '',
    blood_group: 'A+',
    units_needed: '',
    urgency: 'High',
    contact: '',
    location: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blood-requests`);
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
      // Load mock data if API fails
      setRequests([
        {
          id: 1,
          hospital_name: 'City General Hospital',
          blood_group: 'O-',
          units_needed: 3,
          urgency: 'Critical',
          contact: '+1 555-0100',
          location: 'Downtown, Bengaluru',
          posted_at: new Date().toISOString(),
          verified: true,
        },
        {
          id: 2,
          hospital_name: 'St. Mary Medical Center',
          blood_group: 'A+',
          units_needed: 2,
          urgency: 'High',
          contact: '+1 555-0200',
          location: 'Indiranagar, Bengaluru',
          posted_at: new Date(Date.now() - 3600000).toISOString(),
          verified: true,
        },
      ]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const postRequest = async () => {
    if (!newRequest.hospital_name || !newRequest.units_needed) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/blood-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      });

      const data = await response.json();
      setRequests([data, ...requests]);
      setModalVisible(false);
      setNewRequest({
        hospital_name: '',
        blood_group: 'A+',
        units_needed: '',
        urgency: 'High',
        contact: '',
        location: '',
      });
      Alert.alert('Success', 'Blood request posted successfully');
    } catch (error) {
      console.error('Error posting request:', error);
      Alert.alert('Error', 'Failed to post request');
    }
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'critical':
        return '#C0392B';
      case 'high':
        return '#E74C3C';
      case 'medium':
        return '#F39C12';
      default:
        return '#95A5A6';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diff = Math.floor((now - posted) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestCard}>
      <View style={styles.requestHeader}>
        <View style={styles.hospitalInfo}>
          <Icon name="business" size={20} color="#4A90E2" />
          <Text style={styles.hospitalName}>{item.hospital_name}</Text>
          {item.verified && (
            <Icon name="checkmark-circle" size={16} color="#27AE60" />
          )}
        </View>
        <View
          style={[
            styles.urgencyBadge,
            { backgroundColor: getUrgencyColor(item.urgency) },
          ]}
        >
          <Text style={styles.urgencyText}>{item.urgency}</Text>
        </View>
      </View>

      <View style={styles.bloodTypeContainer}>
        <View style={styles.bloodTypeCircle}>
          <Icon name="water" size={30} color="#C0392B" />
          <Text style={styles.bloodTypeText}>{item.blood_group}</Text>
        </View>
        <View style={styles.requestDetails}>
          <Text style={styles.unitsText}>
            {item.units_needed} unit{item.units_needed > 1 ? 's' : ''} needed
          </Text>
          <View style={styles.locationRow}>
            <Icon name="location" size={14} color="#7F8C8D" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.requestActions}>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall(item.contact)}
        >
          <Icon name="call" size={18} color="#FFF" />
          <Text style={styles.callButtonText}>Call Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.shareButton}>
          <Icon name="share-social" size={18} color="#4A90E2" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>

        <Text style={styles.timeAgo}>{getTimeAgo(item.posted_at)}</Text>
      </View>
    </View>
  );

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['Critical', 'High', 'Medium', 'Low'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Blood Requests</Text>
        <Text style={styles.headerSubtitle}>Help save lives in your area</Text>
      </View>

      <FlatList
        data={requests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="water-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>No blood requests at the moment</Text>
          </View>
        }
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
            <Text style={styles.modalTitle}>Post Blood Request</Text>

            <TextInput
              style={styles.input}
              placeholder="Hospital/Organization Name *"
              value={newRequest.hospital_name}
              onChangeText={(text) =>
                setNewRequest({ ...newRequest, hospital_name: text })
              }
            />

            <Text style={styles.inputLabel}>Blood Group *</Text>
            <View style={styles.bloodGroupGrid}>
              {bloodGroups.map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.bloodGroupButton,
                    newRequest.blood_group === group &&
                      styles.bloodGroupButtonActive,
                  ]}
                  onPress={() =>
                    setNewRequest({ ...newRequest, blood_group: group })
                  }
                >
                  <Text
                    style={[
                      styles.bloodGroupButtonText,
                      newRequest.blood_group === group &&
                        styles.bloodGroupButtonTextActive,
                    ]}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Units Needed *"
              value={newRequest.units_needed}
              onChangeText={(text) =>
                setNewRequest({ ...newRequest, units_needed: text })
              }
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Urgency Level</Text>
            <View style={styles.urgencyGrid}>
              {urgencyLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.urgencyButton,
                    newRequest.urgency === level && styles.urgencyButtonActive,
                    {
                      borderColor:
                        newRequest.urgency === level
                          ? getUrgencyColor(level)
                          : '#ECF0F1',
                    },
                  ]}
                  onPress={() =>
                    setNewRequest({ ...newRequest, urgency: level })
                  }
                >
                  <Text
                    style={[
                      styles.urgencyButtonText,
                      newRequest.urgency === level && {
                        color: getUrgencyColor(level),
                      },
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Contact Number *"
              value={newRequest.contact}
              onChangeText={(text) =>
                setNewRequest({ ...newRequest, contact: text })
              }
              keyboardType="phone-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Location *"
              value={newRequest.location}
              onChangeText={(text) =>
                setNewRequest({ ...newRequest, location: text })
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.postButton]}
                onPress={postRequest}
              >
                <Text style={styles.postButtonText}>Post Request</Text>
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
    backgroundColor: '#C0392B',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FADBD8',
    marginTop: 5,
  },
  list: {
    padding: 15,
  },
  requestCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  hospitalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 8,
    marginRight: 5,
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgencyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  bloodTypeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FADBD8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bloodTypeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C0392B',
    marginTop: 5,
  },
  requestDetails: {
    flex: 1,
  },
  unitsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 5,
  },
  requestActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27AE60',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 10,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  shareButtonText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  timeAgo: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#95A5A6',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C0392B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#95A5A6',
    marginTop: 15,
    textAlign: 'center',
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
    width: '90%',
    maxHeight: '90%',
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
  inputLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 10,
    fontWeight: '500',
  },
  bloodGroupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  bloodGroupButton: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    margin: '1%',
    borderWidth: 2,
    borderColor: '#ECF0F1',
  },
  bloodGroupButtonActive: {
    backgroundColor: '#C0392B',
    borderColor: '#C0392B',
  },
  bloodGroupButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7F8C8D',
  },
  bloodGroupButtonTextActive: {
    color: '#FFF',
  },
  urgencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  urgencyButton: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    margin: 3,
    borderWidth: 2,
  },
  urgencyButtonActive: {
    backgroundColor: '#FFF',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7F8C8D',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
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
  postButton: {
    backgroundColor: '#C0392B',
  },
  postButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});