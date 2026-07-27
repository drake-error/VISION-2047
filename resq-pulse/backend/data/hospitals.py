"""
Karnataka Hospitals Database
Comprehensive list of major hospitals across Karnataka
"""

from typing import List, Dict

Hospital = Dict[str, any]

def create_hospital(id: str, name: str, city: str, area: str, lat: float, lng: float, 
                     type: str = "Multispecialty", emergency: bool = True) -> Hospital:
    return {
        "id": id,
        "name": name,
        "city": city,
        "area": area,
        "coords": [lng, lat],
        "type": type,
        "emergency": emergency
    }

# =============================================================================
# BANGALORE HOSPITALS
# =============================================================================

BANGALORE_HOSPITALS: List[Hospital] = [
    create_hospital("HOSP-BLR-001", "St. John's Medical College Hospital", "Bangalore", "Koramangala", 12.9302, 77.6210, "Multispecialty"),
    create_hospital("HOSP-BLR-002", "Manipal Hospital (Old Airport Road)", "Bangalore", "Old Airport Road", 12.9592, 77.6412, "Multispecialty"),
    create_hospital("HOSP-BLR-003", "Fortis Hospital (Bannerghatta Road)", "Bangalore", "Bannerghatta Road", 12.8943, 77.5952, "Multispecialty"),
    create_hospital("HOSP-BLR-004", "Sakra World Hospital", "Bangalore", "Bellandur", 12.9250, 77.6780, "Multispecialty"),
    create_hospital("HOSP-BLR-005", "Apollo Hospital (Bannerghatta)", "Bangalore", "Bannerghatta Road", 12.8870, 77.5960, "Multispecialty"),
    create_hospital("HOSP-BLR-006", "Narayana Health City", "Bangalore", "Bommasandra", 12.8010, 77.6620, "Super Specialty"),
    create_hospital("HOSP-BLR-007", "BGS Gleneagles Global Hospital", "Bangalore", "Kengeri", 12.9050, 77.4900, "Multispecialty"),
    create_hospital("HOSP-BLR-008", "Columbia Asia Hospital (Hebbal)", "Bangalore", "Hebbal", 13.0380, 77.5950, "Multispecialty"),
    create_hospital("HOSP-BLR-009", "Jayadeva Institute of Cardiology", "Bangalore", "Jayanagar", 12.9270, 77.5830, "Cardiac"),
    create_hospital("HOSP-BLR-010", "NIMHANS", "Bangalore", "Hosur Road", 12.9416, 77.5962, "Neuro & Mental Health"),
    create_hospital("HOSP-BLR-011", "Kidwai Memorial Institute", "Bangalore", "Hosur Road", 12.9380, 77.5950, "Oncology"),
    create_hospital("HOSP-BLR-012", "Ramaiah Memorial Hospital", "Bangalore", "Mathikere", 13.0300, 77.5650, "Multispecialty"),
    create_hospital("HOSP-BLR-013", "Aster CMI Hospital", "Bangalore", "Hebbal", 13.0420, 77.5870, "Multispecialty"),
    create_hospital("HOSP-BLR-014", "Sparsh Hospital", "Bangalore", "Infantry Road", 12.9790, 77.5980, "Orthopedic"),
    create_hospital("HOSP-BLR-015", "Vikram Hospital", "Bangalore", "Millers Road", 12.9880, 77.5860, "Multispecialty"),
    create_hospital("HOSP-BLR-016", "Sagar Hospital (Banashankari)", "Bangalore", "Banashankari", 12.9180, 77.5500, "Multispecialty"),
    create_hospital("HOSP-BLR-017", "Bangalore Baptist Hospital", "Bangalore", "Bellary Road", 13.0150, 77.5950, "Multispecialty"),
    create_hospital("HOSP-BLR-018", "MS Ramaiah Advanced Learning Center", "Bangalore", "MSRIT", 13.0290, 77.5640, "Teaching Hospital"),
    create_hospital("HOSP-BLR-019", "Cloudnine Hospital", "Bangalore", "Jayanagar", 12.9250, 77.5850, "Maternity"),
    create_hospital("HOSP-BLR-020", "Mazumdar Shaw Medical Center", "Bangalore", "Bommasandra", 12.8020, 77.6600, "Cancer & Super Specialty"),
    create_hospital("HOSP-BLR-021", "Rainbow Children's Hospital", "Bangalore", "Marathahalli", 12.9570, 77.7000, "Pediatric"),
    create_hospital("HOSP-BLR-022", "Fortis Hospital (Cunningham Road)", "Bangalore", "Cunningham Road", 12.9880, 77.5830, "Multispecialty"),
    create_hospital("HOSP-BLR-023", "Manipal Hospital (Whitefield)", "Bangalore", "Whitefield", 12.9690, 77.7500, "Multispecialty"),
    create_hospital("HOSP-BLR-024", "Aster RV Hospital", "Bangalore", "JP Nagar", 12.9000, 77.5850, "Multispecialty"),
    create_hospital("HOSP-BLR-025", "Victoria Hospital", "Bangalore", "KR Market", 12.9600, 77.5750, "Government General"),
]

# =============================================================================
# BELAGAVI HOSPITALS
# =============================================================================

BELAGAVI_HOSPITALS: List[Hospital] = [
    create_hospital("HOSP-BGM-001", "KLE Dr. Prabhakar Kore Hospital", "Belagavi", "Nehru Nagar", 15.8460, 74.4920, "Multispecialty"),
    create_hospital("HOSP-BGM-002", "Belagavi Institute of Medical Sciences (BIMS)", "Belagavi", "Dr. B.R. Ambedkar Road", 15.8520, 74.5000, "Government"),
    create_hospital("HOSP-BGM-003", "Lakeview Hospital", "Belagavi", "Tilakwadi", 15.8580, 74.5020, "Multispecialty"),
    create_hospital("HOSP-BGM-004", "Deccan Medical Centre", "Belagavi", "Camp", 15.8620, 74.5080, "Multispecialty"),
    create_hospital("HOSP-BGM-005", "CentraCare Hospital", "Belagavi", "Sadashiv Nagar", 15.8550, 74.5090, "Multispecialty"),
    create_hospital("HOSP-BGM-006", "Jeevan Sanjeevini Hospital", "Belagavi", "Shivbasav Nagar", 15.8380, 74.5170, "Multispecialty"),
    create_hospital("HOSP-BGM-007", "Aayush Hospital", "Belagavi", "Gandhinagar", 15.8470, 74.5150, "Multispecialty"),
    create_hospital("HOSP-BGM-008", "Mahaveer Hospital", "Belagavi", "Shahapur", 15.8540, 74.5120, "General"),
    create_hospital("HOSP-BGM-009", "District Hospital Belagavi", "Belagavi", "Fort Area", 15.8489, 74.5010, "Government"),
    create_hospital("HOSP-BGM-010", "Sanjivini Hospital", "Belagavi", "Angol", 15.8680, 74.5200, "Multispecialty"),
]

# =============================================================================
# MYSURU HOSPITALS
# =============================================================================

MYSURU_HOSPITALS: List[Hospital] = [
    create_hospital("HOSP-MYS-001", "Apollo BGS Hospitals", "Mysuru", "Kuvempunagar", 12.3150, 76.6700, "Multispecialty"),
    create_hospital("HOSP-MYS-002", "JSS Hospital", "Mysuru", "Ramanuja Road", 12.3100, 76.6520, "Multispecialty"),
    create_hospital("HOSP-MYS-003", "K.R. Hospital", "Mysuru", "KR Circle", 12.3050, 76.6560, "Government"),
    create_hospital("HOSP-MYS-004", "Columbia Asia Hospital", "Mysuru", "ORR", 12.3400, 76.5950, "Multispecialty"),
    create_hospital("HOSP-MYS-005", "Narayana Multispeciality Hospital", "Mysuru", "Jayalakshmipuram", 12.3200, 76.6380, "Super Specialty"),
    create_hospital("HOSP-MYS-006", "Cheluvamba Hospital", "Mysuru", "Irwin Road", 12.3080, 76.6540, "Maternity & Pediatric"),
]

# =============================================================================
# HUBLI HOSPITALS
# =============================================================================

HUBLI_HOSPITALS: List[Hospital] = [
    create_hospital("HOSP-HBL-001", "KIMS Hospital", "Hubli", "Vidyanagar", 15.3550, 75.1420, "Government Medical College"),
    create_hospital("HOSP-HBL-002", "HCG Suchirayu Hospital", "Hubli", "Deshpande Nagar", 15.3490, 75.1350, "Oncology & Multispecialty"),
    create_hospital("HOSP-HBL-003", "Sushruta Hospital", "Hubli", "Gokul Road", 15.3600, 75.1250, "Multispecialty"),
    create_hospital("HOSP-HBL-004", "SDM Medical College Hospital", "Dharwad", "Sattur", 15.4400, 75.0080, "Teaching Hospital"),
    create_hospital("HOSP-HBL-005", "MM Joshi Eye Institute", "Hubli", "Gokul Road", 15.3580, 75.1200, "Ophthalmology"),
]

# =============================================================================
# MANGALURU HOSPITALS
# =============================================================================

MANGALURU_HOSPITALS: List[Hospital] = [
    create_hospital("HOSP-MNG-001", "KMC Hospital Manipal", "Mangaluru", "Hampankatte", 12.8680, 74.8420, "Multispecialty"),
    create_hospital("HOSP-MNG-002", "AJ Hospital & Research Centre", "Mangaluru", "Kuntikana", 12.8800, 74.8650, "Multispecialty"),
    create_hospital("HOSP-MNG-003", "Father Muller Medical College Hospital", "Mangaluru", "Kankanady", 12.8730, 74.8600, "Multispecialty"),
    create_hospital("HOSP-MNG-004", "Unity Hospital", "Mangaluru", "Kankanady", 12.8720, 74.8580, "Multispecialty"),
    create_hospital("HOSP-MNG-005", "Omega Hospital", "Mangaluru", "Pumpwell", 12.8750, 74.8680, "Cardiac"),
    create_hospital("HOSP-MNG-006", "Indiana Hospital", "Mangaluru", "Pumpwell", 12.8760, 74.8660, "Heart Institute"),
    create_hospital("HOSP-MNG-007", "Yenepoya Medical College Hospital", "Mangaluru", "Deralakatte", 12.8800, 74.9100, "Teaching Hospital"),
]

# =============================================================================
# OTHER KARNATAKA HOSPITALS
# =============================================================================

OTHER_KARNATAKA_HOSPITALS: List[Hospital] = [
    create_hospital("HOSP-KLB-001", "Basaveshwar Teaching Hospital", "Kalaburagi", "Central", 17.3290, 76.8360, "Teaching Hospital"),
    create_hospital("HOSP-KLB-002", "Khaja Bandanawaz Hospital", "Kalaburagi", "University", 17.3350, 76.8300, "Multispecialty"),
    create_hospital("HOSP-DVG-001", "Chigateri District Hospital", "Davanagere", "Central", 14.4644, 75.9218, "Government"),
    create_hospital("HOSP-DVG-002", "SSIMS Hospital", "Davanagere", "Central", 14.4610, 75.9250, "Teaching Hospital"),
    create_hospital("HOSP-BLY-001", "VIMS Hospital", "Bellary", "Cantonment", 15.1500, 76.9280, "Multispecialty"),
    create_hospital("HOSP-TMK-001", "Siddaganga Hospital", "Tumkur", "Central", 13.3379, 77.0990, "Multispecialty"),
    create_hospital("HOSP-SMG-001", "McGann Hospital", "Shimoga", "Central", 13.9300, 75.5680, "Government"),
    create_hospital("HOSP-UDP-001", "Kasturba Hospital Manipal", "Udupi", "Manipal", 13.3528, 74.7920, "Multispecialty"),
    create_hospital("HOSP-HSN-001", "Hassan Institute of Medical Sciences", "Hassan", "Central", 13.0068, 76.0996, "Government"),
]

# =============================================================================
# COMBINED DATASET
# =============================================================================

ALL_KARNATAKA_HOSPITALS: List[Hospital] = (
    BANGALORE_HOSPITALS +
    BELAGAVI_HOSPITALS +
    MYSURU_HOSPITALS +
    HUBLI_HOSPITALS +
    MANGALURU_HOSPITALS +
    OTHER_KARNATAKA_HOSPITALS
)

def get_hospitals_by_city(city: str) -> List[Hospital]:
    """Get all hospitals for a specific city."""
    return [h for h in ALL_KARNATAKA_HOSPITALS if h["city"].lower() == city.lower()]

def get_emergency_hospitals(city: str = None) -> List[Hospital]:
    """Get hospitals with emergency services."""
    hospitals = ALL_KARNATAKA_HOSPITALS if city is None else get_hospitals_by_city(city)
    return [h for h in hospitals if h.get("emergency", True)]

def get_hospital_by_id(hospital_id: str) -> Hospital | None:
    """Get a specific hospital by its ID."""
    for h in ALL_KARNATAKA_HOSPITALS:
        if h["id"] == hospital_id:
            return h
    return None
