import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonToast,
  IonBadge,
} from '@ionic/react';
import { personAddOutline, personOutline, callOutline, closeOutline, medkitOutline } from 'ionicons/icons';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { HeaderBar } from '../../components/HeaderBar';
import { PatientProfile } from '../../types';

export const CustomerPatients: React.FC = () => {
  const { user, selectedCity } = useAuth();
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New patient state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | undefined>();
  const [gender, setGender] = useState('FEMALE');
  const [relationship, setRelationship] = useState('MOTHER');
  const [diagnosis, setDiagnosis] = useState('');
  const [mobility, setMobility] = useState('BEDRIDDEN');
  const [address, setAddress] = useState(user?.address || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPatients = async () => {
    try {
      if (user) {
        const list = await api.getCustomerPatients();
        setPatients(list || []);
      }
    } catch (e) {
      console.warn('Failed to fetch patients', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const handleRefresh = async (e: CustomEvent) => {
    await fetchPatients();
    e.detail.complete();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setToastMsg('Please enter patient name');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createPatientProfile({
        name,
        age: age ? Number(age) : 65,
        gender,
        relationshipToCustomer: relationship,
        diagnosis: diagnosis || 'General elderly care',
        mobilityStatus: mobility,
        city: selectedCity.name,
        address: address || selectedCity.name,
        emergencyContactName: user?.name || 'Primary Contact',
        emergencyContactPhone: emergencyPhone || user?.phone || '9830024701',
      });

      setToastMsg('Family patient profile created!');
      setModalOpen(false);
      resetForm();
      await fetchPatients();
    } catch (err: any) {
      setToastMsg(err.message || 'Failed to save patient profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setAge(undefined);
    setDiagnosis('');
  };

  return (
    <IonPage>
      <HeaderBar title="Family Patient Profiles" />

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172b', margin: 0 }}>
              Registered Family Members
            </h2>
            <p style={{ fontSize: '12px', color: '#62748e', margin: '2px 0 0' }}>
              Saved clinical medical profiles for faster caregiver bookings.
            </p>
          </div>

          <IonButton
            size="small"
            color="primary"
            onClick={() => setModalOpen(true)}
            style={{ fontWeight: 800, fontSize: '12px', '--border-radius': '10px' }}
          >
            <IonIcon icon={personAddOutline} slot="start" />
            Add Patient
          </IonButton>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <IonSpinner name="crescent" color="primary" />
          </div>
        ) : patients.length === 0 ? (
          <IonCard style={{ margin: 0, textAlign: 'center', padding: '36px 16px', borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonIcon icon={personOutline} color="medium" style={{ fontSize: '48px', margin: '0 auto 12px' }} />
            <h3 style={{ fontWeight: 800, color: '#0f172b', margin: '0 0 6px' }}>No Patient Profiles Added</h3>
            <p style={{ fontSize: '12px', color: '#62748e', margin: '0 0 16px' }}>
              Add details of your parents, spouse, or senior relatives for customized clinical care.
            </p>
            <IonButton color="primary" onClick={() => setModalOpen(true)} style={{ fontWeight: 800 }}>
              Add Patient Profile Now
            </IonButton>
          </IonCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '30px' }}>
            {patients.map((p) => (
              <IonCard
                key={p.id}
                style={{
                  margin: 0,
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  boxShadow: '0 4px 16px rgba(15, 23, 43, 0.04)',
                }}
              >
                <IonCardHeader style={{ padding: '16px 16px 8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '14px',
                          background: '#eff6ff',
                          color: '#155dfc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                        }}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <IonCardTitle style={{ fontSize: '16px', fontWeight: 900, color: '#0f172b' }}>
                          {p.name}
                        </IonCardTitle>
                        <span style={{ fontSize: '11px', color: '#62748e', fontWeight: 600 }}>
                          {p.age} yrs • {p.gender} • {p.relationshipToCustomer}
                        </span>
                      </div>
                    </div>

                    <IonBadge color="primary" style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '6px' }}>
                      {p.mobilityStatus || 'ASSISTED'}
                    </IonBadge>
                  </div>
                </IonCardHeader>

                <IonCardContent style={{ padding: '0 16px 16px' }}>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', fontSize: '12px', marginBottom: '8px' }}>
                    <div style={{ color: '#0f172b', fontWeight: 700, marginBottom: '2px' }}>
                      🩺 Diagnosis & Care Needs:
                    </div>
                    <div style={{ color: '#475569' }}>{p.diagnosis || 'General senior assistance'}</div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#62748e' }}>
                    📍 Address: {p.address}, {p.city}
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </div>
        )}

        {/* Add Patient Modal */}
        <IonModal isOpen={modalOpen} onDidDismiss={() => setModalOpen(false)}>
          <IonHeader>
            <IonToolbar color="primary">
              <IonTitle style={{ fontWeight: 900 }}>New Family Patient Profile</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setModalOpen(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="ion-padding">
            <form onSubmit={handleCreate}>
              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  PATIENT FULL NAME *
                </IonLabel>
                <IonInput
                  required
                  placeholder="e.g. Biren Sen"
                  value={name}
                  onIonInput={(e) => setName(e.detail.value || '')}
                />
              </IonItem>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    AGE
                  </IonLabel>
                  <IonInput
                    type="number"
                    placeholder="75"
                    value={age}
                    onIonInput={(e) => setAge(Number(e.detail.value))}
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px' }}>
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    RELATIONSHIP
                  </IonLabel>
                  <IonSelect value={relationship} onIonChange={(e) => setRelationship(e.detail.value)}>
                    <IonSelectOption value="FATHER">Father</IonSelectOption>
                    <IonSelectOption value="MOTHER">Mother</IonSelectOption>
                    <IonSelectOption value="SPOUSE">Spouse</IonSelectOption>
                    <IonSelectOption value="SELF">Self</IonSelectOption>
                    <IonSelectOption value="OTHER">Other</IonSelectOption>
                  </IonSelect>
                </IonItem>
              </div>

              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  MOBILITY STATUS
                </IonLabel>
                <IonSelect value={mobility} onIonChange={(e) => setMobility(e.detail.value)}>
                  <IonSelectOption value="WALKING">Walking Independently</IonSelectOption>
                  <IonSelectOption value="ASSISTED">Walks with Walker / Support</IonSelectOption>
                  <IonSelectOption value="BEDRIDDEN">Bedridden / Wheelchair</IonSelectOption>
                  <IonSelectOption value="CRITICAL">Critical Care / ICU</IonSelectOption>
                </IonSelect>
              </IonItem>

              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '10px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  DIAGNOSIS / SURGERY / CHRONIC ILLNESS
                </IonLabel>
                <IonInput
                  placeholder="e.g. Parkinson's disease, post-stroke, diabetes"
                  value={diagnosis}
                  onIonInput={(e) => setDiagnosis(e.detail.value || '')}
                />
              </IonItem>

              <IonItem lines="inset" style={{ '--background': '#ffffff', borderRadius: '12px', marginBottom: '16px' }}>
                <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                  EMERGENCY CONTACT PHONE
                </IonLabel>
                <IonInput
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={emergencyPhone}
                  onIonInput={(e) => setEmergencyPhone(e.detail.value || '')}
                />
              </IonItem>

              <IonButton
                type="submit"
                expand="block"
                color="primary"
                disabled={isSubmitting}
                style={{ fontWeight: 900, '--border-radius': '14px', height: '48px' }}
              >
                {isSubmitting ? <IonSpinner name="crescent" /> : 'Save Patient Profile'}
              </IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg || ''}
          duration={3000}
          onDidDismiss={() => setToastMsg(null)}
          color="dark"
        />
      </IonContent>
    </IonPage>
  );
};

