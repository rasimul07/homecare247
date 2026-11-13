import {
  PrismaClient,
  Role,
  UserStatus,
  WorkerCategory,
  VerificationStatus,
  BookingStatus,
  ApplicationStatus,
  ShiftStatus,
  PaymentStatus,
  PaymentMethod,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding HomeCare247 Database according to West Bengal Home Healthcare Blueprint...');

  // 1. Password hashing
  const adminPassword = await bcrypt.hash('Admin@HomeCare2026', 10);
  const doctorPassword = await bcrypt.hash('Doctor@HomeCare2026', 10);
  const nursePassword = await bcrypt.hash('Nurse@HomeCare2026', 10);
  const caregiverPassword = await bcrypt.hash('Caregiver@HomeCare2026', 10);
  const customerPassword = await bcrypt.hash('Customer@HomeCare2026', 10);

  // 2. Admin Operations Lead
  const admin = await prisma.user.upsert({
    where: { email: 'admin@homecare247.com' },
    update: {},
    create: {
      email: 'admin@homecare247.com',
      password: adminPassword,
      name: 'Operations Director (Admin)',
      phone: '+91 98300 00247',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      city: 'kolkata',
    },
  });
  console.log('✅ Admin user ready: admin@homecare247.com');

  // 3. Customer User with Patient Profiles (PDF Page 5)
  const customer = await prisma.user.upsert({
    where: { email: 'customer@homecare247.com' },
    update: {},
    create: {
      email: 'customer@homecare247.com',
      password: customerPassword,
      name: 'Subir Banerjee',
      phone: '+91 98305 44321',
      role: Role.CUSTOMER,
      status: UserStatus.ACTIVE,
      city: 'kolkata',
      address: 'Holding 142, Kulpi Road, Baruipur, South 24 Parganas',
      pinCode: '700144',
    },
  });

  const patientMother = await prisma.patientProfile.create({
    data: {
      customerId: customer.id,
      fullName: 'Smt. Maya Banerjee',
      age: 74,
      gender: 'Female',
      relationship: 'Mother',
      primaryDiagnosis: 'Post-Stroke Left Hemiparesis, Type 2 Diabetes, Hypertension',
      medicalHistory: 'Ischemic stroke Oct 2026. On oral antiplatelet and antihypertensives. Normal kidney function.',
      hospitalDischargeSummary: 'Discharged from Peerless Hospital on 10 Nov 2026. Advised 12-hr skilled nursing for vitals monitoring, Foley catheterization, and assisted mobility.',
      mobilityStatus: 'Wheelchair / Bedridden',
      emergencyContactName: 'Subir Banerjee (Son)',
      emergencyContactPhone: '+91 98305 44321',
    },
  });

  const patientFather = await prisma.patientProfile.create({
    data: {
      customerId: customer.id,
      fullName: 'Sri Bimal Banerjee',
      age: 79,
      gender: 'Male',
      relationship: 'Father',
      primaryDiagnosis: 'Mild Cognitive Impairment / Early Dementia, Osteoarthritis both knees',
      medicalHistory: 'Requires gentle daytime companion attendant for assisted walking, sponge bath, and meal supervision.',
      mobilityStatus: 'Assisted walking with walker',
      emergencyContactName: 'Subir Banerjee (Son)',
      emergencyContactPhone: '+91 98305 44321',
    },
  });
  console.log('✅ Customer & Family Patient Profiles created: customer@homecare247.com');

  // 4. Doctor Accounts
  const doc1 = await prisma.user.upsert({
    where: { email: 'dr.arindam@homecare247.com' },
    update: {},
    create: {
      email: 'dr.arindam@homecare247.com',
      password: doctorPassword,
      name: 'Dr. Arindam Sen',
      phone: '+91 98301 44556',
      role: Role.DOCTOR,
      status: UserStatus.ACTIVE,
      city: 'kolkata',
      doctorProfile: {
        create: {
          specialization: 'Critical Care & Pulmonology',
          licenseNumber: 'WB-MED-49120',
          qualification: 'MBBS, MD (Chest & Critical Care), FCCP',
          experienceYears: 14,
          city: 'kolkata',
          availableDays: 'Mon-Sat (09:00 AM - 08:00 PM)',
          consultationFee: 1200,
          bio: 'Specialist in home ventilator management, tracheostomy care, COPD, and acute respiratory rehabilitation.',
        },
      },
    },
  });

  // 5. Registered Nurses (Clinical Scope - WBNC Registered)
  const nursePriya = await prisma.user.upsert({
    where: { email: 'priya.nurse@homecare247.com' },
    update: {},
    create: {
      email: 'priya.nurse@homecare247.com',
      password: nursePassword,
      name: 'Sister Priya Sharma',
      phone: '+91 98319 77881',
      role: Role.NURSE,
      status: UserStatus.ACTIVE,
      city: 'kolkata',
      nurseProfile: {
        create: {
          workerCategory: WorkerCategory.REGISTERED_NURSE,
          qualification: 'B.Sc Nursing, Critical Care Certified',
          experienceYears: 6,
          skills: 'ICU Care, Ventilator Management, Tracheostomy, Ryle Tube, Catheterization, IV Infusions, Cardiac Monitoring',
          permittedClinicalTasks: JSON.stringify([
            'Injections (IM / IV / SC)',
            'IV Cannulation & Infusion',
            'Foley Catheter Insertion & Bladder Wash',
            'Tracheostomy Suctioning & Inner Cannula Care',
            'Ryle Tube Insertion & Gastric Feeding',
            'Surgical Wound Dressing & Stoma Care',
            'Vital Signs & Blood Glucose Monitoring',
          ]),
          councilName: 'West Bengal Nursing Council (WBNC)',
          councilRegistrationNumber: 'WBNC-RN-55214',
          councilRegValidity: '2028-12-31',
          registrationStatus: VerificationStatus.VERIFIED,
          policeVerificationStatus: VerificationStatus.VERIFIED,
          idProofType: 'Aadhaar',
          idProofNumber: 'XXXX-XXXX-9124',
          idProofVerified: true,
          city: 'kolkata',
          serviceAreas: JSON.stringify(['Baruipur', 'Sonarpur', 'Garia', 'Narendrapur', 'Jadavpur', 'Salt Lake']),
          servicePinCodes: JSON.stringify(['700144', '700150', '700084', '700103', '700032', '700064']),
          languages: JSON.stringify(['Bengali', 'Hindi', 'English']),
          shiftPreference: '12d',
          availabilityStatus: 'AVAILABLE',
          rating: 4.95,
          completedShifts: 142,
          hourlyRate: 150,
        },
      },
    },
  });

  // 6. Caregivers / Ayas / Attendants (Non-Clinical Scope - PDF Page 3 & 4)
  const ayaAnanya = await prisma.user.upsert({
    where: { email: 'ananya.caregiver@homecare247.com' },
    update: {},
    create: {
      email: 'ananya.caregiver@homecare247.com',
      password: caregiverPassword,
      name: 'Sister Ananya Das',
      phone: '+91 98307 11223',
      role: Role.CAREGIVER,
      status: UserStatus.ACTIVE,
      city: 'kolkata',
      nurseProfile: {
        create: {
          workerCategory: WorkerCategory.AYA_CAREGIVER,
          qualification: 'Certified Geriatric Care Attendant (St. John Ambulance)',
          experienceYears: 4,
          skills: 'Assisted Bathing, Bed Mobility, Sponge Bath, Diaper Changing, Companionship, Oral Feeding',
          permittedClinicalTasks: JSON.stringify([
            'Non-Clinical: Bed Bath & Personal Hygiene',
            'Non-Clinical: Diaper Changing & Bedpan Assistance',
            'Non-Clinical: Assisted Walking & Transfer to Wheelchair',
            'Non-Clinical: Oral Feeding & Medication Reminder',
            'Non-Clinical: Pressure Ulcer Repositioning Q2H',
          ]),
          registrationStatus: VerificationStatus.VERIFIED,
          policeVerificationStatus: VerificationStatus.VERIFIED,
          idProofType: 'Voter ID',
          idProofNumber: 'WB/04/028/XXXXXX',
          idProofVerified: true,
          city: 'kolkata',
          serviceAreas: JSON.stringify(['Baruipur', 'Sonarpur', 'Garia', 'Narendrapur', 'Jadavpur']),
          servicePinCodes: JSON.stringify(['700144', '700150', '700084', '700103', '700032']),
          languages: JSON.stringify(['Bengali', 'Hindi']),
          shiftPreference: '12d',
          availabilityStatus: 'AVAILABLE',
          rating: 4.88,
          completedShifts: 86,
          hourlyRate: 100,
        },
      },
    },
  });
  console.log('✅ Registered Nurse & Non-Clinical Caregiver initialized with West Bengal scopes');

  // 7. City Hubs with Pilot Zones (Baruipur, Sonarpur, Garia, Jadavpur, Salt Lake) - PDF Page 13
  const cities = [
    {
      id: 'kolkata',
      name: 'Kolkata Central & South Suburban',
      state: 'West Bengal',
      phone: '+91 33 2456 7890',
      emergencyPhone: '+91 98300 12345',
      whatsappPhone: '919830012345',
      address: 'Plot 12, Salt Lake Sector V, Kolkata 700091 & Regional Dispatch at Garia Metro Hub',
      hubName: 'Kolkata Metro & South 24 Parganas Pilot Hub',
      availableStaffCount: 42,
      avgResponseMinutes: 25,
      popularAreas: JSON.stringify(['Baruipur', 'Sonarpur', 'Garia', 'Narendrapur', 'Jadavpur', 'Salt Lake', 'New Town', 'Ballygunge']),
      coveredPinCodes: JSON.stringify(['700144', '700150', '700084', '700103', '700032', '700064', '700091', '700019']),
    },
    {
      id: 'delhi',
      name: 'Delhi NCR',
      state: 'Delhi',
      phone: '+91 11 4321 0987',
      emergencyPhone: '+91 98111 23456',
      whatsappPhone: '919811123456',
      address: 'Tower B, Connaught Place, New Delhi 110001',
      hubName: 'NCR Metro Dispatch Hub',
      availableStaffCount: 65,
      avgResponseMinutes: 30,
      popularAreas: JSON.stringify(['South Delhi', 'Noida Sec 62', 'Gurugram Cyber City', 'Dwarka']),
      coveredPinCodes: JSON.stringify(['110001', '110048', '201301', '122002']),
    },
  ];

  for (const c of cities) {
    await prisma.cityHub.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }

  // 8. Service Items with Strict Clinical vs Non-Clinical Scopes (PDF Page 3 & 4)
  const services = [
    {
      id: 'skilled-nursing',
      titleKey: 'service_skilled_nursing_title',
      name: '24/7 Skilled Nursing Care',
      division: 'Nursing Services',
      category: 'nursing',
      isClinical: true,
      requiredQualification: 'GNM / B.Sc Nursing (State Nursing Council Registered)',
      startingPrice: 1500,
      pricePeriod: 'per 12-hr shift',
      badge: 'Clinical Care',
      iconName: 'HeartPulse',
      keyFeatures: JSON.stringify([
        'WBNC-registered qualified nurses',
        'IV cannulation, injections & infusion monitoring',
        'Foley catheter & Ryle tube procedures',
        'Sterile wound dressing & tracheostomy care',
        'Real-time vital signs charting',
      ]),
      clinicalProcedures: JSON.stringify([
        'Wound debridement dressing',
        'Catheter irrigation and change',
        'Injections and infusions',
        'Tracheostomy tube care and suctioning',
      ]),
      nonClinicalScope: JSON.stringify(['All clinical tasks including assistance in safe mobilization']),
      exclusions: JSON.stringify(['Independent physician diagnosis without consulting doctor']),
      popularFor: JSON.stringify(['Post-CABG surgery', 'Cancer chemotherapy recovery', 'Stroke paralysis', 'Bedridden palliative']),
      minimumDurationHours: 12,
    },
    {
      id: 'home-icu',
      titleKey: 'service_icu_setup_title',
      name: 'Home ICU Setup & Critical Care',
      division: 'Specialised Home Support',
      category: 'critical',
      isClinical: true,
      requiredQualification: 'B.Sc / M.Sc Nursing with Critical Care Training',
      startingPrice: 4500,
      pricePeriod: 'per day setup + nursing',
      badge: 'Hospital-Grade',
      iconName: 'Activity',
      keyFeatures: JSON.stringify([
        'ICU ventilator, BiPAP, CPAP & 5-para monitor',
        'Syringe & infusion pumps',
        'Portable suction machine & crash kit',
        'Supervising Intensivist Doctor on call',
        '24-hr dedicated critical care nurse rotation',
      ]),
      clinicalProcedures: JSON.stringify(['Ventilator weaning', 'Arterial blood gas sampling', 'Emergency resuscitation']),
      exclusions: JSON.stringify(['Non-emergency substitute for critical hospital ICU when ECMO needed']),
      popularFor: JSON.stringify(['Prolonged ventilator weaning', 'Severe COPD', 'Comatose patient care']),
      minimumDurationHours: 24,
    },
    {
      id: 'patient-care-attendant',
      titleKey: 'service_patient_care_title',
      name: 'Patient Care & Bedside Attendant',
      division: 'Patient Care Services',
      category: 'patient-care',
      isClinical: false,
      requiredQualification: 'Certified Caregiver / Patient Attendant',
      startingPrice: 850,
      pricePeriod: 'per 12-hr shift',
      badge: 'Personal Assistance',
      iconName: 'Users',
      keyFeatures: JSON.stringify([
        'Daily assistance in sponge bath & grooming',
        'Assisted mobility, wheelchair transfer & walking',
        'Diaper changing, bedpan & catheter bag emptying',
        'Feeding assistance & medication reminders',
        '2-hour bed repositioning to prevent bed sores',
      ]),
      nonClinicalScope: JSON.stringify([
        'Bed bath and oral hygiene',
        'Assisted walking and transfer',
        'Meal assistance and medication reminder',
      ]),
      exclusions: JSON.stringify([
        'NO injections, NO IV infusion, NO catheter insertion, NO prescription changes',
      ]),
      popularFor: JSON.stringify(['Post-discharge recovery', 'Mobility restricted patients', 'Orthopedic fractures']),
      minimumDurationHours: 8,
    },
    {
      id: 'elderly-care-aya',
      titleKey: 'service_elderly_care_title',
      name: 'Elderly Care & Aya Support',
      division: 'Elderly Care Services',
      category: 'elderly',
      isClinical: false,
      requiredQualification: 'Trained Aya / Elderly Caregiver',
      startingPrice: 800,
      pricePeriod: 'per 12-hr shift',
      badge: 'Gentle Companionship',
      iconName: 'HeartHandshake',
      keyFeatures: JSON.stringify([
        'Gentle companionship and mental stimulation',
        'Dementia & Alzheimer supportive routine',
        'Assistance in dressing, hygiene & meals',
        'Fall prevention and safe house mobility',
        'Regular family daily progress communication',
      ]),
      nonClinicalScope: JSON.stringify(['Companionship, hygiene, feeding, walking']),
      exclusions: JSON.stringify(['Clinical interventions of any kind']),
      popularFor: JSON.stringify(['Senior citizens living alone', 'Dementia & Alzheimer', 'General age-related frailty']),
      minimumDurationHours: 8,
    },
  ];

  for (const s of services) {
    await prisma.serviceItem.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }

  // 9. Sample Booking for Baruipur Patient (Subir Banerjee for Maya Banerjee)
  const booking1 = await prisma.booking.upsert({
    where: { bookingNumber: 'HC-2026-WB-1001' },
    update: {},
    create: {
      bookingNumber: 'HC-2026-WB-1001',
      customerId: customer.id,
      patientProfileId: patientMother.id,
      patientName: 'Smt. Maya Banerjee',
      patientAge: 74,
      patientGender: 'Female',
      contactName: 'Subir Banerjee (Son)',
      phone: '+91 98305 44321',
      email: 'subir.banerjee@gmail.com',
      cityId: 'kolkata',
      cityName: 'Kolkata',
      area: 'Baruipur',
      pinCode: '700144',
      address: 'Holding 142, Kulpi Road, Ward 8, Baruipur, South 24 Parganas',
      landmark: 'Near Baruipur Super Speciality Hospital',
      serviceId: 'skilled-nursing',
      serviceName: '24/7 Skilled Nursing Care',
      isClinical: true,
      shiftDuration: '12d',
      patientCondition: 'Post-stroke hemiparesis recovery, needs vitals monitoring, catheter care, and wound care.',
      hospitalDischargeInfo: 'Discharged from Peerless Hospital on 10 Nov 2026.',
      startDate: '2026-11-14',
      preferredStartTime: '08:00 AM',
      status: BookingStatus.CONFIRMED,
      assignedNurseId: nursePriya.id,
      assignedDoctorId: doc1.id,
      totalAmount: 1572, // 1500 base + 72 (18% GST on 400 agency margin)
      workerPayoutRate: 1100,
      agencyMargin: 400,
      consentAcknowledged: true,
      notes: 'Family requested experienced female nurse with Bengali fluency. Assigned Sister Priya Sharma.',
    },
  });

  // 10. Sample Invoice with Unit Economics (PDF Page 8)
  await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-WB-2026-0042',
      bookingId: booking1.id,
      customerId: customer.id,
      baseAmount: 1500,
      workerPayout: 1100,
      agencyGrossMargin: 400,
      gstRate: 18.0,
      cgstAmount: 36, // 9% CGST on 400
      sgstAmount: 36, // 9% SGST on 400
      totalAmount: 1572,
      paymentMethod: PaymentMethod.UPI,
      paymentStatus: PaymentStatus.PAID,
      paymentReference: 'UPI-REF-9812448102',
      sacCode: '9993',
      paidAt: new Date(),
    },
  });

  // 11. Sample Shift in Progress
  const shiftToday = await prisma.shift.create({
    data: {
      bookingId: booking1.id,
      staffId: nursePriya.id,
      shiftDate: '2026-11-13',
      shiftType: 'DAY_12H',
      startTime: '08:00 AM',
      endTime: '08:00 PM',
      status: ShiftStatus.CHECKED_IN,
      enRouteTime: new Date('2026-11-13T07:35:00Z'),
      checkInTime: new Date('2026-11-13T07:55:00Z'),
      notes: 'Reached patient home in Baruipur on time. Patient resting, vitals stable. Sternal dressing checked.',
      patientVitalsSummary: 'BP: 124/82, Pulse: 78 bpm, SpO2: 98% room air',
    },
  });

  // 12. Clinical Vitals Record
  await prisma.clinicalRecord.create({
    data: {
      bookingId: booking1.id,
      recordedById: nursePriya.id,
      recordedByName: nursePriya.name,
      recordedByRole: Role.NURSE,
      bloodPressure: '124/82',
      heartRate: 78,
      spO2: 98.0,
      temperature: 98.4,
      respiratoryRate: 18,
      bloodSugar: '112 mg/dL (Fasting)',
      clinicalNotes: 'Catheter drainage clear, 450ml in bag. Left arm gentle passive mobilization completed. Morning oral medications administered with water.',
      medicationAdministered: 'Tab Telmisartan 40mg, Tab Clopidogrel 75mg, Tab Pantoprazole 40mg',
    },
  });

  // 13. Audit Log Entries (PDF Page 6)
  await prisma.auditLog.createMany({
    data: [
      {
        bookingId: booking1.id,
        actorId: customer.id,
        actorName: 'Subir Banerjee',
        actorRole: Role.CUSTOMER,
        action: 'BOOKING_REQUEST_RECEIVED',
        details: 'Patient: Smt. Maya Banerjee, Service: 24/7 Skilled Nursing Care, Location: Baruipur (PIN 700144)',
      },
      {
        bookingId: booking1.id,
        actorId: admin.id,
        actorName: 'Operations Director',
        actorRole: Role.ADMIN,
        action: 'AUTO_STAFF_MATCH_REVIEWED',
        details: 'Matched Sister Priya Sharma (WBNC-RN-55214, 95% Match Score). Sent job offer.',
      },
      {
        bookingId: booking1.id,
        actorId: nursePriya.id,
        actorName: 'Sister Priya Sharma',
        actorRole: Role.NURSE,
        action: 'WORKER_ACCEPTED_JOB_OFFER',
        details: 'Worker accepted 12-hour shift in Baruipur on 14-Nov-2026.',
      },
      {
        bookingId: booking1.id,
        actorId: nursePriya.id,
        actorName: 'Sister Priya Sharma',
        actorRole: Role.NURSE,
        action: 'STAFF_EN_ROUTE',
        details: 'Worker departed for Baruipur address at 07:35 AM.',
      },
      {
        bookingId: booking1.id,
        actorId: nursePriya.id,
        actorName: 'Sister Priya Sharma',
        actorRole: Role.NURSE,
        action: 'SERVICE_STARTED_CHECK_IN',
        details: 'Arrived at patient residence and commenced duty at 07:55 AM.',
      },
    ],
  });

  // 14. Sample Candidate Applications for Hiring Pipeline (PDF Page 6)
  const applications = [
    {
      applicationNumber: 'APP-WB-2026-8812',
      fullName: 'Sushmita Mukherjee',
      email: 'sushmita.mukherjee.rn@gmail.com',
      phone: '+91 98311 55443',
      roleApplied: 'Critical Care ICU Nurse',
      workerCategory: WorkerCategory.REGISTERED_NURSE,
      qualification: 'B.Sc Nursing (West Bengal Nursing Council Registered)',
      experienceYears: 5,
      currentCity: 'Kolkata',
      preferredCity: 'Kolkata',
      preferredAreas: 'Baruipur, Garia, Jadavpur',
      availableImmediate: true,
      resumeUrl: '/uploads/resumes/sample-resume-sushmita.pdf',
      resumeFileName: 'Sushmita_Mukherjee_CV_ICU_Nurse.pdf',
      resumeFileSize: 412500,
      skills: 'Ventilator management, Tracheostomy care, ABG interpretation, Central line care',
      councilRegNumber: 'WBNC-RN-78219',
      expectedSalary: '₹35,000 / month',
      notes: 'Worked 3 years at Medica Superspecialty ICU, 2 years home ICU. Immediate joiner.',
      status: ApplicationStatus.NEW,
    },
    {
      applicationNumber: 'APP-WB-2026-8813',
      fullName: 'Rupa Banerjee',
      email: 'rupa.banerjee94@gmail.com',
      phone: '+91 98304 22331',
      roleApplied: 'Elderly Care Attendant / Aya',
      workerCategory: WorkerCategory.AYA_CAREGIVER,
      qualification: 'Certified Geriatric Attendant Diploma',
      experienceYears: 4,
      currentCity: 'Kolkata',
      preferredCity: 'Kolkata',
      preferredAreas: 'Sonarpur, Baruipur, Garia',
      availableImmediate: true,
      resumeUrl: '/uploads/resumes/sample-resume-rupa.pdf',
      resumeFileName: 'Rupa_Banerjee_Nursing_CV.pdf',
      resumeFileSize: 298000,
      skills: 'Bed sore prevention & dressing, Ryle tube feeding assistance, Diabetic patient care, Dementia routine',
      expectedSalary: '₹24,000 / month',
      notes: 'Strong references from local South Kolkata families. Shortlisted for interview.',
      status: ApplicationStatus.SHORTLISTED,
      reviewNotes: 'Verified address and previous family references. Shortlisted for round 1.',
      reviewedBy: 'Operations Director (Admin)',
    },
  ];

  for (const app of applications) {
    await prisma.jobApplication.upsert({
      where: { applicationNumber: app.applicationNumber },
      update: {},
      create: app,
    });
  }

  // 15. Sample Incident / Complaint Register Entry (PDF Page 6 & 7)
  await prisma.incidentReport.create({
    data: {
      incidentNumber: 'INC-2026-101',
      bookingId: booking1.id,
      reporterId: customer.id,
      reporterRole: Role.CUSTOMER,
      incidentType: IncidentType.GENERAL_COMPLAINT,
      severity: IncidentSeverity.LOW,
      description: 'Initial confirmation SMS was delayed by 15 minutes due to network gateway glitch.',
      status: IncidentStatus.RESOLVED,
      investigationNotes: 'Checked telecom SMS gateway logs; gateway experienced temporary jitter. Fallback WhatsApp notification confirmed delivered.',
      resolutionNotes: 'Family member Subir Banerjee contacted and verified. Issue resolved.',
      resolvedAt: new Date(),
    },
  });

  console.log(`
🎉 Database Seed Completed Successfully according to West Bengal Home Healthcare Blueprint!

-----------------------------------------------------------------------------------
Default Login Credentials for All Portals:
-----------------------------------------------------------------------------------
👑 Admin Operations Portal:
   Email:    admin@homecare247.com
   Password: Admin@HomeCare2026

👨‍👩‍👧 Customer / Family Portal:
   Email:    customer@homecare247.com
   Password: Customer@HomeCare2026

👨‍⚕️ Doctor Clinical Portal:
   Email:    dr.arindam@homecare247.com
   Password: Doctor@HomeCare2026

👩‍⚕️ Registered Nurse Portal:
   Email:    priya.nurse@homecare247.com
   Password: Nurse@HomeCare2026

👩‍⚕️ Non-Clinical Aya / Caregiver Portal:
   Email:    ananya.caregiver@homecare247.com
   Password: Caregiver@HomeCare2026
-----------------------------------------------------------------------------------
`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
