import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { PAYMENT_METHODS, PLACES } from '../utils/data';
import toast from 'react-hot-toast';
import './PaymentPage.css';

const PaymentPage = () => {
  const { selectedBus, searchParams, selectedSeats, getTotalAmount, createBooking } = useBooking();
  const { user, saveBooking } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState('method'); // method | details | processing | done
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({ phone: '', pin: '', cardNum: '', cardExp: '', cardCvv: '' });
  const [processing, setProcessing] = useState(false);

  const fromPlace = PLACES.find(p => p.id === searchParams.from);
  const toPlace = PLACES.find(p => p.id === searchParams.to);
  const total = getTotalAmount();

  if (!selectedBus || selectedSeats.length === 0) {
    navigate('/search');
    return null;
  }

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setStep('details');
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (selectedMethod?.type === 'mobile-banking' && !paymentDetails.phone) {
      toast.error('Please enter your mobile number'); return;
    }
    if (selectedMethod?.type === 'card' && (!paymentDetails.cardNum || !paymentDetails.cardExp || !paymentDetails.cardCvv)) {
      toast.error('Please fill in all card details'); return;
    }

    setStep('processing');
    setProcessing(true);

    setTimeout(() => {
      const booking = createBooking({
        method: selectedMethod,
        transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
        phone: paymentDetails.phone,
        paidAt: new Date().toISOString(),
      });

      const fullBooking = {
        ...booking,
        user,
        fromPlace,
        toPlace,
        paymentMethod: selectedMethod,
        transactionId: `TXN-${Date.now().toString(36).toUpperCase()}`,
      };

      saveBooking(fullBooking);
      setProcessing(false);
      setStep('done');
    }, 2500);
  };

  const handleDownload = () => {
    navigate('/my-tickets');
  };

  return (
    <div className="payment-page">
      <div className="payment-page__header">
        <div className="container">
          {step !== 'done' && <button className="back-btn" onClick={() => step === 'details' ? setStep('method') : navigate('/seat-select')}>← Back</button>}
          <h1 className="payment-page__title">
            {step === 'method' && '💳 Choose Payment'}
            {step === 'details' && `Pay with ${selectedMethod?.name}`}
            {step === 'processing' && '⏳ Processing...'}
            {step === 'done' && '✅ Payment Successful!'}
          </h1>
        </div>
      </div>

      <div className="container payment-page__body">
        {/* Order Summary */}
        <div className="payment-summary card">
          <h3 className="payment-summary__title">Order Summary</h3>
          <div className="payment-summary__item">
            <span>Bus</span><span>{selectedBus.name}</span>
          </div>
          <div className="payment-summary__item">
            <span>Route</span><span>{fromPlace?.name} → {toPlace?.name}</span>
          </div>
          <div className="payment-summary__item">
            <span>Date</span><span>{searchParams.date}</span>
          </div>
          <div className="payment-summary__item">
            <span>Seats</span>
            <span className="payment-seats">
              {selectedSeats.map(s => <span key={s} className="payment-seat-tag">{s}</span>)}
            </span>
          </div>
          <div className="payment-summary__item">
            <span>Passengers</span><span>{selectedSeats.length}</span>
          </div>
          <div className="payment-summary__item payment-summary__total">
            <span>Total Amount</span>
            <span className="payment-total-amount">৳{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Payment Content */}
        <div className="payment-content">

          {/* Step: Method Selection */}
          {step === 'method' && (
            <div className="payment-methods animate-fade">
              <h3 className="payment-section-title">Select Payment Method</h3>

              <div className="methods-group">
                <div className="methods-group__label">📱 Mobile Banking</div>
                <div className="methods-grid">
                  {PAYMENT_METHODS.filter(m => m.type === 'mobile-banking').map(method => (
                    <button key={method.id} className="method-card" onClick={() => handleMethodSelect(method)} style={{'--method-color': method.color}}>
                      <div className="method-card__icon" style={{background: method.color}}>
                        <span>{method.logo}</span>
                      </div>
                      <div className="method-card__name">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="methods-group">
                <div className="methods-group__label">💳 Card & Net Banking</div>
                <div className="methods-grid">
                  {PAYMENT_METHODS.filter(m => m.type === 'card').map(method => (
                    <button key={method.id} className="method-card method-card--wide" onClick={() => handleMethodSelect(method)} style={{'--method-color': method.color}}>
                      <div className="method-card__icon" style={{background: method.color}}>
                        <span>{method.logo}</span>
                      </div>
                      <div>
                        <div className="method-card__name">{method.name}</div>
                        <div className="method-card__desc">{method.instructions}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="payment-security">
                🔒 All transactions are encrypted and secured by SSL
              </div>
            </div>
          )}

          {/* Step: Payment Details */}
          {step === 'details' && selectedMethod && (
            <div className="payment-details animate-fade">
              <div className="method-selected-badge" style={{background: selectedMethod.color + '15', borderColor: selectedMethod.color + '40'}}>
                <span>{selectedMethod.logo}</span>
                <span style={{color: selectedMethod.color}}>{selectedMethod.name}</span>
              </div>

              <form onSubmit={handlePay} className="payment-form">
                {selectedMethod.type === 'mobile-banking' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Your {selectedMethod.name} Number</label>
                      <div className="input-wrapper">
                        <span className="input-icon">📱</span>
                        <input
                          type="tel"
                          className="form-input input-with-icon"
                          placeholder="01XXXXXXXXX"
                          value={paymentDetails.phone}
                          onChange={e => setPaymentDetails(p => ({...p, phone: e.target.value}))}
                          maxLength={11}
                        />
                      </div>
                    </div>
                    <div className="payment-instruction">
                      <p>📋 After clicking Pay, you will receive an OTP/PIN request on your {selectedMethod.name} number.</p>
                      <p>Amount to pay: <strong>৳{total.toLocaleString()}</strong></p>
                    </div>
                  </>
                )}

                {selectedMethod.type === 'card' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Card Number</label>
                      <div className="input-wrapper">
                        <span className="input-icon">💳</span>
                        <input
                          type="text"
                          className="form-input input-with-icon"
                          placeholder="1234 5678 9012 3456"
                          value={paymentDetails.cardNum}
                          onChange={e => setPaymentDetails(p => ({...p, cardNum: e.target.value}))}
                          maxLength={19}
                        />
                      </div>
                    </div>
                    <div className="payment-form__row">
                      <div className="form-group">
                        <label className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="MM/YY"
                          value={paymentDetails.cardExp}
                          onChange={e => setPaymentDetails(p => ({...p, cardExp: e.target.value}))}
                          maxLength={5}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CVV</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="123"
                          value={paymentDetails.cardCvv}
                          onChange={e => setPaymentDetails(p => ({...p, cardCvv: e.target.value}))}
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" className="btn btn-primary payment-pay-btn">
                  🔐 Pay ৳{total.toLocaleString()} Now
                </button>
              </form>
            </div>
          )}

          {/* Step: Processing */}
          {step === 'processing' && (
            <div className="payment-processing animate-fade">
              <div className="processing-ring"></div>
              <h3>Processing Payment...</h3>
              <p>Please wait. Do not close this page.</p>
              <p className="processing-amount">৳{total.toLocaleString()} via {selectedMethod?.name}</p>
            </div>
          )}

          {/* Step: Done */}
          {step === 'done' && (
            <div className="payment-done animate-fade">
              <div className="payment-done__icon">✅</div>
              <h2>Payment Successful!</h2>
              <p>Your ticket has been confirmed. Check your email for details.</p>
              <div className="payment-done__ref">
                Booking ID: <strong>{`TK-${Date.now().toString(36).toUpperCase().slice(0,8)}`}</strong>
              </div>
              <div className="payment-done__btns">
                <button className="btn btn-primary" onClick={handleDownload}>📥 View & Download Ticket</button>
                <button className="btn btn-outline" onClick={() => navigate('/')}>🏠 Back to Home</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
