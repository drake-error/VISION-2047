import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const API_URL = 'http://10.0.2.2:5000';

export default function PrescriptionScanScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const pickImage = async (useCamera = false) => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.8,
    };

    const response = useCamera
      ? await launchCamera(options)
      : await launchImageLibrary(options);

    if (response.didCancel) return;
    if (response.error) {
      Alert.alert('Error', response.error);
      return;
    }

    const asset = response.assets[0];
    setImageUri(asset.uri);
    scanPrescription(asset.base64);
  };

  const scanPrescription = async (base64Image) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/scan-prescription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: `data:image/jpeg;base64,${base64Image}`,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan prescription. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="document-text" size={60} color="#50C878" />
        <Text style={styles.title}>Digitize Prescription</Text>
        <Text style={styles.subtitle}>
          Convert handwritten prescriptions to digital text
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Icon name="information-circle" size={24} color="#4A90E2" />
        <Text style={styles.infoText}>
          Take a clear photo of your prescription. Works best with good lighting
          and minimal shadows.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          onPress={() => pickImage(true)}
        >
          <Icon name="camera" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.galleryButton]}
          onPress={() => pickImage(false)}
        >
          <Icon name="images" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.sectionTitle}>Original Prescription</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#50C878" />
          <Text style={styles.loadingText}>Processing prescription...</Text>
          <Text style={styles.loadingSubtext}>
            Using AI to extract text from image
          </Text>
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <View style={styles.successBadge}>
            <Icon name="checkmark-circle" size={24} color="#FFF" />
            <Text style={styles.successText}>Digitized Successfully</Text>
          </View>

          <View style={styles.digitalizedSection}>
            <Text style={styles.sectionTitle}>Digitalized Prescription</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon name="person" size={20} color="#7F8C8D" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Doctor</Text>
                  <Text style={styles.infoValue}>
                    {result.parsed_data.doctor_name}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Icon name="person-outline" size={20} color="#7F8C8D" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Patient</Text>
                  <Text style={styles.infoValue}>
                    {result.parsed_data.patient_name}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.medicationsCard}>
              <View style={styles.cardHeader}>
                <Icon name="medical" size={24} color="#50C878" />
                <Text style={styles.cardTitle}>Prescribed Medications</Text>
              </View>
              {result.parsed_data.medications.map((med, index) => (
                <View key={index} style={styles.medicationRow}>
                  <View style={styles.medicationNumber}>
                    <Text style={styles.medicationNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.medicationText}>{med}</Text>
                </View>
              ))}
            </View>

            <View style={styles.instructionsCard}>
              <View style={styles.cardHeader}>
                <Icon name="information-circle" size={24} color="#4A90E2" />
                <Text style={styles.cardTitle}>Instructions</Text>
              </View>
              <Text style={styles.instructionsText}>
                {result.parsed_data.instructions}
              </Text>
            </View>
          </View>

          <View style={styles.rawTextSection}>
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => Alert.alert('Raw OCR Text', result.raw_text)}
            >
              <Text style={styles.expandButtonText}>View Raw OCR Text</Text>
              <Icon name="chevron-forward" size={20} color="#4A90E2" />
            </TouchableOpacity>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.saveButton}>
              <Icon name="download" size={20} color="#FFF" />
              <Text style={styles.saveButtonText}>Save to Records</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton}>
              <Icon name="share-social" size={20} color="#4A90E2" />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 5,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 13,
    color: '#2C3E50',
    lineHeight: 18,
  },
  buttonContainer: {
    padding: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cameraButton: {
    backgroundColor: '#50C878',
  },
  galleryButton: {
    backgroundColor: '#4A90E2',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  imageContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 5,
    fontSize: 13,
    color: '#7F8C8D',
  },
  resultContainer: {
    padding: 20,
  },
  successBadge: {
    flexDirection: 'row',
    backgroundColor: '#27AE60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  digitalizedSection: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 16,
    color: '#2C3E50',
    fontWeight: '600',
  },
  medicationsCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginLeft: 10,
  },
  medicationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#50C878',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicationNumberText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  medicationText: {
    flex: 1,
    fontSize: 15,
    color: '#2C3E50',
    lineHeight: 22,
  },
  instructionsCard: {
    backgroundColor: '#E8F4FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  instructionsText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
  },
  rawTextSection: {
    marginBottom: 20,
  },
  expandButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
  },
  expandButtonText: {
    fontSize: 15,
    color: '#4A90E2',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#50C878',
    padding: 15,
    borderRadius: 10,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E8F4FF',
    padding: 15,
    borderRadius: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});