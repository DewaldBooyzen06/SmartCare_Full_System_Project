import os
import re
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import database

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "smartcare-secret-key-2026-prod")

# Initialize database on startup
database.init_db()

@app.before_request
def check_authentication():
    allowed_routes = ['login', 'static']
    if request.endpoint and request.endpoint not in allowed_routes and 'user_id' not in session:
        return redirect(url_for('login'))

@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()

        conn = database.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Users WHERE Username = ?", (username,))
        user = cursor.fetchone()
        conn.close()

        # Check credentials (supports raw check for seeded lab accounts)
        valid = False
        if user:
            # In testing lab: admin / admin123, reception / reception123, dr_thorne / doctor123
            if (username == 'admin' and password == 'admin123') or \
               (username == 'reception' and password == 'reception123') or \
               (username == 'dr_thorne' and password == 'doctor123'):
                valid = True
            elif check_password_hash(user['PasswordHash'], password):
                valid = True

        if valid:
            session['user_id'] = user['UserID']
            session['username'] = user['Username']
            session['role'] = user['Role']
            session['full_name'] = user['FullName']
            flash(f"Welcome back, {user['FullName']}!", "success")
            return redirect(url_for('dashboard'))
        else:
            flash("Authentication Failed: Invalid username or password.", "danger")

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash("You have securely signed out of SmartCare Clinical Suite.", "info")
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    today = datetime.now().strftime('%Y-%m-%d')
    conn = database.get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM Patients")
    total_patients = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Doctors")
    total_doctors = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Appointments")
    total_appointments = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM Appointments WHERE AppointmentDate >= ? AND AppointmentStatus = 'Booked'", (today,))
    upcoming_appointments = cursor.fetchone()[0]

    # Upcoming list with patient and doctor details
    cursor.execute("""
    SELECT a.*, p.FirstName, p.LastName, p.ContactNumber, d.FullName AS DoctorName, d.Specialisation, d.RoomNumber
    FROM Appointments a
    JOIN Patients p ON a.PatientNumber = p.PatientNumber
    JOIN Doctors d ON a.DoctorID = d.DoctorID
    ORDER BY a.AppointmentDate ASC, a.AppointmentTime ASC
    """)
    appointments = cursor.fetchall()
    conn.close()

    return render_template('dashboard.html',
                           total_patients=total_patients,
                           total_doctors=total_doctors,
                           total_appointments=total_appointments,
                           upcoming_appointments=upcoming_appointments,
                           appointments=appointments,
                           today=today)

@app.route('/register_patient', methods=['GET', 'POST'])
@app.route('/patients/register', methods=['GET', 'POST'])
def register_patient():
    if request.method == 'POST':
        patient_number = request.form.get('patient_number', '').strip()
        first_name = request.form.get('first_name', '').strip()
        last_name = request.form.get('last_name', '').strip()
        id_number = request.form.get('id_number', '').strip()
        dob = request.form.get('dob', '').strip()
        gender = request.form.get('gender', '').strip()
        contact = request.form.get('contact', '').strip()
        email = request.form.get('email', '').strip()
        address = request.form.get('address', '').strip()
        med_provider = request.form.get('med_provider', '').strip()
        med_number = request.form.get('med_number', '').strip()
        emergency = request.form.get('emergency', '').strip()
        blood_type = request.form.get('blood_type', '').strip()
        allergies = request.form.get('allergies', '').strip()
        chronic = request.form.get('chronic', '').strip()
        reg_date = datetime.now().strftime('%Y-%m-%d')

        # Mandatory validations
        if not re.match(r'^\d{8}$', patient_number):
            flash("Patient Number must be exactly 8 numerical digits.", "danger")
            return redirect(url_for('register_patient'))

        if not re.match(r'^\d{13}$', id_number):
            flash("South African ID Number must be exactly 13 digits.", "danger")
            return redirect(url_for('register_patient'))

        conn = database.get_connection()
        cursor = conn.cursor()

        # Check duplicates
        cursor.execute("SELECT 1 FROM Patients WHERE PatientNumber = ?", (patient_number,))
        if cursor.fetchone():
            conn.close()
            flash(f"Patient Number {patient_number} is already registered.", "danger")
            return redirect(url_for('register_patient'))

        cursor.execute("SELECT 1 FROM Patients WHERE IDNumber = ?", (id_number,))
        if cursor.fetchone():
            conn.close()
            flash(f"Patient with ID Number {id_number} already exists.", "danger")
            return redirect(url_for('register_patient'))

        cursor.execute("""
        INSERT INTO Patients (
            PatientNumber, FirstName, LastName, IDNumber, DateOfBirth, Gender,
            ContactNumber, Email, ResidentialAddress, MedicalAidProvider, MedicalAidNumber,
            EmergencyContact, RegistrationDate, BloodType, Allergies, ChronicConditions
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (patient_number, first_name, last_name, id_number, dob, gender,
              contact, email, address, med_provider, med_number, emergency,
              reg_date, blood_type, allergies, chronic))

        conn.commit()
        conn.close()

        flash(f"Patient {first_name} {last_name} (#{patient_number}) registered successfully!", "success")
        return redirect(url_for('dashboard'))

    return render_template('register_patient.html')

@app.route('/book_appointment', methods=['GET', 'POST'])
@app.route('/appointments/book', methods=['GET', 'POST'])
def book_appointment():
    conn = database.get_connection()
    cursor = conn.cursor()

    if request.method == 'POST':
        patient_number = request.form.get('patient_number', '').strip()
        doctor_id = request.form.get('doctor_id', '').strip()
        appt_date = request.form.get('appointment_date', '').strip()
        appt_time = request.form.get('appointment_time', '').strip()
        notes = request.form.get('notes', '').strip()

        if not doctor_id or not patient_number or not appt_date or not appt_time:
            flash("All appointment scheduling fields are mandatory.", "danger")
            return redirect(url_for('book_appointment'))

        # DOUBLE-BOOKING PREVENTION
        cursor.execute("""
        SELECT 1 FROM Appointments 
        WHERE DoctorID = ? AND AppointmentDate = ? AND AppointmentTime = ? AND AppointmentStatus != 'Cancelled'
        """, (doctor_id, appt_date, appt_time))
        conflict = cursor.fetchone()

        if conflict:
            cursor.execute("SELECT FullName FROM Doctors WHERE DoctorID = ?", (doctor_id,))
            doc_name = cursor.fetchone()[0]
            conn.close()
            flash(f"DOUBLE-BOOKING ERROR: {doc_name} is already booked on {appt_date} at {appt_time}. Please select an alternate slot.", "danger")
            return redirect(url_for('book_appointment'))

        cursor.execute("""
        INSERT INTO Appointments (AppointmentDate, AppointmentTime, DoctorID, PatientNumber, AppointmentStatus, Notes)
        VALUES (?, ?, ?, ?, 'Booked', ?)
        """, (appt_date, appt_time, doctor_id, patient_number, notes))

        conn.commit()
        conn.close()

        flash("Appointment booked successfully with zero collisions!", "success")
        return redirect(url_for('dashboard'))

    cursor.execute("SELECT PatientNumber, FirstName, LastName FROM Patients ORDER BY LastName ASC")
    patients = cursor.fetchall()

    cursor.execute("SELECT DoctorID, FullName, Specialisation, RoomNumber, Status FROM Doctors ORDER BY FullName ASC")
    doctors = cursor.fetchall()
    conn.close()

    today = datetime.now().strftime('%Y-%m-%d')
    return render_template('book_appointment.html', patients=patients, doctors=doctors, today=today)

@app.route('/api/check_conflict')
def api_check_conflict():
    doctor_id = request.args.get('doctor_id')
    date = request.args.get('date')
    time = request.args.get('time')

    if not (doctor_id and date and time):
        return jsonify({'conflict': False})

    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT a.AppointmentNumber, p.FirstName, p.LastName 
    FROM Appointments a
    JOIN Patients p ON a.PatientNumber = p.PatientNumber
    WHERE a.DoctorID = ? AND a.AppointmentDate = ? AND a.AppointmentTime = ? AND a.AppointmentStatus != 'Cancelled'
    """, (doctor_id, date, time))
    conflict = cursor.fetchone()
    conn.close()

    if conflict:
        return jsonify({
            'conflict': True,
            'message': f"Conflicting appointment #{conflict[0]} with patient {conflict[1]} {conflict[2]}"
        })
    return jsonify({'conflict': False})

if __name__ == '__main__':
    port = int(os.getenv('PORT', 3000))
    app.run(host='0.0.0.0', port=port, debug=True)
