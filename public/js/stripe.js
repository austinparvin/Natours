const stripe = Stripe(
  'pk_test_51Mo2duArvuucfhZgkTbdQmYxJqVNA7VCmtdkB8SzrEMKFamvuR72PyBEn2Qag2eiuQfmaMY0DkaAGkby6XeApRxR00nDOJ88I9'
);
const showAlertStripe = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 5000);
};

const bookTour = async (tourId) => {
  try {
    const session = await axios({
      method: 'GET',
      url: `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`,
    });

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlertStripe('error', err.response.data.message);
  }
};

const bookButton = document.getElementById('book-tour');

if (bookButton)
  bookButton.addEventListener('click', (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
