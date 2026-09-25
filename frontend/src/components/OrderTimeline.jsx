import React from 'react';
import { Check, Clock, PackageCheck, Truck, CheckCircle2, XCircle } from 'lucide-react';

export const OrderTimeline = ({ status }) => {
  const steps = [
    { key: 'PLACED', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: Check },
    { key: 'PREPARING', label: 'Preparing', icon: PackageCheck },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
  ];

  if (status === 'CANCELLED') {
    return (
      <div
        className="card-soft"
        style={{
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-primary-30)',
        }}
      >
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-primary-15)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <XCircle size={24} />
        </div>
        <div>
          <h4 style={{ fontWeight: 800 }}>Order Cancelled</h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
            This order has been cancelled and refunded if payment was completed.
          </p>
        </div>
      </div>
    );
  }

  const statusIndexMap = {
    PLACED: 0,
    CONFIRMED: 1,
    PREPARING: 2,
    OUT_FOR_DELIVERY: 3,
    DELIVERED: 4,
  };

  const currentIndex = statusIndexMap[status] ?? 0;

  return (
    <div className="stepper">
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;
        const IconComponent = step.icon;

        return (
          <div
            key={step.key}
            className={`step-item ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
          >
            <div className="step-icon">
              {isCompleted ? <Check size={18} strokeWidth={3} /> : <IconComponent size={18} />}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};
