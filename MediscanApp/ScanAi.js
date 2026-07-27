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

const API_URL = 'http://10.0.2.2:5000'; // For Android emulator

export default function ScanMedicineScreen() {
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
    scanMedicine(asset.base64);
  };

  const scanMedicine = async (base64Image) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/scan-medicine`, {
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
      Alert.alert('Error', 'Failed to scan medicine. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Icon name="scan" size={60} color="#4A90E2" />
        <Text style={styles.title}>Scan Medicine</Text>
        <Text style={styles.subtitle}>
          Detect medicine name and expiry date
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
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Scanning medicine...</Text>
        </View>
      )}

      {result && (
        <View style={styles.resultContainer}>
          <View
            style={[
              styles.statusBadge,
              result.is_expired ? styles.expiredBadge : styles.validBadge,
            ]}
          >
            <Icon
              name={result.is_expired ? 'close-circle' : 'checkmark-circle'}
              size={24}
              color="#FFF"
            />
            <Text style={styles.statusText}>
              {result.is_expired ? 'EXPIRED' : 'VALID'}
            </Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Medicine Name:</Text>
            <Text style={styles.resultValue}>{result.medicine_name}</Text>
          </View>

          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Expiry Date:</Text>
            <Text style={styles.resultValue}>{result.expiry_date}</Text>
          </View>

          {result.is_expired && (
            <View style={styles.warningBox}>
              <Icon name="warning" size={20} color="#E74C3C" />
              <Text style={styles.warningText}>
                This medicine has expired. Please dispose of it safely.
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save to Inventory</Text>
          </TouchableOpacity>
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
    backgroundColor: '#4A90E2',
  },
  galleryButton: {
    backgroundColor: '#50C878',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  imageContainer: {
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7F8C8D',
  },
  resultContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  expiredBadge: {
    backgroundColor: '#E74C3C',
  },
  validBadge: {
    backgroundColor: '#27AE60',
  },
  statusText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  resultRow: {
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 18,
    color: '#2C3E50',
    fontWeight: '600',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FADBD8',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    color: '#E74C3C',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});