import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen({ navigation }) {
  const features = [
    {
      id: 1,
      title: 'Scan Medicine',
      subtitle: 'Detect expiry dates',
      icon: 'scan',
      color: '#4A90E2',
      screen: 'ScanMedicine',
    },
    {
      id: 2,
      title: 'Scan Prescription',
      subtitle: 'Digitize handwritten Rx',
      icon: 'document-text',
      color: '#50C878',
      screen: 'PrescriptionScan',
    },
    {
      id: 3,
      title: 'Emergency QR',
      subtitle: 'Quick medical access',
      icon: 'qr-code',
      color: '#E74C3C',
      screen: 'EmergencyQR',
    },
    {
      id: 4,
      title: 'Blood Requests',
      subtitle: 'Urgent blood needs',
      icon: 'water',
      color: '#C0392B',
      screen: 'BloodRequests',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MediScan AI</Text>
        <Text style={styles.headerSubtitle}>Your Health Companion</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.grid}>
          {features.map((feature) => (
            <TouchableOpacity
              key={feature.id}
              style={[styles.card, { borderLeftColor: feature.color }]}
              onPress={() => navigation.navigate(feature.screen)}
            >
              <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
                <Icon name={feature.icon} size={30} color="#FFF" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
              </View>
              <Icon name="chevron-forward" size={24} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.alertSection}>
          <Text style={styles.sectionTitle}>Health Alerts</Text>
          <View style={styles.alertCard}>
            <Icon name="warning" size={24} color="#F39C12" />
            <Text style={styles.alertText}>3 medicines expiring soon</Text>
          </View>
          <View style={styles.alertCard}>
            <Icon name="time" size={24} color="#3498DB" />
            <Text style={styles.alertText}>Next medication due at 2:00 PM</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#E8F4FF',
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  grid: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 3,
  },
  alertSection: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  alertCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  alertText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 15,
    flex: 1,
  },
});