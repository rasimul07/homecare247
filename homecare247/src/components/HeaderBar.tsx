import React, { useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonIcon,
  IonBadge,
  IonChip,
  IonLabel,
} from '@ionic/react';
import {
  callOutline,
  locationOutline,
  chevronDownOutline,
  medkitOutline,
} from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import { CityPickerModal } from './CityPickerModal';

interface Props {
  title?: string;
  onEmergencyClick?: () => void;
}

export const HeaderBar: React.FC<Props> = ({ title }) => {
  const { selectedCity } = useAuth();
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  return (
    <>
      <IonHeader className="ion-no-border" style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
        <IonToolbar style={{ '--background': '#ffffff', '--padding-start': '10px', '--padding-end': '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '6px' }}>
            {/* Left Brand / Screen Title */}
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
              {title ? (
                <span
                  style={{
                    color: '#0f172b',
                    fontWeight: 800,
                    fontSize: '15px',
                    letterSpacing: '-0.3px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {title}
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #155dfc, #009588)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0,
                    }}
                  >
                    <IonIcon icon={medkitOutline} style={{ fontSize: '16px' }} />
                  </div>
                  <div style={{ whiteSpace: 'nowrap' }}>
                    <span style={{ color: '#0f172b', fontWeight: 900, fontSize: '16px' }}>HomeCare</span>
                    <span style={{ color: '#155dfc', fontWeight: 900, fontSize: '16px' }}>247</span>
                    <IonBadge
                      color="success"
                      style={{
                        marginLeft: '4px',
                        fontSize: '9px',
                        padding: '1px 4px',
                        borderRadius: '4px',
                        verticalAlign: 'middle',
                      }}
                    >
                      24/7
                    </IonBadge>
                  </div>
                </div>
              )}
            </div>

            {/* Right Action Controls: City Switcher & Emergency SOS */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              {/* City Selector Pill */}
              <IonChip
                onClick={() => setIsCityModalOpen(true)}
                style={{
                  background: '#eff6ff',
                  color: '#1447e6',
                  border: '1px solid #bedbff',
                  height: '28px',
                  padding: '0 6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                <IonIcon icon={locationOutline} style={{ fontSize: '12px', marginRight: '2px' }} />
                <IonLabel style={{ maxWidth: '58px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedCity.name}
                </IonLabel>
                <IonIcon icon={chevronDownOutline} style={{ fontSize: '10px', marginLeft: '2px' }} />
              </IonChip>

              {/* Quick 24/7 Call */}
              <a
                href={`tel:${selectedCity.emergencyPhone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#e40014',
                  color: '#ffffff',
                  padding: '0 10px',
                  height: '28px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 2px 6px rgba(228, 0, 20, 0.25)',
                }}
                title="24/7 Rapid Emergency Line"
              >
                <IonIcon icon={callOutline} style={{ fontSize: '12px' }} />
                SOS
              </a>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <CityPickerModal isOpen={isCityModalOpen} onClose={() => setIsCityModalOpen(false)} />
    </>
  );
};
