// Enhanced Currency Calculator with Commission
document.addEventListener('DOMContentLoaded', () => {
  // Get elements
  const usdInput = document.getElementById('usdAmount');
  const vesResult = document.getElementById('vesResult');
  const commissionResult = document.getElementById('commissionResult');
  const amountWarning = document.getElementById('amountWarning');
  const currentRate = document.getElementById('currentRate');

  // Calculate and display results
  const calculate = () => {
    const usd = parseFloat(usdInput.value);
    const rate = parseFloat(currentRate.textContent);
    
    // Validate amount
    if (usd > 200) {
      amountWarning.classList.remove('hidden');
      vesResult.textContent = '💰 0 Bs';
      commissionResult.textContent = '💸 Total a depositar: 0.00 USD (incluye comisión)';
      return;
    } else {
      amountWarning.classList.add('hidden');
    }
    
    if (isNaN(usd) || usd <= 0 || isNaN(rate)) {
      vesResult.textContent = '💰 0 Bs';
      commissionResult.textContent = '💸 Total a depositar: 0.00 USD (incluye comisión)';
      return;
    }
    
    // Calculate commission (5%)
    const commission = usd * 0.05;
    const totalUSD = usd + commission;
    
    // Format and display
    const totalBs = (usd * rate).toLocaleString('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    vesResult.textContent = `💰 ${totalBs} Bs`;
    commissionResult.textContent = `💸 Total a depositar: ${totalUSD.toFixed(2)} USD (incluye comisión)`;
  };

  // Set up event listener
  usdInput.addEventListener('input', calculate);
  
  // Initial calculation
  calculate();
});

// Form elements
const recipientInput = document.getElementById('recipient');
const bankInfoInput = document.getElementById('bankInfo');
const whatsappInput = document.getElementById('whatsapp');
const saveRecipientBtn = document.getElementById('saveRecipientBtn');
const saveRecipientContainer = document.getElementById('saveRecipientContainer');
const savedRecipients = document.getElementById('savedRecipients');
const recipientsDropdownContainer = document.getElementById('recipientsDropdownContainer');
const clearRecipientsBtn = document.getElementById('clearRecipientsBtn');
const addRecipientBtn = document.getElementById('addRecipientBtn');
const recipientsList = document.getElementById('recipientsList');
const clearStorageBtn = document.getElementById('clearStorageBtn');

// Check if fields have content to show save button
function checkFields() {
  if (recipientInput.value && bankInfoInput.value) {
    saveRecipientContainer.classList.remove('hidden');
  } else {
    saveRecipientContainer.classList.add('hidden');
  }
}

// Load saved data on page load
document.addEventListener('DOMContentLoaded', () => {
  checkFields();
  loadRecipients();
  // Load form data
  if (localStorage.getItem('recipient')) recipientInput.value = localStorage.getItem('recipient');
  if (localStorage.getItem('bankInfo')) bankInfoInput.value = localStorage.getItem('bankInfo');
  if (localStorage.getItem('whatsapp')) whatsappInput.value = localStorage.getItem('whatsapp');
});

// Check fields on input
recipientInput.addEventListener('input', checkFields);
bankInfoInput.addEventListener('input', checkFields);

// Save new recipient
saveRecipientBtn.addEventListener('click', () => {
  const recipients = JSON.parse(localStorage.getItem('recipients') || '[]');
  
  // Check if already exists
  const exists = recipients.some(r => 
    r.name === recipientInput.value && r.bank === bankInfoInput.value
  );
  
  if (exists) {
    alert('Este destinatario ya está guardado');
    return;
  }
  
  recipients.push({
    name: recipientInput.value,
    bank: bankInfoInput.value,
    whatsapp: whatsappInput.value
  });
  
  localStorage.setItem('recipients', JSON.stringify(recipients));
  alert('Destinatario guardado correctamente');
  loadRecipients();
});

// Load recipients into dropdown
function loadRecipients() {
  const recipients = JSON.parse(localStorage.getItem('recipients') || '[]');
  
  savedRecipients.innerHTML = '<option value="">-- Seleccionar --</option>';
  
  if (recipients.length > 0) {
    recipientsDropdownContainer.classList.remove('hidden');
    recipients.forEach((recipient, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = recipient.name;
      savedRecipients.appendChild(option);
    });
  } else {
    recipientsDropdownContainer.classList.add('hidden');
  }
  
  // Update recipients list display
  recipientsList.innerHTML = '';
  if (recipients.length === 0) {
    recipientsList.innerHTML = '<p class="text-gray-500 text-sm">No hay destinatarios guardados</p>';
    return;
  }
  
  recipients.forEach((recipient, index) => {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
    div.innerHTML = `
      <span>${recipient.name} - ${recipient.bank}</span>
      <button 
        data-index="${index}" 
        class="text-blue-600 hover:text-blue-800 text-sm"
        onclick="loadRecipient(${index})"
      >
        Cargar
      </button>
    `;
    recipientsList.appendChild(div);
  });
}

// Select recipient from dropdown
savedRecipients.addEventListener('change', () => {
  const recipients = JSON.parse(localStorage.getItem('recipients') || '[]');
  const selectedIndex = savedRecipients.value;
  
  if (selectedIndex && recipients[selectedIndex]) {
    const recipient = recipients[selectedIndex];
    recipientInput.value = recipient.name;
    bankInfoInput.value = recipient.bank;
    whatsappInput.value = recipient.whatsapp || '';
    
    // Update localStorage
    localStorage.setItem('recipient', recipient.name);
    localStorage.setItem('bankInfo', recipient.bank);
    if (recipient.whatsapp) localStorage.setItem('whatsapp', recipient.whatsapp);
  }
});

// Clear all recipients
clearRecipientsBtn.addEventListener('click', () => {
  if (confirm('¿Estás seguro de eliminar todos los destinatarios guardados?')) {
    localStorage.removeItem('recipients');
    loadRecipients();
    alert('Todos los destinatarios han sido eliminados');
  }
});

// Save form data on change
recipientInput.addEventListener('input', () => {
  localStorage.setItem('recipient', recipientInput.value);
});

bankInfoInput.addEventListener('input', () => {
  localStorage.setItem('bankInfo', bankInfoInput.value);
});

whatsappInput.addEventListener('input', () => {
  localStorage.setItem('whatsapp', whatsappInput.value);
});

// Add new recipient
addRecipientBtn.addEventListener('click', () => {
  if (!recipientInput.value || !bankInfoInput.value) {
    alert('Por favor complete nombre y banco del destinatario');
    return;
  }
  
  const recipients = JSON.parse(localStorage.getItem('recipients') || '[]');
  recipients.push({
    name: recipientInput.value,
    bank: bankInfoInput.value,
    whatsapp: whatsappInput.value
  });
  
  localStorage.setItem('recipients', JSON.stringify(recipients));
  loadRecipients();
});

// Load recipient by index
window.loadRecipient = (index) => {
  const recipients = JSON.parse(localStorage.getItem('recipients') || '[]');
  if (recipients[index]) {
    const recipient = recipients[index];
    recipientInput.value = recipient.name;
    bankInfoInput.value = recipient.bank;
    whatsappInput.value = recipient.whatsapp || '';
    
    // Update localStorage
    localStorage.setItem('recipient', recipient.name);
    localStorage.setItem('bankInfo', recipient.bank);
    if (recipient.whatsapp) localStorage.setItem('whatsapp', recipient.whatsapp);
  }
};

// Clear all saved data
clearStorageBtn.addEventListener('click', () => {
  if (confirm('¿Está seguro que desea borrar todos los datos guardados?')) {
    localStorage.removeItem('recipient');
    localStorage.removeItem('bankInfo');
    localStorage.removeItem('whatsapp');
    localStorage.removeItem('recipients');
    
    recipientInput.value = '';
    bankInfoInput.value = '';
    whatsappInput.value = '';
    
    loadRecipients();
    alert('Datos borrados correctamente');
  }
});

// WhatsApp validation with country code
const countryCodeSelect = document.getElementById('countryCode');
const whatsappRegex = /^\d{9,14}$/; // Now just checks the number part

function getFullWhatsappNumber() {
  return countryCodeSelect.value + whatsappInput.value;
}

whatsappInput.addEventListener('blur', () => {
  if (!whatsappRegex.test(whatsappInput.value)) {
    whatsappInput.classList.add('border-red-500');
    alert('Por favor ingrese un número válido (solo números, sin código de país). Ejemplo: 4121234567');
  } else {
    whatsappInput.classList.remove('border-red-500');
  }
});

// Form submission logic will go here
console.log('Tuplay app initialized');

// Handle form submission
const remittanceForm = document.getElementById('remittanceForm');
const successMessage = document.getElementById('successMessage');

remittanceForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Validate WhatsApp again before submission
  if (!whatsappRegex.test(whatsappInput.value)) {
    whatsappInput.classList.add('border-red-500');
    alert('Por favor ingrese un número de WhatsApp válido');
    return;
  }
  
  // In a real implementation, use getFullWhatsappNumber() for the full number
  
  // Hide form and show success message
  remittanceForm.classList.add('hidden');
  successMessage.classList.remove('hidden');
  
  // Scroll to success message
  successMessage.scrollIntoView({ behavior: 'smooth' });
});

// Exchange rate functionality
const adminControls = document.getElementById('adminControls');
const newRateInput = document.getElementById('newRate');
const updateRateBtn = document.getElementById('updateRateBtn');
let currentRate = 36.50; // Default rate

// Update rate display
function updateRateDisplay() {
  exchangeRateElement.textContent = `1 USD = ${currentRate} VES`;
}

// Show admin controls when double-clicking the rate
exchangeRateElement.addEventListener('dblclick', (e) => {
  adminControls.classList.toggle('hidden');
  if (!adminControls.classList.contains('hidden')) {
    newRateInput.value = currentRate;
    newRateInput.focus();
  }
});

// Update rate when button is clicked
updateRateBtn.addEventListener('click', () => {
  const newRate = parseFloat(newRateInput.value);
  if (!isNaN(newRate) && newRate > 0) {
    currentRate = newRate;
    updateRateDisplay();
    adminControls.classList.add('hidden');
    console.log(`Exchange rate updated to: ${currentRate}`);
  } else {
    alert('Por favor ingrese una tasa válida');
  }
});

// Zelle info toggle
const zelleToggleBtn = document.getElementById('zelleToggleBtn');
const zelleInfo = document.getElementById('zelleInfo');
const copyZelleBtn = document.getElementById('copyZelleBtn');

zelleToggleBtn.addEventListener('click', () => {
  zelleInfo.classList.toggle('hidden');
});

copyZelleBtn.addEventListener('click', () => {
  const correo = document.getElementById('correoZelle').textContent;
  navigator.clipboard.writeText(correo).then(() => {
    zelleInfo.classList.add('hidden');
    alert('Correo copiado');
  }).catch(err => {
    console.error('Error al copiar:', err);
  });
});

// Initialize rate display
updateRateDisplay();
