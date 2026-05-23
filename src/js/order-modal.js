import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.modal-form');

form.addEventListener('submit', handleSubmit);

let dessertsId = null;

async function handleSubmit(event) {
  event.preventDefault();

  const { username, phone, textComment } = event.target.elements;

  const formData = {
    name: username.value.trim(),
    phone: phone.value.trim(),
    dessertId: dessertsId,
    comment: textComment.value.trim(),
  };

  try {
    const res = await axios.post(
      'https://deserts-store.b.goit.study/api/orders',
      formData
    );

    const orderData = res.data;
    console.log(orderData);
    iziToast.success({
      title: `${orderData.name}`,
      message: `Ви замовили ${orderData.dessertName}, номер вашого замовлення ${orderData.orderNum}`,
      position: 'topRight',
    });

    event.target.reset();
  } catch (error) {
    iziToast.error({
      title: 'Помилка',
      message: `${error}`,
      position: 'topRight',
    });
  }
}
