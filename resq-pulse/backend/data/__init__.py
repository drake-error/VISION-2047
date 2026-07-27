# Backend data package
from data.karnataka_signals import (
    ALL_KARNATAKA_SIGNALS, 
    BANGALORE_SIGNALS, 
    BELAGAVI_SIGNALS,
    get_signals_by_city, 
    get_signals_in_bbox, 
    get_signal_by_id,
    SIGNAL_COUNTS
)
from data.hospitals import (
    ALL_KARNATAKA_HOSPITALS,
    BANGALORE_HOSPITALS,
    BELAGAVI_HOSPITALS,
    get_hospitals_by_city,
    get_emergency_hospitals,
    get_hospital_by_id
)
from data.fallback_routes import (
    ALL_FALLBACK_ROUTES,
    get_fallback_routes_for_city,
    get_fallback_route_by_id,
    get_nearest_fallback_route
)
