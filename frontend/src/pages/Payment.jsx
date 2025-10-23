import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaTruck, FaFileAlt, FaCheckCircle, FaCreditCard } from 'react-icons/fa';
import './Payment.css';

const Payment = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    pages: 0,
    copies: 1,
    printType: 'black-white',
    paperType: 'normal-a4',
    bindingType: 'spiral',
    bindingColor: 'blue',
    transportationCost: 15,
    deliveryAddress: '',
    deliveryCollege: ''
  });

  useEffect(() => {
    loadProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const loadProjectDetails = () => {
    // Get data from navigation state or use demo
    const navState = window.history.state?.usr;
    
    if (navState?.projectData && navState?.customization) {
      const { projectData, customization, totalPages } = navState;
      
      setProject({
        id: projectId,
        title: projectData.title,
        pages: totalPages,
        department: projectData.department,
        semester: projectData.semester
      });
      
      setPaymentDetails(prev => ({
        ...prev,
        pages: totalPages,
        copies: customization.copies,
        printType: customization.printType,
        paperType: customization.paperType,
        bindingType: customization.bindingType,
        bindingColor: customization.bindingColor
      }));
    } else {
      // Demo project data
      const demoProject = {
        id: projectId,
        title: 'Machine Learning Project',
        pages: 45,
        department: 'Computer Science',
        semester: 6
      };

      setProject(demoProject);
      setPaymentDetails(prev => ({
        ...prev,
        pages: demoProject.pages
      }));
    }
  };

  const calculateCosts = () => {
    const { pages, copies } = paymentDetails;
    
    // BASE COSTS (Hidden from customer)
    const basePrintingCostPerPage = 1.25; // ₹1.25 per page
    // TEMPORARILY REMOVED FOR TESTING - Will add back later
    // const baseTransportationCost = 18; // ₹18 fixed
    // const baseBindingCostPerCopy = 80; // ₹80 per copy
    // const baseGlassSheetCostPerCopy = 40; // ₹40 per copy
    const baseTransportationCost = 0; // TESTING: Removed transportation charge
    const baseBindingCostPerCopy = 0; // TESTING: Removed binding charge
    const baseGlassSheetCostPerCopy = 0; // TESTING: Removed glass sheet charge
    
    // Calculate base costs
    const basePrintingTotal = pages * basePrintingCostPerPage * copies;
    const baseBindingTotal = baseBindingCostPerCopy * copies;
    const baseGlassSheetTotal = baseGlassSheetCostPerCopy * copies;
    const baseTransportTotal = baseTransportationCost;
    
    // Total base cost (before profit and additional markup)
    const totalBaseCost = basePrintingTotal + baseBindingTotal + baseGlassSheetTotal + baseTransportTotal;
    
    // Add ₹25 per copy (hidden markup)
    const additionalMarkupPerCopy = 25;
    const totalAdditionalMarkup = additionalMarkupPerCopy * copies;
    
    // Add profit margin (adjusted to 35% to maintain competitive pricing)
    const profitMargin = totalBaseCost * 0.35;
    
    // Final total (base cost + markup + profit)
    const finalTotal = totalBaseCost + totalAdditionalMarkup + profitMargin;
    
    // What customer sees (combined costs, profit and markup hidden)
    const totalHiddenAmount = profitMargin + totalAdditionalMarkup;
    const customerPrintingCost = basePrintingTotal + (totalHiddenAmount * (basePrintingTotal / totalBaseCost));
    const customerBindingCost = baseBindingTotal + baseGlassSheetTotal + (totalHiddenAmount * ((baseBindingTotal + baseGlassSheetTotal) / totalBaseCost));
    const customerTransportCost = baseTransportTotal + (totalHiddenAmount * (baseTransportTotal / totalBaseCost));

    return {
      printingCost: Math.round(customerPrintingCost),
      bindingCost: Math.round(customerBindingCost), // Includes glass sheet (currently ₹0 for testing)
      transportationCost: Math.round(customerTransportCost),
      total: Math.round(finalTotal),
      // Hidden calculations (for internal use only)
      _baseCost: Math.round(totalBaseCost),
      _additionalMarkup: Math.round(totalAdditionalMarkup),
      _profit: Math.round(profitMargin),
      _profitPercentage: 35,
      _totalHiddenAmount: Math.round(totalHiddenAmount)
    };
  };

  const costs = calculateCosts();

  const handlePayment = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Create Razorpay order
      const orderResponse = await fetch(`${apiUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          amount: costs.total,
          projectId: project.id,
          projectData: {
            title: project.title,
            pages: paymentDetails.pages,
            copies: paymentDetails.copies,
            printType: paymentDetails.printType,
            paperType: paymentDetails.paperType,
            bindingType: paymentDetails.bindingType,
            bindingColor: paymentDetails.bindingColor,
            deliveryAddress: paymentDetails.deliveryAddress,
            deliveryCollege: paymentDetails.deliveryCollege
          }
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: orderData.razorpayKeyId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'P2D - Project Print & Delivery',
        description: `Payment for ${project.title}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // Payment successful - verify and save
          try {
            const verifyResponse = await fetch(`${apiUrl}/api/payments/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                projectId: project.id,
                projectData: {
                  title: project.title,
                  pages: paymentDetails.pages,
                  copies: paymentDetails.copies,
                  printType: paymentDetails.printType,
                  paperType: paymentDetails.paperType,
                  bindingType: paymentDetails.bindingType,
                  bindingColor: paymentDetails.bindingColor,
                  deliveryAddress: paymentDetails.deliveryAddress,
                  deliveryCollege: paymentDetails.deliveryCollege || project.college || 'College',
                  department: project.department || 'General',
                  semester: project.semester || 1
                }
              })
            });

            if (verifyResponse.ok) {
              alert('✅ Payment successful! Your project files have been saved and will be processed soon.');
              navigate('/dashboard');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('⚠️ Payment received but verification failed. Please contact support.');
          }
        },
        prefill: {
          name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '',
          email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '',
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            alert('⚠️ Payment cancelled. Your files will not be saved.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('❌ Payment failed. Please try again.');
      setLoading(false);
    }
  };

  if (!project) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="payment-container">
      <div className="payment-header">
        <h1>💳 Payment</h1>
        <p>Complete your payment to submit the project</p>
      </div>

      <div className="payment-content">
        {/* Project Details */}
        <div className="payment-card">
          <div className="card-header">
            <FaFileAlt />
            <h2>Project Details</h2>
          </div>
          <div className="card-body">
            <div className="detail-row">
              <span className="label">Project Title:</span>
              <span className="value">{project.title}</span>
            </div>
            <div className="detail-row">
              <span className="label">Department:</span>
              <span className="value">{project.department}</span>
            </div>
            <div className="detail-row">
              <span className="label">Semester:</span>
              <span className="value">Semester {project.semester}</span>
            </div>
            <div className="detail-row">
              <span className="label">Total Pages:</span>
              <span className="value highlight">{project.pages} pages</span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="payment-card">
          <div className="card-header">
            <FaMoneyBillWave />
            <h2>Cost Breakdown</h2>
          </div>
          <div className="card-body">
            <div className="cost-row">
              <span className="label">
                Printing Charges ({paymentDetails.pages} pages × {paymentDetails.copies} copies)
              </span>
              <span className="value">₹{costs.printingCost}</span>
            </div>
            <div className="cost-row">
              <span className="label">
                Binding Charges ({paymentDetails.copies} {paymentDetails.copies > 1 ? 'copies' : 'copy'})
              </span>
              <span className="value">₹{costs.bindingCost}</span>
            </div>
            <div className="cost-row">
              <span className="label">
                <FaTruck /> Transportation & Delivery
              </span>
              <span className="value">₹{costs.transportationCost}</span>
            </div>
            <div className="cost-row total">
              <span className="label">Total Amount</span>
              <span className="value">₹{costs.total}</span>
            </div>
          </div>
        </div>

        {/* Delivery to College */}
        <div className="payment-card">
          <div className="card-header">
            <FaTruck />
            <h2>Delivery to College</h2>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Delivery will be made to your college *</label>
              <input
                type="text"
                value={paymentDetails.deliveryCollege || project?.college || 'Your College'}
                readOnly
                className="readonly-input"
              />
              <p className="delivery-info">📍 Delivery will be made directly to your college campus</p>
            </div>
            <div className="form-group">
              <label>Additional Instructions (Optional)</label>
              <textarea
                value={paymentDetails.deliveryAddress}
                onChange={(e) => setPaymentDetails({
                  ...paymentDetails,
                  deliveryAddress: e.target.value
                })}
                placeholder="E.g., Department office, Specific building, Contact person, etc."
                rows="3"
              />
            </div>
            <div className="delivery-note">
              <FaCheckCircle />
              <span>Your project will be delivered to your college within 3-5 business days</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="payment-card">
          <div className="card-header">
            <FaCreditCard />
            <h2>Payment Method</h2>
          </div>
          <div className="card-body">
            <div className="payment-methods">
              <div className="payment-method active">
                <input type="radio" name="payment" id="razorpay" defaultChecked />
                <label htmlFor="razorpay">
                  <div className="method-icon">💳</div>
                  <div className="method-info">
                    <h4>Razorpay</h4>
                    <p>Credit/Debit Card, UPI, Net Banking</p>
                  </div>
                </label>
              </div>
            </div>

            <button 
              onClick={handlePayment} 
              className="pay-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ₹${costs.total.toFixed(2)}`}
            </button>

            <div className="payment-security">
              <FaCheckCircle />
              <span>Secure payment powered by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
