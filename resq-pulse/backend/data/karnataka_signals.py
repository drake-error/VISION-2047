"""
Karnataka Traffic Signals Database
300+ traffic signals across Karnataka with real GPS coordinates
Complete coverage: Bangalore (150+), Belagavi (30+), Other cities (120+)
"""

from typing import List, Dict, Tuple

# Type definitions
Signal = Dict[str, any]

def create_signal(id: str, name: str, city: str, area: str, lat: float, lng: float, congestion: int = 50) -> Signal:
    return {
        "id": id,
        "name": name,
        "city": city,
        "area": area,
        "coords": [lng, lat],  # [longitude, latitude] for GeoJSON
        "congestion": congestion,
        "status": "NORMAL_CYCLE"
    }

# =============================================================================
# BANGALORE - Complete Traffic Signals (150+)
# =============================================================================

BANGALORE_SIGNALS: List[Signal] = [
    # --- South Bangalore ---
    create_signal("BLR-001", "Silk Board Junction", "Bangalore", "Silk Board", 12.9165, 77.6226, 92),
    create_signal("BLR-002", "HSR Layout Main Signal", "Bangalore", "HSR Layout", 12.9121, 77.6445, 65),
    create_signal("BLR-003", "HSR Layout BDA Complex", "Bangalore", "HSR Layout", 12.9150, 77.6389, 55),
    create_signal("BLR-004", "HSR Layout 27th Main", "Bangalore", "HSR Layout", 12.9081, 77.6401, 48),
    create_signal("BLR-005", "HSR Layout Sector 1", "Bangalore", "HSR Layout", 12.9175, 77.6500, 42),
    create_signal("BLR-006", "HSR Layout Agara Junction", "Bangalore", "HSR Layout", 12.9213, 77.6380, 58),
    create_signal("BLR-007", "BTM Layout 2nd Stage", "Bangalore", "BTM Layout", 12.9165, 77.6065, 70),
    create_signal("BLR-008", "BTM Layout Udupi Garden", "Bangalore", "BTM Layout", 12.9160, 77.6120, 62),
    create_signal("BLR-009", "BTM Layout Silk Board Side", "Bangalore", "BTM Layout", 12.9140, 77.6180, 75),
    create_signal("BLR-010", "JP Nagar 6th Phase", "Bangalore", "JP Nagar", 12.8952, 77.5850, 55),
    create_signal("BLR-011", "JP Nagar 2nd Phase", "Bangalore", "JP Nagar", 12.9077, 77.5835, 60),
    create_signal("BLR-012", "JP Nagar 15th Cross", "Bangalore", "JP Nagar", 12.8990, 77.5910, 45),
    create_signal("BLR-013", "JP Nagar NICE Road", "Bangalore", "JP Nagar", 12.8870, 77.5770, 50),
    create_signal("BLR-014", "Jayanagar 4th Block", "Bangalore", "Jayanagar", 12.9254, 77.5833, 68),
    create_signal("BLR-015", "Jayanagar 9th Block", "Bangalore", "Jayanagar", 12.9196, 77.5800, 55),
    create_signal("BLR-016", "Jayanagar 3rd Block East", "Bangalore", "Jayanagar", 12.9280, 77.5890, 52),
    create_signal("BLR-017", "Jayanagar Complex Signal", "Bangalore", "Jayanagar", 12.9310, 77.5825, 60),
    create_signal("BLR-018", "Bannerghatta Road IIMB", "Bangalore", "Bannerghatta Road", 12.8960, 77.5960, 72),
    create_signal("BLR-019", "Bannerghatta Road Meenakshi Temple", "Bangalore", "Bannerghatta Road", 12.8830, 77.5928, 65),
    create_signal("BLR-020", "Bannerghatta Road Arekere", "Bangalore", "Bannerghatta Road", 12.8745, 77.5975, 58),
    create_signal("BLR-021", "Dairy Circle", "Bangalore", "Bannerghatta Road", 12.9350, 77.5920, 80),
    create_signal("BLR-022", "Lalbagh West Gate", "Bangalore", "Basavanagudi", 12.9510, 77.5720, 62),
    create_signal("BLR-023", "Basavanagudi DVG Road", "Bangalore", "Basavanagudi", 12.9430, 77.5680, 50),
    create_signal("BLR-024", "Basavanagudi Bull Temple Road", "Bangalore", "Basavanagudi", 12.9410, 77.5730, 55),
    create_signal("BLR-025", "Wilson Garden", "Bangalore", "Wilson Garden", 12.9470, 77.5960, 63),
    
    # --- Koramangala ---
    create_signal("BLR-026", "Koramangala 80 Feet Road", "Bangalore", "Koramangala", 12.9352, 77.6252, 70),
    create_signal("BLR-027", "Koramangala Forum Mall", "Bangalore", "Koramangala", 12.9344, 77.6112, 78),
    create_signal("BLR-028", "Koramangala BDA Complex", "Bangalore", "Koramangala", 12.9380, 77.6200, 65),
    create_signal("BLR-029", "Koramangala 4th Block", "Bangalore", "Koramangala", 12.9390, 77.6140, 55),
    create_signal("BLR-030", "Koramangala 6th Block", "Bangalore", "Koramangala", 12.9320, 77.6180, 60),
    create_signal("BLR-031", "Koramangala ST Bed", "Bangalore", "Koramangala", 12.9270, 77.6230, 58),
    create_signal("BLR-032", "Koramangala Sony Signal", "Bangalore", "Koramangala", 12.9360, 77.6300, 67),
    
    # --- East Bangalore ---
    create_signal("BLR-033", "Indiranagar 100 Feet Road", "Bangalore", "Indiranagar", 12.9716, 77.6412, 72),
    create_signal("BLR-034", "Indiranagar CMH Road", "Bangalore", "Indiranagar", 12.9800, 77.6400, 65),
    create_signal("BLR-035", "Indiranagar Defence Colony", "Bangalore", "Indiranagar", 12.9750, 77.6350, 55),
    create_signal("BLR-036", "Indiranagar Domlur", "Bangalore", "Indiranagar", 12.9610, 77.6380, 60),
    create_signal("BLR-037", "HAL Airport Road", "Bangalore", "HAL", 12.9590, 77.6570, 68),
    create_signal("BLR-038", "Old Airport Road Domlur", "Bangalore", "Domlur", 12.9615, 77.6310, 63),
    create_signal("BLR-039", "Marathahalli Junction", "Bangalore", "Marathahalli", 12.9567, 77.7011, 85),
    create_signal("BLR-040", "Marathahalli Bridge", "Bangalore", "Marathahalli", 12.9560, 77.6970, 82),
    create_signal("BLR-041", "Marathahalli ORR", "Bangalore", "Marathahalli", 12.9580, 77.7060, 75),
    create_signal("BLR-042", "Bellandur Junction", "Bangalore", "Bellandur", 12.9250, 77.6780, 78),
    create_signal("BLR-043", "Bellandur Gate", "Bangalore", "Bellandur", 12.9310, 77.6720, 70),
    create_signal("BLR-044", "Sarjapur Road Junction", "Bangalore", "Sarjapur Road", 12.9100, 77.6840, 72),
    create_signal("BLR-045", "Sarjapur Road Wipro", "Bangalore", "Sarjapur Road", 12.9050, 77.6900, 65),
    create_signal("BLR-046", "Whitefield Main Road", "Bangalore", "Whitefield", 12.9698, 77.7500, 70),
    create_signal("BLR-047", "Whitefield ITPL", "Bangalore", "Whitefield", 12.9850, 77.7320, 82),
    create_signal("BLR-048", "Whitefield Hope Farm", "Bangalore", "Whitefield", 12.9770, 77.7590, 68),
    create_signal("BLR-049", "Whitefield Kadugodi", "Bangalore", "Whitefield", 12.9950, 77.7600, 55),
    create_signal("BLR-050", "Varthur Main Road", "Bangalore", "Varthur", 12.9370, 77.7420, 52),
    
    # --- ORR (Outer Ring Road) Corridor ---
    create_signal("BLR-051", "ORR Bellandur", "Bangalore", "ORR", 12.9260, 77.6760, 88),
    create_signal("BLR-052", "ORR Kadubeesanahalli", "Bangalore", "ORR", 12.9360, 77.6890, 80),
    create_signal("BLR-053", "ORR Devarabisanahalli", "Bangalore", "ORR", 12.9450, 77.6960, 78),
    create_signal("BLR-054", "ORR Marathahalli", "Bangalore", "ORR", 12.9550, 77.7020, 85),
    create_signal("BLR-055", "ORR Mahadevapura", "Bangalore", "ORR", 12.9870, 77.6820, 72),
    create_signal("BLR-056", "ORR KR Puram", "Bangalore", "ORR", 13.0035, 77.6698, 80),
    create_signal("BLR-057", "ORR Hebbal", "Bangalore", "ORR", 13.0350, 77.5950, 75),
    create_signal("BLR-058", "ORR Nagavara", "Bangalore", "ORR", 13.0250, 77.6100, 68),
    create_signal("BLR-059", "ORR Manyata Tech Park", "Bangalore", "ORR", 13.0470, 77.6220, 72),
    
    # --- North Bangalore ---
    create_signal("BLR-060", "Hebbal Flyover Junction", "Bangalore", "Hebbal", 13.0450, 77.5969, 85),
    create_signal("BLR-061", "Hebbal Kempapura", "Bangalore", "Hebbal", 13.0380, 77.5910, 70),
    create_signal("BLR-062", "Mekhri Circle", "Bangalore", "Sadashivanagar", 13.0070, 77.5780, 72),
    create_signal("BLR-063", "Sadashivanagar Palace Road", "Bangalore", "Sadashivanagar", 12.9980, 77.5840, 55),
    create_signal("BLR-064", "Yeshwanthpur Circle", "Bangalore", "Yeshwanthpur", 13.0230, 77.5540, 75),
    create_signal("BLR-065", "Yeshwanthpur Railway Gate", "Bangalore", "Yeshwanthpur", 13.0280, 77.5490, 80),
    create_signal("BLR-066", "Peenya Industrial Area", "Bangalore", "Peenya", 13.0330, 77.5180, 62),
    create_signal("BLR-067", "Jalahalli Cross", "Bangalore", "Jalahalli", 13.0390, 77.5350, 55),
    create_signal("BLR-068", "Nagawara Junction", "Bangalore", "Nagawara", 13.0340, 77.6150, 68),
    create_signal("BLR-069", "RT Nagar", "Bangalore", "RT Nagar", 13.0200, 77.5920, 60),
    create_signal("BLR-070", "Thanisandra Main Road", "Bangalore", "Thanisandra", 13.0580, 77.6260, 52),
    create_signal("BLR-071", "Yelahanka Junction", "Bangalore", "Yelahanka", 13.1010, 77.5960, 58),
    create_signal("BLR-072", "Yelahanka Kogilu Cross", "Bangalore", "Yelahanka", 13.0900, 77.5870, 50),
    
    # --- Central Bangalore ---
    create_signal("BLR-073", "Majestic Bus Stand", "Bangalore", "Majestic", 12.9770, 77.5713, 90),
    create_signal("BLR-074", "KR Market", "Bangalore", "KR Market", 12.9640, 77.5780, 85),
    create_signal("BLR-075", "Town Hall", "Bangalore", "Town Hall", 12.9730, 77.5790, 78),
    create_signal("BLR-076", "MG Road Metro", "Bangalore", "MG Road", 12.9756, 77.6063, 72),
    create_signal("BLR-077", "Brigade Road", "Bangalore", "Brigade Road", 12.9722, 77.6070, 68),
    create_signal("BLR-078", "Richmond Circle", "Bangalore", "Richmond Town", 12.9630, 77.6020, 73),
    create_signal("BLR-079", "Residency Road", "Bangalore", "Residency Road", 12.9700, 77.5990, 65),
    create_signal("BLR-080", "Cubbon Park Main Gate", "Bangalore", "Cubbon Park", 12.9763, 77.5929, 45),
    create_signal("BLR-081", "Vidhana Soudha", "Bangalore", "Vidhana Soudha", 12.9790, 77.5910, 55),
    create_signal("BLR-082", "Hudson Circle", "Bangalore", "Hudson Circle", 12.9680, 77.5850, 62),
    create_signal("BLR-083", "Shivajinagar Bus Stand", "Bangalore", "Shivajinagar", 12.9850, 77.6050, 78),
    create_signal("BLR-084", "Commercial Street", "Bangalore", "Commercial Street", 12.9830, 77.6100, 72),
    create_signal("BLR-085", "Cunningham Road", "Bangalore", "Cunningham Road", 12.9870, 77.5850, 55),
    create_signal("BLR-086", "Ulsoor Lake", "Bangalore", "Ulsoor", 12.9810, 77.6200, 48),
    create_signal("BLR-087", "Trinity Circle", "Bangalore", "Trinity Circle", 12.9700, 77.6150, 70),
    
    # --- West Bangalore ---
    create_signal("BLR-088", "Rajajinagar Main Road", "Bangalore", "Rajajinagar", 12.9920, 77.5520, 65),
    create_signal("BLR-089", "Rajajinagar 4th Block", "Bangalore", "Rajajinagar", 12.9980, 77.5480, 55),
    create_signal("BLR-090", "Vijayanagar BDA Complex", "Bangalore", "Vijayanagar", 12.9700, 77.5310, 60),
    create_signal("BLR-091", "Vijayanagar 17th Cross", "Bangalore", "Vijayanagar", 12.9730, 77.5260, 50),
    create_signal("BLR-092", "Basaveshwara Nagar", "Bangalore", "Basaveshwara Nagar", 12.9870, 77.5350, 58),
    create_signal("BLR-093", "Mahalakshmipuram", "Bangalore", "Mahalakshmipuram", 12.9960, 77.5420, 52),
    create_signal("BLR-094", "Malleshwaram 8th Cross", "Bangalore", "Malleshwaram", 13.0030, 77.5700, 65),
    create_signal("BLR-095", "Malleshwaram 18th Cross", "Bangalore", "Malleshwaram", 13.0080, 77.5650, 58),
    create_signal("BLR-096", "Mantri Mall Signal", "Bangalore", "Malleshwaram", 12.9970, 77.5700, 72),
    create_signal("BLR-097", "Nagarbhavi Main Road", "Bangalore", "Nagarbhavi", 12.9600, 77.5100, 48),
    create_signal("BLR-098", "Mysore Road Junction", "Bangalore", "Mysore Road", 12.9570, 77.5400, 75),
    create_signal("BLR-099", "Chord Road Vijayanagar", "Bangalore", "Chord Road", 12.9680, 77.5370, 68),
    create_signal("BLR-100", "Kengeri Junction", "Bangalore", "Kengeri", 12.9130, 77.4820, 55),
    
    # --- Electronic City & South-East ---
    create_signal("BLR-101", "Electronic City Phase 1 Gate", "Bangalore", "Electronic City", 12.8452, 77.6601, 78),
    create_signal("BLR-102", "Electronic City Wipro Gate", "Bangalore", "Electronic City", 12.8380, 77.6570, 72),
    create_signal("BLR-103", "Electronic City Infosys Gate", "Bangalore", "Electronic City", 12.8420, 77.6530, 75),
    create_signal("BLR-104", "Electronic City SBI Signal", "Bangalore", "Electronic City", 12.8470, 77.6650, 68),
    create_signal("BLR-105", "Electronic City Siemens Junction", "Bangalore", "Electronic City", 12.8350, 77.6620, 65),
    create_signal("BLR-106", "Bommanahalli Signal", "Bangalore", "Bommanahalli", 12.8910, 77.6210, 72),
    create_signal("BLR-107", "Bommanahalli NICE Road", "Bangalore", "Bommanahalli", 12.8860, 77.6180, 60),
    create_signal("BLR-108", "Kudlu Gate", "Bangalore", "Kudlu", 12.8960, 77.6450, 65),
    create_signal("BLR-109", "Begur Main Road", "Bangalore", "Begur", 12.8820, 77.6340, 55),
    
    # --- Hosur Road Corridor ---
    create_signal("BLR-110", "Madiwala Junction", "Bangalore", "Madiwala", 12.9230, 77.6180, 80),
    create_signal("BLR-111", "Madiwala Market Signal", "Bangalore", "Madiwala", 12.9200, 77.6160, 75),
    create_signal("BLR-112", "Tavarekere Signal", "Bangalore", "Tavarekere", 12.9300, 77.6050, 62),
    create_signal("BLR-113", "RV Road Signal", "Bangalore", "RV Road", 12.9430, 77.5820, 70),
    create_signal("BLR-114", "Lalbagh Main Gate", "Bangalore", "Lalbagh", 12.9500, 77.5850, 55),
    create_signal("BLR-115", "KR Puram Junction", "Bangalore", "KR Puram", 13.0035, 77.6698, 82),
    create_signal("BLR-116", "KR Puram Tin Factory", "Bangalore", "KR Puram", 13.0050, 77.6600, 78),
    create_signal("BLR-117", "KR Puram Railway Bridge", "Bangalore", "KR Puram", 13.0010, 77.6750, 72),
    
    # --- Additional Bangalore Signals ---
    create_signal("BLR-118", "Banashankari Signal", "Bangalore", "Banashankari", 12.9250, 77.5480, 65),
    create_signal("BLR-119", "Banashankari BDA Complex", "Bangalore", "Banashankari", 12.9200, 77.5530, 58),
    create_signal("BLR-120", "Kumaraswamy Layout", "Bangalore", "Kumaraswamy Layout", 12.9100, 77.5600, 52),
    create_signal("BLR-121", "Girinagar Signal", "Bangalore", "Girinagar", 12.9350, 77.5520, 48),
    create_signal("BLR-122", "Kathriguppe Main Road", "Bangalore", "Kathriguppe", 12.9290, 77.5560, 50),
    create_signal("BLR-123", "RR Nagar Arch", "Bangalore", "RR Nagar", 12.9340, 77.5170, 55),
    create_signal("BLR-124", "RR Nagar BEML Layout", "Bangalore", "RR Nagar", 12.9280, 77.5120, 48),
    create_signal("BLR-125", "Uttarahalli Main Road", "Bangalore", "Uttarahalli", 12.8980, 77.5400, 45),
    create_signal("BLR-126", "Kanakapura Road Signal", "Bangalore", "Kanakapura Road", 12.8900, 77.5600, 68),
    create_signal("BLR-127", "Kanakapura Road Art of Living", "Bangalore", "Kanakapura Road", 12.8700, 77.5500, 50),
    create_signal("BLR-128", "Hulimavu Signal", "Bangalore", "Hulimavu", 12.8780, 77.6020, 55),
    create_signal("BLR-129", "Gottigere Signal", "Bangalore", "Gottigere", 12.8650, 77.5970, 52),
    create_signal("BLR-130", "Konanakunte Cross", "Bangalore", "Konanakunte", 12.8800, 77.5700, 58),
    create_signal("BLR-131", "Anjanapura Signal", "Bangalore", "Anjanapura", 12.8600, 77.5680, 42),
    create_signal("BLR-132", "CV Raman Nagar", "Bangalore", "CV Raman Nagar", 12.9850, 77.6600, 60),
    create_signal("BLR-133", "Banaswadi Main Road", "Bangalore", "Banaswadi", 13.0100, 77.6450, 58),
    create_signal("BLR-134", "Hennur Main Road", "Bangalore", "Hennur", 13.0250, 77.6350, 55),
    create_signal("BLR-135", "Kalyan Nagar Junction", "Bangalore", "Kalyan Nagar", 13.0200, 77.6380, 65),
    create_signal("BLR-136", "HRBR Layout", "Bangalore", "HRBR Layout", 13.0130, 77.6320, 52),
    create_signal("BLR-137", "Ramamurthy Nagar", "Bangalore", "Ramamurthy Nagar", 13.0150, 77.6680, 55),
    create_signal("BLR-138", "HBR Layout Signal", "Bangalore", "HBR Layout", 13.0270, 77.6280, 48),
    create_signal("BLR-139", "Kammanahalli Main Road", "Bangalore", "Kammanahalli", 13.0100, 77.6350, 52),
    create_signal("BLR-140", "Horamavu Signal", "Bangalore", "Horamavu", 13.0320, 77.6580, 50),
    create_signal("BLR-141", "Mahadevapura Signal", "Bangalore", "Mahadevapura", 12.9870, 77.6820, 68),
    create_signal("BLR-142", "Kundalahalli Junction", "Bangalore", "Kundalahalli", 12.9600, 77.7100, 72),
    create_signal("BLR-143", "Brookefield Main Road", "Bangalore", "Brookefield", 12.9680, 77.7300, 58),
    create_signal("BLR-144", "Hoskote Junction", "Bangalore", "Hoskote", 13.0700, 77.7980, 45),
    create_signal("BLR-145", "Devanahalli Circle", "Bangalore", "Devanahalli", 13.2460, 77.7130, 40),
    create_signal("BLR-146", "Airport Road Hebbal", "Bangalore", "Airport Road", 13.0500, 77.5940, 78),
    create_signal("BLR-147", "Esteem Mall Signal", "Bangalore", "Hebbal", 13.0420, 77.5910, 65),
    create_signal("BLR-148", "Kodigehalli Signal", "Bangalore", "Kodigehalli", 13.0600, 77.5880, 52),
    create_signal("BLR-149", "Vidyaranyapura Main Road", "Bangalore", "Vidyaranyapura", 13.0700, 77.5700, 48),
    create_signal("BLR-150", "Jakkur Cross", "Bangalore", "Jakkur", 13.0750, 77.5850, 45),
    create_signal("BLR-151", "Sahakara Nagar Signal", "Bangalore", "Sahakara Nagar", 13.0580, 77.5950, 52),
    create_signal("BLR-152", "Sanjaynagar Main Road", "Bangalore", "Sanjaynagar", 13.0280, 77.5730, 55),
    create_signal("BLR-153", "Mathikere Junction", "Bangalore", "Mathikere", 13.0200, 77.5650, 58),
]

# =============================================================================
# BELAGAVI (BELGAUM) - Complete Traffic Signals (30+)
# =============================================================================

BELAGAVI_SIGNALS: List[Signal] = [
    # --- Central Belagavi ---
    create_signal("BGM-001", "Rani Channamma Circle", "Belagavi", "City Center", 15.8520, 74.5050, 80),
    create_signal("BGM-002", "Ashok Circle", "Belagavi", "Fort Area", 15.8489, 74.5010, 75),
    create_signal("BGM-003", "Dharmaveer Sambhaji Circle", "Belagavi", "Shahpur", 15.8550, 74.5090, 72),
    create_signal("BGM-004", "Gogte Circle", "Belagavi", "Tilakwadi", 15.8580, 74.5020, 68),
    create_signal("BGM-005", "RPD Corner", "Belagavi", "Camp Area", 15.8620, 74.5080, 70),
    create_signal("BGM-006", "Central Bus Stand Signal", "Belagavi", "CBS", 15.8510, 74.5070, 85),
    create_signal("BGM-007", "Sangolli Rayanna Circle (RTO)", "Belagavi", "Shahapur", 15.8440, 74.5120, 65),
    create_signal("BGM-008", "Krishnadevaraya Circle", "Belagavi", "Kolhapur Cross", 15.8650, 74.5060, 62),
    create_signal("BGM-009", "College Road Junction", "Belagavi", "College Road", 15.8560, 74.5000, 55),
    create_signal("BGM-010", "Bogarves Circle", "Belagavi", "Bogarves", 15.8500, 74.4980, 58),
    
    # --- North Belagavi ---
    create_signal("BGM-011", "Khanapur Road Signal", "Belagavi", "Khanapur Road", 15.8350, 74.4900, 52),
    create_signal("BGM-012", "Udyambag Industrial Signal", "Belagavi", "Udyambag", 15.8750, 74.5150, 48),
    create_signal("BGM-013", "Angol Main Road Signal", "Belagavi", "Angol", 15.8680, 74.5200, 55),
    create_signal("BGM-014", "Hindalga Circle", "Belagavi", "Hindalga", 15.8700, 74.5250, 45),
    create_signal("BGM-015", "Vadgaon Junction", "Belagavi", "Vadgaon", 15.8430, 74.4850, 50),
    
    # --- South & East Belagavi ---
    create_signal("BGM-016", "Mahantesh Nagar Signal", "Belagavi", "Mahantesh Nagar", 15.8390, 74.5080, 52),
    create_signal("BGM-017", "Gandhinagar Main Signal", "Belagavi", "Gandhinagar", 15.8470, 74.5150, 60),
    create_signal("BGM-018", "Tilakwadi Circle", "Belagavi", "Tilakwadi", 15.8590, 74.5030, 55),
    create_signal("BGM-019", "KLE Campus Gate Signal", "Belagavi", "Nehru Nagar", 15.8460, 74.4920, 65),
    create_signal("BGM-020", "Maratha Mandir Signal", "Belagavi", "Maratha Mandir", 15.8530, 74.5040, 58),
    
    # --- Cantonment & Outer Areas ---
    create_signal("BGM-021", "Camp Junction", "Belagavi", "Camp", 15.8630, 74.5100, 60),
    create_signal("BGM-022", "Khade Bazaar Signal", "Belagavi", "Khade Bazaar", 15.8480, 74.5060, 72),
    create_signal("BGM-023", "Shahapur Junction", "Belagavi", "Shahapur", 15.8540, 74.5120, 55),
    create_signal("BGM-024", "Shivbasav Nagar Signal", "Belagavi", "Shivbasav Nagar", 15.8380, 74.5170, 48),
    create_signal("BGM-025", "Kanbargi Road Signal", "Belagavi", "Kanbargi", 15.8300, 74.5200, 42),
    create_signal("BGM-026", "Sankam Hotel Junction (NH-48)", "Belagavi", "NH-48", 15.8700, 74.5110, 78),
    create_signal("BGM-027", "Govaves Circle", "Belagavi", "Govaves", 15.8490, 74.4950, 50),
    create_signal("BGM-028", "Shastri Nagar Signal", "Belagavi", "Shastri Nagar", 15.8560, 74.4980, 45),
    create_signal("BGM-029", "Hanuman Nagar Signal", "Belagavi", "Hanuman Nagar", 15.8420, 74.5090, 52),
    create_signal("BGM-030", "Kakati Road Signal", "Belagavi", "Kakati", 15.8350, 74.5100, 48),
    create_signal("BGM-031", "Sulebhavi Junction", "Belagavi", "Sulebhavi", 15.8800, 74.5050, 42),
    create_signal("BGM-032", "Gokak Road Signal", "Belagavi", "Gokak Road", 15.8250, 74.4950, 45),
]

# =============================================================================
# MYSURU (MYSORE) - Traffic Signals (25+)
# =============================================================================

MYSURU_SIGNALS: List[Signal] = [
    create_signal("MYS-001", "Metropole Circle", "Mysuru", "Central", 12.3100, 76.6520, 72),
    create_signal("MYS-002", "KR Circle", "Mysuru", "Central", 12.3050, 76.6560, 68),
    create_signal("MYS-003", "Hinkal Junction", "Mysuru", "Hinkal", 12.3140, 76.6150, 62),
    create_signal("MYS-004", "Siddappa Square", "Mysuru", "Central", 12.3080, 76.6540, 65),
    create_signal("MYS-005", "KSRTC Bus Stand Signal", "Mysuru", "KSRTC", 12.2960, 76.6380, 78),
    create_signal("MYS-006", "Agrahara Circle", "Mysuru", "Agrahara", 12.3020, 76.6460, 55),
    create_signal("MYS-007", "Sayyaji Rao Road", "Mysuru", "Sayyaji Rao Road", 12.3060, 76.6530, 70),
    create_signal("MYS-008", "Chamaraja Circle", "Mysuru", "Chamaraja", 12.3120, 76.6600, 58),
    create_signal("MYS-009", "JLB Road Signal", "Mysuru", "JLB Road", 12.3180, 76.6450, 52),
    create_signal("MYS-010", "Jayalakshmipuram Signal", "Mysuru", "Jayalakshmipuram", 12.3200, 76.6380, 48),
    create_signal("MYS-011", "Vijayanagar 1st Stage", "Mysuru", "Vijayanagar", 12.3250, 76.6250, 55),
    create_signal("MYS-012", "Kuvempunagar Signal", "Mysuru", "Kuvempunagar", 12.3150, 76.6700, 50),
    create_signal("MYS-013", "Bannimantap Junction", "Mysuru", "Bannimantap", 12.3080, 76.6260, 60),
    create_signal("MYS-014", "Ring Road Hebbal", "Mysuru", "Hebbal", 12.3350, 76.6100, 52),
    create_signal("MYS-015", "Bogadi Road Signal", "Mysuru", "Bogadi", 12.2900, 76.6200, 48),
    create_signal("MYS-016", "Nanjangud Road Signal", "Mysuru", "Nanjangud Road", 12.2850, 76.6450, 55),
    create_signal("MYS-017", "Yadavagiri Signal", "Mysuru", "Yadavagiri", 12.3300, 76.6550, 50),
    create_signal("MYS-018", "Nazarbad Main Road", "Mysuru", "Nazarbad", 12.3170, 76.6420, 52),
    create_signal("MYS-019", "VV Mohalla Signal", "Mysuru", "VV Mohalla", 12.3050, 76.6600, 60),
    create_signal("MYS-020", "Ramavilas Road Signal", "Mysuru", "Ramavilas Road", 12.3100, 76.6580, 55),
    create_signal("MYS-021", "Columbia Asia Junction", "Mysuru", "ORR", 12.3400, 76.5950, 65),
    create_signal("MYS-022", "Hootagalli Junction", "Mysuru", "Hootagalli", 12.3500, 76.5900, 58),
    create_signal("MYS-023", "Dattagalli Circle", "Mysuru", "Dattagalli", 12.2950, 76.6100, 45),
    create_signal("MYS-024", "Vidyaranyapuram Signal", "Mysuru", "Vidyaranyapuram", 12.2880, 76.6350, 42),
    create_signal("MYS-025", "Manasagangothri Gate", "Mysuru", "University", 12.3100, 76.6180, 40),
]

# =============================================================================
# HUBLI-DHARWAD - Traffic Signals (25+)
# =============================================================================

HUBLI_DHARWAD_SIGNALS: List[Signal] = [
    # --- Hubli ---
    create_signal("HBL-001", "Rani Chennamma Circle (Hubli)", "Hubli", "Central", 15.3517, 75.1390, 78),
    create_signal("HBL-002", "Durgad Bail Signal", "Hubli", "Durgad Bail", 15.3490, 75.1350, 72),
    create_signal("HBL-003", "Hosur Junction", "Hubli", "Hosur", 15.3450, 75.1280, 68),
    create_signal("HBL-004", "Vidyanagar Signal", "Hubli", "Vidyanagar", 15.3550, 75.1420, 55),
    create_signal("HBL-005", "Gokul Road Signal", "Hubli", "Gokul Road", 15.3600, 75.1250, 65),
    create_signal("HBL-006", "CBT Signal (Hubli)", "Hubli", "CBT", 15.3480, 75.1370, 80),
    create_signal("HBL-007", "Old Hubli Signal", "Hubli", "Old Hubli", 15.3440, 75.1410, 62),
    create_signal("HBL-008", "Keshwapur Signal", "Hubli", "Keshwapur", 15.3580, 75.1200, 52),
    create_signal("HBL-009", "Navalur Junction", "Hubli", "Navalur", 15.3650, 75.1150, 58),
    create_signal("HBL-010", "Toll Naka (Hubli)", "Hubli", "Toll Naka", 15.3700, 75.1100, 72),
    create_signal("HBL-011", "Akshay Park Signal", "Hubli", "Akshay Park", 15.3530, 75.1300, 48),
    create_signal("HBL-012", "Unkal Junction", "Hubli", "Unkal", 15.3750, 75.1050, 55),
    
    # --- Dharwad ---
    create_signal("DWD-001", "Jubilee Circle (Dharwad)", "Dharwad", "Central", 15.4590, 75.0070, 70),
    create_signal("DWD-002", "Court Circle (Dharwad)", "Dharwad", "Court Area", 15.4560, 75.0100, 62),
    create_signal("DWD-003", "Saptapur Signal", "Dharwad", "Saptapur", 15.4530, 75.0050, 55),
    create_signal("DWD-004", "PB Road Signal", "Dharwad", "PB Road", 15.4620, 75.0120, 58),
    create_signal("DWD-005", "Lakamanahalli Signal", "Dharwad", "Lakamanahalli", 15.4500, 75.0000, 48),
    create_signal("DWD-006", "Kelgeri Signal", "Dharwad", "Kelgeri", 15.4480, 74.9950, 45),
    create_signal("DWD-007", "Karnatak University Gate", "Dharwad", "University", 15.4400, 75.0080, 52),
    create_signal("DWD-008", "Malamaddi Signal", "Dharwad", "Malamaddi", 15.4650, 75.0150, 50),
    create_signal("DWD-009", "Haliyal Road Signal", "Dharwad", "Haliyal Road", 15.4700, 75.0050, 55),
    create_signal("DWD-010", "CBT Signal (Dharwad)", "Dharwad", "CBT", 15.4570, 75.0090, 65),
    create_signal("DWD-011", "Railway Station Signal", "Dharwad", "Railway Station", 15.4550, 75.0110, 60),
    create_signal("DWD-012", "Kalabhavan Road Signal", "Dharwad", "Kalabhavan", 15.4610, 75.0060, 48),
]

# =============================================================================
# MANGALURU (MANGALORE) - Traffic Signals (25+)
# =============================================================================

MANGALURU_SIGNALS: List[Signal] = [
    create_signal("MNG-001", "Nanthoor Junction", "Mangaluru", "Nanthoor", 12.8870, 74.8780, 82),
    create_signal("MNG-002", "Pumpwell Circle", "Mangaluru", "Pumpwell", 12.8750, 74.8680, 78),
    create_signal("MNG-003", "Hampankatte Junction", "Mangaluru", "Hampankatte", 12.8680, 74.8420, 75),
    create_signal("MNG-004", "Bunts Hostel Junction", "Mangaluru", "Bunts Hostel", 12.8720, 74.8500, 68),
    create_signal("MNG-005", "Kankanady Junction", "Mangaluru", "Kankanady", 12.8730, 74.8600, 72),
    create_signal("MNG-006", "Mallikatte Junction", "Mangaluru", "Mallikatte", 12.8690, 74.8460, 62),
    create_signal("MNG-007", "PVS Junction", "Mangaluru", "PVS", 12.8760, 74.8560, 65),
    create_signal("MNG-008", "Karavali Junction", "Mangaluru", "Karavali", 12.8800, 74.8650, 70),
    create_signal("MNG-009", "Thokkottu Junction", "Mangaluru", "Thokkottu", 12.8500, 74.8900, 55),
    create_signal("MNG-010", "Kallapu Junction", "Mangaluru", "Kallapu", 12.8450, 74.8850, 52),
    create_signal("MNG-011", "KPT Junction", "Mangaluru", "KPT", 12.8700, 74.8350, 58),
    create_signal("MNG-012", "Padil Junction", "Mangaluru", "Padil", 12.8660, 74.8550, 60),
    create_signal("MNG-013", "Balmatta Road Signal", "Mangaluru", "Balmatta", 12.8710, 74.8440, 55),
    create_signal("MNG-014", "Kadri Signal", "Mangaluru", "Kadri", 12.8780, 74.8520, 50),
    create_signal("MNG-015", "Bikarnakatte Junction", "Mangaluru", "Bikarnakatte", 12.8820, 74.8720, 65),
    create_signal("MNG-016", "Jeppu Junction", "Mangaluru", "Jeppu", 12.8600, 74.8380, 55),
    create_signal("MNG-017", "Attavar Signal", "Mangaluru", "Attavar", 12.8650, 74.8430, 60),
    create_signal("MNG-018", "Bendoor Signal", "Mangaluru", "Bendoor", 12.8640, 74.8480, 52),
    create_signal("MNG-019", "Bejai Signal", "Mangaluru", "Bejai", 12.8790, 74.8580, 48),
    create_signal("MNG-020", "Kottara Chowki Signal", "Mangaluru", "Kottara", 12.8850, 74.8620, 55),
    create_signal("MNG-021", "Surathkal Junction", "Mangaluru", "Surathkal", 12.9980, 74.8090, 58),
    create_signal("MNG-022", "NITK Gate Signal", "Mangaluru", "Surathkal", 13.0100, 74.7950, 42),
    create_signal("MNG-023", "Mukka Junction", "Mangaluru", "Mukka", 12.9500, 74.8400, 48),
    create_signal("MNG-024", "BC Road Junction", "Mangaluru", "BC Road", 12.8400, 75.0100, 55),
    create_signal("MNG-025", "Ullal Signal", "Mangaluru", "Ullal", 12.8050, 74.8600, 45),
]

# =============================================================================
# OTHER KARNATAKA CITIES - Traffic Signals (75+)
# =============================================================================

OTHER_KARNATAKA_SIGNALS: List[Signal] = [
    # --- Kalaburagi (Gulbarga) ---
    create_signal("KLB-001", "Super Market Circle", "Kalaburagi", "Central", 17.3290, 76.8360, 65),
    create_signal("KLB-002", "Jagat Circle", "Kalaburagi", "Jagat", 17.3260, 76.8320, 60),
    create_signal("KLB-003", "Humnabad Road Signal", "Kalaburagi", "Humnabad Road", 17.3310, 76.8400, 55),
    create_signal("KLB-004", "University Road Signal", "Kalaburagi", "University", 17.3350, 76.8300, 50),
    create_signal("KLB-005", "Station Road Signal", "Kalaburagi", "Station Road", 17.3230, 76.8350, 58),
    create_signal("KLB-006", "Sedam Road Circle", "Kalaburagi", "Sedam Road", 17.3380, 76.8420, 48),
    create_signal("KLB-007", "Aiwan-e-Shahi Signal", "Kalaburagi", "Aiwan-e-Shahi", 17.3200, 76.8280, 52),
    create_signal("KLB-008", "Ring Road Signal", "Kalaburagi", "Ring Road", 17.3400, 76.8450, 45),
    
    # --- Davanagere ---
    create_signal("DVG-001", "PJ Extension Circle", "Davanagere", "PJ Extension", 14.4644, 75.9218, 62),
    create_signal("DVG-002", "MCC Circle", "Davanagere", "MCC", 14.4610, 75.9250, 58),
    create_signal("DVG-003", "Hadadi Road Signal", "Davanagere", "Hadadi Road", 14.4680, 75.9180, 55),
    create_signal("DVG-004", "Nittuvalli Signal", "Davanagere", "Nittuvalli", 14.4560, 75.9200, 50),
    create_signal("DVG-005", "Savalanga Road Signal", "Davanagere", "Savalanga Road", 14.4700, 75.9280, 48),
    create_signal("DVG-006", "AVK College Signal", "Davanagere", "AVK", 14.4590, 75.9170, 52),
    create_signal("DVG-007", "Kondajji Road Signal", "Davanagere", "Kondajji", 14.4630, 75.9300, 45),
    
    # --- Bellary (Ballari) ---
    create_signal("BLY-001", "Patel Circle", "Bellary", "Central", 15.1394, 76.9214, 60),
    create_signal("BLY-002", "Station Road Circle", "Bellary", "Station Road", 15.1420, 76.9240, 55),
    create_signal("BLY-003", "Gandhinagar Signal", "Bellary", "Gandhinagar", 15.1370, 76.9180, 52),
    create_signal("BLY-004", "Hospet Road Signal", "Bellary", "Hospet Road", 15.1450, 76.9260, 48),
    create_signal("BLY-005", "Cowl Bazaar Signal", "Bellary", "Cowl Bazaar", 15.1360, 76.9200, 55),
    create_signal("BLY-006", "Cantonment Signal", "Bellary", "Cantonment", 15.1500, 76.9280, 45),
    
    # --- Tumkur (Tumakuru) ---
    create_signal("TMK-001", "Amanikere Circle", "Tumkur", "Central", 13.3379, 77.0990, 62),
    create_signal("TMK-002", "SS Puram Signal", "Tumkur", "SS Puram", 13.3400, 77.1020, 55),
    create_signal("TMK-003", "Kyathasandra Signal", "Tumkur", "Kyathasandra", 13.3420, 77.0960, 50),
    create_signal("TMK-004", "Sira Gate Signal", "Tumkur", "Sira Gate", 13.3350, 77.0950, 48),
    create_signal("TMK-005", "BH Road Signal", "Tumkur", "BH Road", 13.3380, 77.1050, 52),
    create_signal("TMK-006", "Gubbi Gate Signal", "Tumkur", "Gubbi Gate", 13.3430, 77.0940, 45),
    
    # --- Shimoga (Shivamogga) ---
    create_signal("SMG-001", "Gandhi Bazaar Circle", "Shimoga", "Central", 13.9300, 75.5680, 60),
    create_signal("SMG-002", "Kuvempu Road Signal", "Shimoga", "Kuvempu Road", 13.9320, 75.5710, 55),
    create_signal("SMG-003", "Durgigudi Signal", "Shimoga", "Durgigudi", 13.9280, 75.5650, 52),
    create_signal("SMG-004", "Nehru Road Signal", "Shimoga", "Nehru Road", 13.9340, 75.5730, 48),
    create_signal("SMG-005", "Station Road Signal (Shimoga)", "Shimoga", "Station", 13.9260, 75.5620, 55),
    create_signal("SMG-006", "Gopala Signal", "Shimoga", "Gopala", 13.9310, 75.5690, 45),
    
    # --- Udupi ---
    create_signal("UDP-001", "Manipal Junction", "Udupi", "Manipal", 13.3528, 74.7920, 58),
    create_signal("UDP-002", "Service Bus Stand Signal", "Udupi", "Service Stand", 13.3390, 74.7520, 55),
    create_signal("UDP-003", "Diana Circle", "Udupi", "Diana", 13.3410, 74.7550, 50),
    create_signal("UDP-004", "Ajjarkad Signal", "Udupi", "Ajjarkad", 13.3380, 74.7480, 48),
    create_signal("UDP-005", "Ambagilu Signal", "Udupi", "Ambagilu", 13.3460, 74.7600, 42),
    
    # --- Hassan ---
    create_signal("HSN-001", "Maharaja Park Circle", "Hassan", "Central", 13.0068, 76.0996, 55),
    create_signal("HSN-002", "BM Road Signal", "Hassan", "BM Road", 13.0090, 76.1020, 50),
    create_signal("HSN-003", "Bus Stand Signal", "Hassan", "Bus Stand", 13.0050, 76.0970, 48),
    create_signal("HSN-004", "Salagame Road Signal", "Hassan", "Salagame Road", 13.0100, 76.1050, 45),
    create_signal("HSN-005", "Shankar Mutt Circle", "Hassan", "Shankar Mutt", 13.0080, 76.0980, 42),
    
    # --- Mandya ---
    create_signal("MDA-001", "Ashoka Circle (Mandya)", "Mandya", "Central", 12.5218, 76.8953, 52),
    create_signal("MDA-002", "PB Road Signal (Mandya)", "Mandya", "PB Road", 12.5240, 76.8970, 48),
    create_signal("MDA-003", "Bus Stand Signal (Mandya)", "Mandya", "Bus Stand", 12.5200, 76.8930, 45),
    create_signal("MDA-004", "KRS Road Signal", "Mandya", "KRS Road", 12.5260, 76.8910, 42),
    
    # --- Raichur ---
    create_signal("RCR-001", "Station Road Circle (Raichur)", "Raichur", "Station Road", 16.2076, 77.3463, 55),
    create_signal("RCR-002", "Market Circle (Raichur)", "Raichur", "Market", 16.2050, 77.3440, 50),
    create_signal("RCR-003", "University Road (Raichur)", "Raichur", "University", 16.2100, 77.3500, 45),
    create_signal("RCR-004", "Bus Stand Signal (Raichur)", "Raichur", "Bus Stand", 16.2030, 77.3420, 48),
    
    # --- Bidar ---
    create_signal("BDR-001", "Ambedkar Circle (Bidar)", "Bidar", "Central", 17.9104, 77.5199, 52),
    create_signal("BDR-002", "Bus Stand Signal (Bidar)", "Bidar", "Bus Stand", 17.9120, 77.5220, 48),
    create_signal("BDR-003", "College Road Signal (Bidar)", "Bidar", "College Road", 17.9080, 77.5180, 45),
    create_signal("BDR-004", "Naubad Circle", "Bidar", "Naubad", 17.9060, 77.5160, 42),
    
    # --- Gadag-Betageri ---
    create_signal("GDG-001", "Station Road Signal (Gadag)", "Gadag", "Station Road", 15.4266, 75.6291, 50),
    create_signal("GDG-002", "Market Circle (Gadag)", "Gadag", "Market", 15.4280, 75.6310, 48),
    create_signal("GDG-003", "Betageri Main Signal", "Gadag", "Betageri", 15.4300, 75.6260, 45),
    
    # --- Haveri ---
    create_signal("HVR-001", "Main Circle (Haveri)", "Haveri", "Central", 14.7951, 75.4040, 48),
    create_signal("HVR-002", "Station Road Signal (Haveri)", "Haveri", "Station Road", 14.7970, 75.4060, 45),
    create_signal("HVR-003", "Ranebennur Road Signal", "Haveri", "Ranebennur Road", 14.7930, 75.4020, 42),
    
    # --- Chitradurga ---
    create_signal("CTD-001", "Fort Circle (Chitradurga)", "Chitradurga", "Fort", 14.2260, 76.3980, 48),
    create_signal("CTD-002", "Bus Stand Circle (Chitradurga)", "Chitradurga", "Bus Stand", 14.2280, 76.4010, 45),
    create_signal("CTD-003", "JCR Circle", "Chitradurga", "JCR", 14.2240, 76.3960, 42),
    
    # --- Bagalkot ---
    create_signal("BGK-001", "Navanagar Circle (Bagalkot)", "Bagalkot", "Navanagar", 16.1861, 75.6996, 48),
    create_signal("BGK-002", "Station Road Signal (Bagalkot)", "Bagalkot", "Station Road", 16.1880, 75.7020, 45),
    create_signal("BGK-003", "Vidyagiri Signal", "Bagalkot", "Vidyagiri", 16.1840, 75.6970, 42),
    
    # --- Hospet (Hosapete) ---
    create_signal("HSP-001", "Station Road Circle (Hospet)", "Hospet", "Station Road", 15.2689, 76.3910, 52),
    create_signal("HSP-002", "College Road Signal (Hospet)", "Hospet", "College Road", 15.2710, 76.3930, 48),
    create_signal("HSP-003", "Hampi Road Signal", "Hospet", "Hampi Road", 15.2730, 76.3960, 45),
    
    # --- Chikmagalur ---
    create_signal("CKM-001", "MG Road Signal (Chikmagalur)", "Chikmagalur", "MG Road", 13.3161, 75.7720, 48),
    create_signal("CKM-002", "Bus Stand Signal (Chikmagalur)", "Chikmagalur", "Bus Stand", 13.3180, 75.7740, 45),
    create_signal("CKM-003", "Kadur Road Signal", "Chikmagalur", "Kadur Road", 13.3200, 75.7760, 42),
    
    # --- Koppal ---
    create_signal("KPL-001", "Main Circle (Koppal)", "Koppal", "Central", 15.3497, 76.1528, 45),
    create_signal("KPL-002", "Gangavathi Road Signal", "Koppal", "Gangavathi Road", 15.3520, 76.1550, 42),
]


# =============================================================================
# COMBINED DATASET
# =============================================================================

ALL_KARNATAKA_SIGNALS: List[Signal] = (
    BANGALORE_SIGNALS + 
    BELAGAVI_SIGNALS + 
    MYSURU_SIGNALS + 
    HUBLI_DHARWAD_SIGNALS + 
    MANGALURU_SIGNALS + 
    OTHER_KARNATAKA_SIGNALS
)

# City-wise signal counts
SIGNAL_COUNTS = {
    "Bangalore": len(BANGALORE_SIGNALS),
    "Belagavi": len(BELAGAVI_SIGNALS),
    "Mysuru": len(MYSURU_SIGNALS),
    "Hubli-Dharwad": len(HUBLI_DHARWAD_SIGNALS),
    "Mangaluru": len(MANGALURU_SIGNALS),
    "Others": len(OTHER_KARNATAKA_SIGNALS),
    "Total": len(ALL_KARNATAKA_SIGNALS),
}

def get_signals_by_city(city: str) -> List[Signal]:
    """Get all traffic signals for a specific city."""
    return [s for s in ALL_KARNATAKA_SIGNALS if s["city"].lower() == city.lower()]

def get_signals_in_bbox(min_lat: float, min_lng: float, max_lat: float, max_lng: float) -> List[Signal]:
    """Get traffic signals within a bounding box."""
    return [
        s for s in ALL_KARNATAKA_SIGNALS
        if min_lat <= s["coords"][1] <= max_lat and min_lng <= s["coords"][0] <= max_lng
    ]

def get_signal_by_id(signal_id: str) -> Signal | None:
    """Get a specific signal by its ID."""
    for s in ALL_KARNATAKA_SIGNALS:
        if s["id"] == signal_id:
            return s
    return None
