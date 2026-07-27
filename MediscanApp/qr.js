import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { launchCamera } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

export default function EmergencyQRScreen() {
  const [mode, setMode] = useState('view'); // 'view', 'edit', 'scan'
  const [patientData, setPatientData] = useState({
    name: 'John Doe',
    bloodType: 'A+',
    allergies: ['Penicillin', 'Peanuts'],
    emergencyContact: '+1 234-567-8900',
    medicalConditions: ['Diabetes Type 2', 'Hypertension'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg'],
  });

  const [editData, setEditData] = useState({ ...patientData });

  const generateQRData = () => {
    return JSON.stringify({
      name: patientData.name,
      bloodType: patientData.bloodType,
      allergies: patientData.allergies.join(', '),
      emergencyContact: patientData.emergencyContact,
      medicalConditions: patientData.medicalConditions.join(', '),
      medications: patientData.medications.join(', '),
    });
  };

  const saveChanges = () => {
    setPatientData({ ...editData });
    setMode('view');
    Alert.alert('Success', 'Emergency data updated successfully');
  };

  const scanQRCode = async () => {
    // In a real app, you would use react-native-qrcode-scanner
    Alert.alert(
      'QR Scanner',
      'In production, this would open the camera to scan a QR code from someone\'s lock screen.',
      [{ text: 'OK' }]
    );
  };

  const renderViewMode = () => (
    <ScrollView style={styles.content}>
      <View style={styles.qrContainer}>
        <QRCode value={generateQRData()} size={200} />
        <Text style={styles.qrLabel}>Scan this QR for emergency access</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon name="person" size={24} color="#4A90E2" />
            <Text style={styles.infoTitle}>Personal Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{patientData.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Blood Type:</Text>
            <View style={styles.bloodTypeBadge}>
              <Text style={styles.bloodTypeText}>{patientData.bloodType}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon name="alert-circle" size={24} color="#E74C3C" />
            <Text style={styles.infoTitle}>Allergies</Text>
          </View>
          {patientData.allergies.map((allergy, index) => (
            <View key={index} style={styles.allergyItem}>
              <Icon name="warning" size={16} color="#E74C3C" />
              <Text style={styles.allergyText}>{allergy}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon name="call" size={24} color="#27AE60" />
            <Text style={styles.infoTitle}>Emergency Contact</Text>
          </View>
          <Text style={styles.contactText}>{patientData.emergencyContact}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon name="medical" size={24} color="#F39C12" />
            <Text style={styles.infoTitle}>Medical Conditions</Text>
          </View>
          {patientData.medicalConditions.map((condition, index) => (
            <Text key={index} style={styles.conditionText}>
              • {condition}
            </Text>
          ))}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Icon name="tablet-portrait" size={24} color="#9B59B6" />
            <Text style={styles.infoTitle}>Current Medications</Text>
          </View>
          {patientData.medications.map((med, index) => (
            <Text key={index} style={styles.medicationText}>
              • {med}
            </Text>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setMode('edit')}
      >
        <Icon name="create" size={20} color="#FFF" />
        <Text style={styles.editButtonText}>Edit Information</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderEditMode = () => (
    <ScrollView style={styles.content}>
      <View style={styles.editCard}>
        <Text style={styles.editLabel}>Name</Text>
        <TextInput
          style={styles.editInput}
          value={editData.name}
          onChangeText={(text) => setEditData({ ...editData, name: text })}
        />

        <Text style={styles.editLabel}>Blood Type</Text>
        <TextInput
          style={styles.editInput}
          value={editData.bloodType}
          onChangeText={(text) => setEditData({ ...editData, bloodType: text })}
        />

        <Text style={styles.editLabel}>Emergency Contact</Text>
        <TextInput
          style={styles.editInput}
          value={editData.emergencyContact}
          onChangeText={(text) =>
            setEditData({ ...editData, emergencyContact: text })
          }
          keyboardType="phone-pad"
        />

        <Text style={styles.editLabel}>Allergies (comma-separated)</Text>
        <TextInput
          style={[styles.editInput, styles.multilineInput]}
          value={editData.allergies.join(', ')}
          onChangeText={(text) =>
            setEditData({
              ...editData,
              allergies: text.split(',').map((a) => a.trim()),
            })
          }
          multiline
        />

        <Text style={styles.editLabel}>Medical Conditions (comma-separated)</Text>
        <TextInput
          style={[styles.editInput, styles.multilineInput]}
          value={editData.medicalConditions.join(', ')}
          onChangeText={(text) =>
            setEditData({
              ...editData,
              medicalConditions: text.split(',').map((c) => c.trim()),
            })
          }
          multiline
        />

        <Text style={styles.editLabel}>Medications (comma-separated)</Text>
        <TextInput
          style={[styles.editInput, styles.multilineInput]}
          value={editData.medications.join(', ')}
          onChangeText={(text) =>
            setEditData({
              ...editData,
              medications: text.split(',').map((m) => m.trim()),
            })
          }
          multiline
        />
      </View>

      <View style={styles.editButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => {
            setEditData({ ...patientData });
            setMode('view');
          }}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={saveChanges}
        >
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Emergency Medical Data</Text>
        <Text style={styles.headerSubtitle}>
          Quick access to critical health information
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, mode === 'view' && styles.activeTab]}
          onPress={() => setMode('view')}
        >
          <Icon name="eye" size={20} color={mode === 'view' ? '#FFF' : '#4A90E2'} />
          <Text style={[styles.tabText, mode === 'view' && styles.activeTabText]}>
            View QR
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, mode === 'scan' && styles.activeTab]}
          onPress={scanQRCode}
        >
          <Icon name="scan" size={20} color={mode === 'scan' ? '#FFF' : '#4A90E2'} />
          <Text style={[styles.tabText, mode === 'scan' && styles.activeTabText]}>
            Scan QR
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'edit' ? renderEditMode() : renderViewMode()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#E74C3C',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 10,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    color: '#4A90E2',
    marginLeft: 8,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFF',
  },
  content: {
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFF',
    margin: 15,
    borderRadius: 12,
  },
  qrLabel: {
    marginTop: 15,
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  infoSection: {
    padding: 15,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  infoValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  bloodTypeBadge: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  bloodTypeText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  allergyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FADBD8',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  allergyText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#E74C3C',
    fontWeight: '500',
  },
  contactText: {
    fontSize: 18,
    color: '#27AE60',
    fontWeight: 'bold',
  },
  conditionText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 8,
  },
  medicationText: {
    fontSize: 14,
    color: '#2C3E50',
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  editCard: {
    backgroundColor: '#FFF',
    margin: 15,
    padding: 20,
    borderRadius: 12,
  },
  editLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 8,
    marginTop: 15,
  },
  editInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ECF0F1',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editButtons: {
    flexDirection: 'row',
    padding: 15,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ECF0F1',
  },
  cancelButtonText: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#27AE60',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});