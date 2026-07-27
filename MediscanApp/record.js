import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'http://10.0.2.2:5000';

export default function MedicalRecordsScreen() {
  const [records, setRecords] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchRecords();
    checkPatterns();
  }, []);

  const fetchRecords = () => {
    // Mock data
    setRecords([
      {
        id: '1',
        type: 'prescription',
        title: 'Annual Checkup',
        date: '2024-11-15',
        doctor: 'Dr. Sarah Johnson',
        medications: ['Aspirin 100mg', 'Vitamin D'],
        notes: 'Blood pressure normal. Continue current medications.',
      },
      {
        id: '2',
        type: 'lab',
        title: 'Blood Test',
        date: '2024-11-10',
        doctor: 'Lab Tech - City Hospital',
        results: {
          'Hemoglobin': '14.5 g/dL',
          'Blood Sugar': '95 mg/dL',
          'Cholesterol': '180 mg/dL',
        },
        notes: 'All values within normal range.',
      },
      {
        id: '3',
        type: 'prescription',
        title: 'Diabetes Follow-up',
        date: '2024-10-20',
        doctor: 'Dr. Michael Chen',
        medications: ['Metformin 500mg'],
        notes: 'Blood sugar levels improving. Continue medication.',
      },
      {
        id: '4',
        type: 'vaccination',
        title: 'Flu Shot',
        date: '2024-09-15',
        doctor: 'Nurse Maria Garcia',
        notes: 'Annual flu vaccination administered.',
      },
    ]);
  };

  const checkPatterns = async () => {
    // Mock medication history
    const mockHistory = [
      { name: 'Aspirin', taken: true, date: '2024-12-08' },
      { name: 'Aspirin', taken: false, date: '2024-12-07' },
      { name: 'Aspirin', taken: false, date: '2024-12-06' },
      { name: 'Vitamin D', taken: true, date: '2024-12-08' },
    ];

    try {
      const response = await fetch(`${API_URL}/api/detect-patterns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          medication_history: mockHistory,
        }),
      });

      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error checking patterns:', error);
    }
  };

  const getRecordIcon = (type) => {
    switch (type) {
      case 'prescription':
        return 'document-text';
      case 'lab':
        return 'flask';
      case 'vaccination':
        return 'shield-checkmark';
      default:
        return 'medical';
    }
  };

  const getRecordColor = (type) => {
    switch (type) {
      case 'prescription':
        return '#4A90E2';
      case 'lab':
        return '#9B59B6';
      case 'vaccination':
        return '#27AE60';
      default:
        return '#95A5A6';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return '#E74C3C';
      case 'warning':
        return '#F39C12';
      default:
        return '#3498DB';
    }
  };

  const filteredRecords = selectedTab === 'all'
    ? records
    : records.filter((r) => r.type === selectedTab);

  const renderAlert = ({ item }) => (
    <View
      style={[
        styles.alertCard,
        { borderLeftColor: getSeverityColor(item.severity) },
      ]}
    >
      <Icon
        name={item.severity === 'high' ? 'warning' : 'alert-circle'}
        size={24}
        color={getSeverityColor(item.severity)}
      />
      <View style={styles.alertContent}>
        <Text style={styles.alertType}>{item.type.replace('_', ' ').toUpperCase()}</Text>
        <Text style={styles.alertMessage}>{item.message}</Text>
      </View>
    </View>
  );

  const renderRecord = ({ item }) => (
    <TouchableOpacity
      style={styles.recordCard}
      onPress={() => Alert.alert(item.title, JSON.stringify(item, null, 2))}
    >
      <View style={styles.recordHeader}>
        <View
          style={[
            styles.recordIcon,
            { backgroundColor: getRecordColor(item.type) },
          ]}
        >
          <Icon name={getRecordIcon(item.type)} size={24} color="#FFF" />
        </View>
        <View style={styles.recordHeaderText}>
          <Text style={styles.recordTitle}>{item.title}</Text>
          <Text style={styles.recordDate}>{item.date}</Text>
        </View>
        <Icon name="chevron-forward" size={24} color="#CCC" />
      </View>

      <View style={styles.recordBody}>
        <View style={styles.recordRow}>
          <Icon name="person" size={16} color="#7F8C8D" />
          <Text style={styles.recordDoctor}>{item.doctor}</Text>
        </View>

        {item.medications && (
          <View style={styles.medicationsSection}>
            <Text style={styles.sectionTitle}>Medications:</Text>
            {item.medications.map((med, index) => (
              <Text key={index} style={styles.medicationItem}>
                • {med}
              </Text>
            ))}
          </View>
        )}

        {item.results && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Results:</Text>
            {Object.entries(item.results).map(([key, value]) => (
              <View key={key} style={styles.resultRow}>
                <Text style={styles.resultKey}>{key}:</Text>
                <Text style={styles.resultValue}>{value}</Text>
              </View>
            ))}
          </View>
        )}

        {item.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.notesText}>{item.notes}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const tabs = [
    { id: 'all', label: 'All', icon: 'list' },
    { id: 'prescription', label: 'Prescriptions', icon: 'document-text' },
    { id: 'lab', label: 'Lab Tests', icon: 'flask' },
    { id: 'vaccination', label: 'Vaccines', icon: 'shield-checkmark' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical Records</Text>
        <Text style={styles.headerSubtitle}>Track your health journey</Text>
      </View>

      {alerts.length > 0 && (
        <View style={styles.alertsSection}>
          <Text style={styles.alertsSectionTitle}>Health Alerts</Text>
          <FlatList
            data={alerts}
            renderItem={renderAlert}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <Icon
              name={tab.icon}
              size={20}
              color={selectedTab === tab.id ? '#4A90E2' : '#7F8C8D'}
            />
            <Text
              style={[
                styles.tabText,
                selectedTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRecords}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="document-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>No records found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: '#9B59B6',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E8DAEF',
    marginTop: 5,
  },
  alertsSection: {
    backgroundColor: '#FFF',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  alertsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 10,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    width: 280,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  alertContent: {
    marginLeft: 12,
    flex: 1,
  },
  alertType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7F8C8D',
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: '#2C3E50',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    fontSize: 12,
    color: '#7F8C8D',
    marginLeft: 5,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  list: {
    padding: 15,
  },
  recordCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F9FA',
  },
  recordIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordHeaderText: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  recordDate: {
    fontSize: 13,
    color: '#7F8C8D',
    marginTop: 3,
  },
  recordBody: {
    padding: 15,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordDoctor: {
    fontSize: 14,
    color: '#7F8C8D',
    marginLeft: 8,
  },
  medicationsSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
  },
  medicationItem: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 4,
    marginLeft: 10,
  },
  resultsSection: {
    marginTop: 10,
    backgroundColor: '#F8F9FA',
    padding: 10,
    borderRadius: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resultKey: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  resultValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  notesSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFF9E6',
    borderLeftWidth: 3,
    borderLeftColor: '#F39C12',
    borderRadius: 5,
  },
  notesText: {
    fontSize: 13,
    color: '#7F8C8D',
    fontStyle: 'italic',
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
});