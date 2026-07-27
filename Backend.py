from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import pytesseract
import base64
from datetime import datetime
import re

app = Flask(__name__)
CORS(app)

# Configure Tesseract path (update based on your system)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Mock database
medicines_db = []
medical_records = []
blood_requests = []

@app.route('/api/scan-medicine', methods=['POST'])
def scan_medicine():
    try:
        data = request.json
        image_data = data.get('image')
        
        # Decode base64 image
        img_bytes = base64.b64decode(image_data.split(',')[1])
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Preprocess image
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        # OCR
        text = pytesseract.image_to_string(thresh)
        
        # Extract medicine name and expiry date
        medicine_name = extract_medicine_name(text)
        expiry_date = extract_expiry_date(text)
        
        # Check if expired
        is_expired = check_expiry(expiry_date)
        
        result = {
            'medicine_name': medicine_name,
            'expiry_date': expiry_date,
            'is_expired': is_expired,
            'raw_text': text
        }
        
        # Save to mock database
        medicines_db.append(result)
        
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/scan-prescription', methods=['POST'])
def scan_prescription():
    try:
        data = request.json
        image_data = data.get('image')
        
        # Decode base64 image
        img_bytes = base64.b64decode(image_data.split(',')[1])
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Preprocess for handwriting
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
        thresh = cv2.adaptiveThreshold(denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                       cv2.THRESH_BINARY, 11, 2)
        
        # OCR with custom config for handwriting
        custom_config = r'--oem 3 --psm 6'
        text = pytesseract.image_to_string(thresh, config=custom_config)
        
        # Parse prescription
        parsed_data = parse_prescription(text)
        
        return jsonify({
            'raw_text': text,
            'parsed_data': parsed_data,
            'digitized': True
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/chatbot', methods=['POST'])
def chatbot():
    data = request.json
    user_message = data.get('message', '').lower()
    
    # Mock intelligent responses
    if 'expiry' in user_message or 'expired' in user_message:
        response = "I found 3 expired medicines in your record. Check your inventory tab."
    elif 'headache' in user_message:
        response = "For mild headaches: Rest in a quiet, dark room and stay hydrated. If pain persists for more than 2 days or is severe, please consult a doctor."
    elif 'fever' in user_message:
        response = "If fever is below 102°F (38.9°C): Rest and drink fluids. Above 102°F or lasting more than 3 days: See a doctor. Above 103°F with severe symptoms: Seek emergency care."
    elif 'chest pain' in user_message:
        response = "⚠️ URGENT: Chest pain can be serious. If accompanied by shortness of breath, sweating, or pain radiating to arm/jaw, call emergency services immediately."
    elif 'cold' in user_message or 'cough' in user_message:
        response = "For common cold: Rest, fluids, and over-the-counter medicines. See a doctor if symptoms worsen after 7 days or if you have difficulty breathing."
    elif 'reminder' in user_message:
        response = "Your next medication is due at 2:00 PM - Aspirin 100mg. Would you like me to set up daily reminders?"
    elif 'blood' in user_message and 'group' in user_message:
        response = "Your blood group is A+. You can donate to A+ and AB+ recipients."
    else:
        response = "I'm here to help! You can ask me about: expired medicines, symptoms, medication reminders, or blood donation information."
    
    return jsonify({'response': response})

@app.route('/api/symptom-check', methods=['POST'])
def symptom_check():
    data = request.json
    symptoms = data.get('symptoms', [])
    
    # Basic triage logic
    emergency_symptoms = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious']
    doctor_symptoms = ['high fever', 'persistent pain', 'vomiting', 'severe headache']
    
    severity = 'mild'
    recommendation = 'Monitor at home'
    
    for symptom in symptoms:
        symptom_lower = symptom.lower()
        if any(es in symptom_lower for es in emergency_symptoms):
            severity = 'emergency'
            recommendation = '🚨 Seek emergency care immediately'
            break
        elif any(ds in symptom_lower for ds in doctor_symptoms):
            severity = 'moderate'
            recommendation = 'Schedule a doctor visit within 24-48 hours'
    
    return jsonify({
        'severity': severity,
        'recommendation': recommendation,
        'symptoms_analyzed': symptoms
    })

@app.route('/api/blood-requests', methods=['GET'])
def get_blood_requests():
    return jsonify(blood_requests)

@app.route('/api/blood-requests', methods=['POST'])
def create_blood_request():
    data = request.json
    blood_request = {
        'id': len(blood_requests) + 1,
        'hospital_name': data.get('hospital_name'),
        'blood_group': data.get('blood_group'),
        'units_needed': data.get('units_needed'),
        'urgency': data.get('urgency'),
        'contact': data.get('contact'),
        'location': data.get('location'),
        'posted_at': datetime.now().isoformat(),
        'verified': True
    }
    blood_requests.append(blood_request)
    return jsonify(blood_request), 201

@app.route('/api/medical-records', methods=['POST'])
def add_medical_record():
    data = request.json
    record = {
        'id': len(medical_records) + 1,
        'patient_id': data.get('patient_id'),
        'record_type': data.get('record_type'),
        'date': data.get('date'),
        'description': data.get('description'),
        'medications': data.get('medications', []),
        'allergies': data.get('allergies', [])
    }
    medical_records.append(record)
    return jsonify(record), 201

@app.route('/api/medical-records/<patient_id>', methods=['GET'])
def get_medical_records(patient_id):
    records = [r for r in medical_records if r['patient_id'] == patient_id]
    return jsonify(records)

@app.route('/api/detect-patterns', methods=['POST'])
def detect_patterns():
    data = request.json
    medication_history = data.get('medication_history', [])
    
    alerts = []
    
    # Check for missed doses
    missed_count = sum(1 for m in medication_history if not m.get('taken'))
    if missed_count > 2:
        alerts.append({
            'type': 'missed_doses',
            'severity': 'warning',
            'message': f'You have missed {missed_count} doses in the last 7 days.'
        })
    
    # Check for conflicting medications (mock)
    medications = [m.get('name', '').lower() for m in medication_history]
    if 'aspirin' in medications and 'warfarin' in medications:
        alerts.append({
            'type': 'drug_interaction',
            'severity': 'high',
            'message': 'Potential interaction detected between Aspirin and Warfarin. Consult your doctor.'
        })
    
    return jsonify({'alerts': alerts})

# Helper functions
def extract_medicine_name(text):
    lines = text.split('\n')
    for line in lines:
        if len(line.strip()) > 3 and not line.isdigit():
            return line.strip()
    return "Unknown Medicine"

def extract_expiry_date(text):
    # Look for date patterns
    date_patterns = [
        r'(\d{2}[/-]\d{2}[/-]\d{4})',
        r'(\d{2}[/-]\d{4})',
        r'EXP[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})',
        r'EXPIRY[:\s]*(\d{2}[/-]\d{2}[/-]\d{4})'
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)
    
    return "Not Found"

def check_expiry(expiry_str):
    if expiry_str == "Not Found":
        return False
    
    try:
        # Parse date
        for fmt in ['%m/%d/%Y', '%d/%m/%Y', '%m/%Y', '%d-%m-%Y', '%m-%d-%Y']:
            try:
                expiry_date = datetime.strptime(expiry_str, fmt)
                return expiry_date < datetime.now()
            except:
                continue
    except:
        pass
    
    return False

def parse_prescription(text):
    return {
        'doctor_name': 'Dr. John Smith',  # Mock
        'patient_name': 'Patient Name',
        'medications': [
            'Amoxicillin 500mg - 3 times daily for 7 days',
            'Paracetamol 650mg - As needed for pain/fever'
        ],
        'instructions': 'Take medications with food. Complete the full course.'
    }

if __name__ == '__main__':
    app.run(debug=True, port=5000)