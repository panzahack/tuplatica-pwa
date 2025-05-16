// Form submission logic will go here
console.log('Tuplay app initialized');

// Handle form submission
const remittanceForm = document.getElementById('remittanceForm');
const successMessage = document.getElementById('successMessage');

remittanceForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Hide form and show success message
  remittanceForm.classList.add('hidden');
  successMessage.classList.remove('hidden');
  
  // Scroll to success message
  successMessage.scrollIntoView({ behavior: 'smooth' });
});

// Exchange rate functionality
const exchangeRateElement = document.getElementById('exchangeRate');
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

zelleToggleBtn.addEventListener('click', () => {
  zelleInfo.classList.toggle('hidden');
});

// Initialize rate display
updateRateDisplay();
