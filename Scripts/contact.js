// EmailJS Contact Form Integration
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('button');
    
    // Form state management
    let isSubmitting = false;
    let submitStatus = 'idle'; // 'idle', 'success', 'error'
    
    // Initialize EmailJS (already initialized in HTML)
    // emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual public key
    
    // EmailJS configuration - Replace these with your actual values
    const EMAILJS_CONFIG = {
        serviceID: 'service_6m2x21x', // Replace with your service ID
        templateID: 'template_rvmi0ko', // Replace with your template ID
        publicKey: 'Z4u6SMrODAUc_3s04' // Replace with your public key
    };
    
    // Form validation
    function validateForm(formData) {
        const errors = [];
        
        if (!formData.name.trim()) {
            errors.push('Name is required');
        }
        
        if (!formData.email.trim()) {
            errors.push('Email is required');
        } else if (!isValidEmail(formData.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!formData.subject.trim()) {
            errors.push('Subject is required');
        }
        
        if (!formData.message.trim()) {
            errors.push('Message is required');
        }
        
        return errors;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Update button state
    function updateButtonState(state) {
        const button = submitButton;
        button.disabled = state === 'loading';
        
        switch(state) {
            case 'loading':
                button.innerHTML = `
                    <div class="loading-spinner"></div>
                    <span>Sending Message...</span>
                `;
                button.classList.add('loading');
                break;
            case 'success':
                button.innerHTML = `
                    <i class="fas fa-check"></i>
                    <span>Message Sent!</span>
                `;
                button.classList.add('success');
                break;
            case 'error':
                button.innerHTML = `
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Try Again</span>
                `;
                button.classList.add('error');
                break;
            default:
                button.innerHTML = `
                    <i class="fas fa-paper-plane"></i>
                    <span>Send Message</span>
                `;
                button.classList.remove('loading', 'success', 'error');
                button.style.display = 'flex';
                button.style.alignItems = 'center';
                button.style.justifyContent = 'center';
                button.style.gap = '8px';
        }
    }
    
    // Show notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.form-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Insert after form
        contactForm.parentNode.insertBefore(notification, contactForm.nextSibling);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
    
    // Handle form submission
    async function handleSubmit(event) {
        event.preventDefault();
        
        if (isSubmitting) return;
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Validate form
        const errors = validateForm(formData);
        if (errors.length > 0) {
            showNotification(errors.join(', '), 'error');
            return;
        }
        
        // Set submitting state
        isSubmitting = true;
        updateButtonState('loading');
        
        try {
            // Get current time for the template
            const now = new Date();
            const timeString = now.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
            
            // Prepare template parameters
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message,
                to_name: 'Ashish Ghimire',
                reply_to: formData.email,
                timestamp: timeString,
                website: 'Portfolio Contact Form'
            };
            
            // Send email using EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceID,
                EMAILJS_CONFIG.templateID,
                templateParams,
                EMAILJS_CONFIG.publicKey
            );
            
            console.log('EmailJS Response:', response);
            
            // Success
            updateButtonState('success');
            showNotification('Your message has been sent successfully! I\'ll get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                updateButtonState('idle');
            }, 3000);
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            
            // Error handling
            updateButtonState('error');
            showNotification('Failed to send message. Please try again or contact me directly.', 'error');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                updateButtonState('idle');
            }, 3000);
        } finally {
            isSubmitting = false;
        }
    }
    
    // Add form event listener
    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
    }
    
    // Add input animations
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
    
    // Add typing effect to textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        messageTextarea.addEventListener('input', function() {
            const charCount = this.value.length;
            const maxChars = 1000;
            
            // Update character count if needed
            let charCounter = this.parentElement.querySelector('.char-counter');
            if (!charCounter) {
                charCounter = document.createElement('div');
                charCounter.className = 'char-counter';
                this.parentElement.appendChild(charCounter);
            }
            
            charCounter.textContent = `${charCount}/${maxChars}`;
            charCounter.style.color = charCount > maxChars * 0.9 ? '#ff6b6b' : '#666';
        });
    }
});

// Add CSS for loading spinner and notifications
const style = document.createElement('style');
style.textContent = `
    .loading-spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-right: 8px;
        display: inline-block;
        vertical-align: middle;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    #contact-form button.loading {
        background-color: #6c757d;
        cursor: not-allowed;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    #contact-form button.success {
        background-color: #28a745;
        animation: successPulse 0.6s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    #contact-form button.error {
        background-color: #dc3545;
        animation: errorShake 0.6s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    @keyframes successPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    @keyframes errorShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    .form-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-background);
        color: var(--text-color);
        border-radius: 8px;
        padding: 16px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        border: 1px solid rgba(var(--primary-color-rgb), 0.3);
    }
    
    .form-notification.success {
        border-left: 4px solid #28a745;
    }
    
    .form-notification.error {
        border-left: 4px solid #dc3545;
    }
    
    .form-notification.info {
        border-left: 4px solid #17a2b8;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .notification-content i {
        font-size: 18px;
    }
    
    .form-notification.success .notification-content i {
        color: #28a745;
    }
    
    .form-notification.error .notification-content i {
        color: #dc3545;
    }
    
    .form-notification.info .notification-content i {
        color: #17a2b8;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .char-counter {
        text-align: right;
        font-size: 12px;
        margin-top: 4px;
        color: #666;
    }
    
    .form-group.focused label {
        color: var(--primary-color);
        transform: translateY(-2px);
    }
    
    @media (max-width: 768px) {
        .form-notification {
            top: 10px;
            right: 10px;
            left: 10px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);
