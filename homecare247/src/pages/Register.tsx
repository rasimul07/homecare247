import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
  IonToast,
} from '@ionic/react';
import { personOutline, mailOutline, lockClosedOutline, callOutline, locationOutline } from 'ionicons/icons';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCity, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setToastMsg('Please fill in name, email, and password');
      return;
    }

    setIsLoading(true);
    try {
      await api.register({
        name,
        email,
        password,
        phone,
        city: selectedCity.id,
        address,
      });

      await refreshUser();
      setToastMsg('Account created successfully!');
      setTimeout(() => {
        navigate('/customer/services', { replace: true });
      }, 500);
    } catch (err: any) {
      setToastMsg(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#ffffff' }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle style={{ fontWeight: 900, color: '#0f172b' }}>Create Family Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" style={{ '--background': '#f8fafc' }}>
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
          <IonCard style={{ margin: 0, borderRadius: '18px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
            <IonCardContent style={{ padding: '20px' }}>
              <p style={{ fontSize: '13px', color: '#62748e', marginTop: 0, marginBottom: '16px' }}>
                Register to track bedside care, manage family patients, and access verified clinical care at home.
              </p>

              <form onSubmit={handleRegister}>
                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '10px' }}>
                  <IonIcon icon={personOutline} slot="start" color="medium" style={{ fontSize: '18px' }} />
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    YOUR FULL NAME *
                  </IonLabel>
                  <IonInput
                    required
                    placeholder="e.g. Rahul Sen"
                    value={name}
                    onIonInput={(e) => setName(e.detail.value || '')}
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '10px' }}>
                  <IonIcon icon={mailOutline} slot="start" color="medium" style={{ fontSize: '18px' }} />
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    EMAIL ADDRESS *
                  </IonLabel>
                  <IonInput
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onIonInput={(e) => setEmail(e.detail.value || '')}
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '10px' }}>
                  <IonIcon icon={lockClosedOutline} slot="start" color="medium" style={{ fontSize: '18px' }} />
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    PASSWORD (MIN 6 CHARACTERS) *
                  </IonLabel>
                  <IonInput
                    type="password"
                    required
                    placeholder="Create a secure password"
                    value={password}
                    onIonInput={(e) => setPassword(e.detail.value || '')}
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '10px' }}>
                  <IonIcon icon={callOutline} slot="start" color="medium" style={{ fontSize: '18px' }} />
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    PHONE NUMBER
                  </IonLabel>
                  <IonInput
                    type="tel"
                    placeholder="10-digit mobile number"
                    value={phone}
                    onIonInput={(e) => setPhone(e.detail.value || '')}
                  />
                </IonItem>

                <IonItem lines="inset" style={{ '--background': '#f8fafc', borderRadius: '12px', marginBottom: '18px' }}>
                  <IonIcon icon={locationOutline} slot="start" color="medium" style={{ fontSize: '18px' }} />
                  <IonLabel position="stacked" style={{ fontWeight: 700, fontSize: '11px', color: '#62748e' }}>
                    PRIMARY RESIDENCE ADDRESS
                  </IonLabel>
                  <IonInput
                    placeholder="Street, Locality, Area"
                    value={address}
                    onIonInput={(e) => setAddress(e.detail.value || '')}
                  />
                </IonItem>

                <IonButton
                  type="submit"
                  expand="block"
                  color="primary"
                  disabled={isLoading}
                  style={{ fontWeight: 900, '--border-radius': '14px', height: '48px' }}
                >
                  {isLoading ? <IonSpinner name="crescent" /> : 'Create Account & Continue'}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>

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
