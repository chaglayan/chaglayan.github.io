import React, { useState } from 'react';
import { UserProfile } from '../types';

interface RegistrationFlowProps {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

type RegistrationStep = 'email' | 'email-otp' | 'phone' | 'phone-otp' | 'personal' | 'address';

export const RegistrationFlow: React.FC<RegistrationFlowProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<RegistrationStep>('email');
  const [formData, setFormData] = useState({
    email: 'demo@xcoins.com',
    emailOtp: '123456',
    phone: '+1 (555) 123-4567',
    phoneOtp: '654321',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-15',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
  });

  const handleNext = () => {
    const stepOrder: RegistrationStep[] = ['email', 'email-otp', 'phone', 'phone-otp', 'personal', 'address'];
    const currentIndex = stepOrder.indexOf(step);

    if (currentIndex === stepOrder.length - 1) {
      // Complete registration
      const profile: UserProfile = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        tier: 'bronze',
      };
      onComplete(profile);
    } else {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stepOrder: RegistrationStep[] = ['email', 'email-otp', 'phone', 'phone-otp', 'personal', 'address'];
    const currentIndex = stepOrder.indexOf(step);

    if (currentIndex === 0) {
      onBack();
    } else {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'email':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Enter your email</h2>
              <p className="text-gray-600">We'll send you a verification code</p>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="ios-input"
              placeholder="email@example.com"
            />
          </div>
        );

      case 'email-otp':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Verify your email</h2>
              <p className="text-gray-600">Enter the 6-digit code sent to {formData.email}</p>
            </div>
            <input
              type="text"
              value={formData.emailOtp}
              onChange={(e) => setFormData({ ...formData, emailOtp: e.target.value })}
              className="ios-input text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
            <button className="text-blue-500 text-sm">Resend code</button>
          </div>
        );

      case 'phone':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Enter your phone</h2>
              <p className="text-gray-600">We'll send you a verification code via SMS</p>
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="ios-input"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        );

      case 'phone-otp':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Verify your phone</h2>
              <p className="text-gray-600">Enter the 6-digit code sent to {formData.phone}</p>
            </div>
            <input
              type="text"
              value={formData.phoneOtp}
              onChange={(e) => setFormData({ ...formData, phoneOtp: e.target.value })}
              className="ios-input text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
            />
            <button className="text-blue-500 text-sm">Resend code</button>
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Personal information</h2>
              <p className="text-gray-600">Tell us a bit about yourself</p>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="ios-input"
                placeholder="First Name"
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="ios-input"
                placeholder="Last Name"
              />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="ios-input"
              />
            </div>
          </div>
        );

      case 'address':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your address</h2>
              <p className="text-gray-600">We need this for compliance purposes</p>
            </div>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="ios-input min-h-32"
              placeholder="Street address, City, State, ZIP"
              rows={4}
            />
          </div>
        );
    }
  };

  const stepNumber = ['email', 'email-otp', 'phone', 'phone-otp', 'personal', 'address'].indexOf(step) + 1;
  const totalSteps = 6;

  return (
    <div className="ios-container min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="ios-navbar flex items-center justify-between">
        <button onClick={handleBack} className="text-blue-500 text-lg">
          ← Back
        </button>
        <span className="text-gray-500 text-sm">
          Step {stepNumber} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-200 h-1">
        <div
          className="bg-blue-500 h-1 transition-all duration-300"
          style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-6 animate-fade-in">
        {renderStep()}
      </div>

      {/* Continue Button */}
      <div className="p-6 pb-8">
        <button onClick={handleNext} className="btn-primary w-full">
          {step === 'address' ? 'Complete Registration' : 'Continue'}
        </button>
      </div>
    </div>
  );
};
