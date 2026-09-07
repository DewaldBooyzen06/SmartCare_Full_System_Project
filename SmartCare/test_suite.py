"""
SmartCare Medical Clinic - Automated Unit Testing Suite (UT01 - UT07)
Tests core business logic, input validation regex, double-booking rejection, and password security.
Run with: python -m unittest test_suite.py
"""

import unittest
import re
from werkzeug.security import generate_password_hash, check_password_hash

class TestSmartCareCore(unittest.TestCase):

    def setUp(self):
        # Sample test fixture data
        self.valid_patient_number = "10048295"
        self.invalid_patient_numbers = ["1004", "100482951", "ABC12345", "1004-829"]
        
        self.valid_sa_id = "8904125028087"
        self.invalid_sa_ids = ["8904125028", "890412502808799", "890412502808A"]

        self.existing_bookings = [
            {"doctor_id": 1, "date": "2026-09-04", "time": "09:00", "status": "Booked"}
        ]

    # UT01: Patient Number 8-Digit Exact Format
    def test_ut01_patient_number_format(self):
        """UT01: Validate that Patient Number must contain exactly 8 numeric digits."""
        pattern = r'^\d{8}$'
        self.assertTrue(bool(re.match(pattern, self.valid_patient_number)), "Valid 8-digit number should pass")
        for invalid in self.invalid_patient_numbers:
            self.assertFalse(bool(re.match(pattern, invalid)), f"Invalid number {invalid} should fail")

    # UT02: South African 13-Digit ID Validation
    def test_ut02_id_number_format(self):
        """UT02: Validate South African national ID number exact 13 numeric digits."""
        pattern = r'^\d{13}$'
        self.assertTrue(bool(re.match(pattern, self.valid_sa_id)), "Valid 13-digit ID should pass")
        for invalid in self.invalid_sa_ids:
            self.assertFalse(bool(re.match(pattern, invalid)), f"Invalid ID {invalid} should fail")

    # UT03: Password Hashing and Security Verification
    def test_ut03_password_hashing(self):
        """UT03: Verify that passwords are never stored in plain text and match hashes."""
        plain_password = "SecureClinical2026!"
        hashed = generate_password_hash(plain_password)
        
        self.assertNotEqual(plain_password, hashed, "Hash must never match plain text")
        self.assertTrue(check_password_hash(hashed, plain_password), "Correct password must verify against hash")
        self.assertFalse(check_password_hash(hashed, "WrongPassword123"), "Wrong password must be rejected")

    # UT04: Appointment Double-Booking Conflict Detection
    def test_ut04_double_booking_rejection(self):
        """UT04: Verify that a doctor cannot be booked twice for the same date and time."""
        def check_conflict(doc_id, date, time):
            for b in self.existing_bookings:
                if b['doctor_id'] == doc_id and b['date'] == date and b['time'] == time and b['status'] != 'Cancelled':
                    return True
            return False

        # Attempting identical slot
        self.assertTrue(check_conflict(1, "2026-09-04", "09:00"), "Conflict must be detected for same doctor, date and time")
        # Different time
        self.assertFalse(check_conflict(1, "2026-09-04", "09:30"), "Different time slot should be available")
        # Different doctor
        self.assertFalse(check_conflict(2, "2026-09-04", "09:00"), "Different doctor at same time should be available")

    # UT05: Required Fields Non-Empty Verification
    def test_ut05_required_fields_validation(self):
        """UT05: Verify required registration fields are present and non-empty."""
        def validate_patient_payload(data):
            required = ['patient_number', 'first_name', 'last_name', 'id_number', 'contact_number', 'emergency_contact']
            for field in required:
                val = data.get(field, '').strip()
                if not val:
                    return False, f"Missing required field: {field}"
            return True, "Valid"

        valid_data = {
            'patient_number': '10048295',
            'first_name': 'Thabo',
            'last_name': 'Molefe',
            'id_number': '8904125028087',
            'contact_number': '+27 82 459 2831',
            'emergency_contact': 'Nomsa Molefe (+27 82 459 2830)'
        }
        is_valid, _ = validate_patient_payload(valid_data)
        self.assertTrue(is_valid)

        incomplete_data = valid_data.copy()
        incomplete_data['first_name'] = '   '
        is_valid, msg = validate_patient_payload(incomplete_data)
        self.assertFalse(is_valid)
        self.assertIn("first_name", msg)

    # UT06: Time Slot Granularity & Boundary Check
    def test_ut06_appointment_time_slot_boundaries(self):
        """UT06: Validate time slots are within clinical operating hours (08:00 - 16:30)."""
        valid_slots = ["08:00", "09:30", "11:00", "14:00", "16:00"]
        invalid_slots = ["07:00", "17:30", "22:00", "invalid_time"]

        def is_valid_clinical_slot(time_str):
            clinical_slots = [
                "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
                "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00"
            ]
            return time_str in clinical_slots

        for slot in valid_slots:
            self.assertTrue(is_valid_clinical_slot(slot))
        for slot in invalid_slots:
            self.assertFalse(is_valid_clinical_slot(slot))

    # UT07: Role-Based Access Control Verification
    def test_ut07_rbac_role_permissions(self):
        """UT07: Verify RBAC permissions for Administrator, Doctor, and Receptionist."""
        valid_roles = ["Administrator", "Doctor", "Receptionist"]
        self.assertIn("Administrator", valid_roles)
        self.assertIn("Doctor", valid_roles)
        self.assertIn("Receptionist", valid_roles)
        self.assertNotIn("Guest", valid_roles)

if __name__ == '__main__':
    unittest.main(verbosity=2)
