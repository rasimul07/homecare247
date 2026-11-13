import React from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
  IonNote,
} from '@ionic/react';
import { closeOutline, locationOutline, checkmarkCircleOutline, callOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { CityHub } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CityPickerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { cities, selectedCity, setSelectedCity } = useAuth();

  const handleSelect = (city: CityHub) => {
    setSelectedCity(city);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.7} breakpoints={[0, 0.7, 0.9]}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Select Healthcare Hub</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <p style={{ margin: '8px 0 16px', fontSize: '13px', color: '#62748e' }}>
          Choose your city for localized response times, standby clinical staff, and regional emergency helplines:
        </p>

        <IonList inset lines="full">
          {cities.map((city) => {
            const isSelected = city.id === selectedCity.id;
            return (
              <IonItem
                key={city.id}
                button
                onClick={() => handleSelect(city)}
                style={{ '--padding-top': '12px', '--padding-bottom': '12px' }}
              >
                <IonIcon
                  icon={locationOutline}
                  slot="start"
                  color={isSelected ? 'primary' : 'medium'}
                />
                <IonLabel>
                  <h2 style={{ fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {city.name}
                    {isSelected && (
                      <IonBadge color="success">Active</IonBadge>
                    )}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#62748e' }}>
                    {city.state} • ~{city.avgResponseMinutes}m response
                  </p>
                  <IonNote color="primary" style={{ fontSize: '11px', fontWeight: 600 }}>
                    {city.availableStaffCount} Registered Staff on Standby
                  </IonNote>
                </IonLabel>
                {isSelected ? (
                  <IonIcon icon={checkmarkCircleOutline} slot="end" color="success" style={{ fontSize: '24px' }} />
                ) : (
                  <IonButton fill="clear" size="small" slot="end" href={`tel:${city.emergencyPhone}`}>
                    <IonIcon icon={callOutline} slot="icon-only" color="medium" />
                  </IonButton>
                )}
              </IonItem>
            );
          })}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

