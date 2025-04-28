// Акордеон
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const toggleButton = item.querySelector('.accordion-toggle');
    const header = item.querySelector('.accordion-header');

    function toggleAccordion(e) {
        e.stopPropagation();
        item.classList.toggle('active');

        // Меняем иконку
        toggleButton.src = item.classList.contains('active') 
            ? "assets/icons/Minus.svg" 
            : "assets/icons/Plus.svg";
    }

    // На все устройства: кликаем по кнопке
    toggleButton.addEventListener('click', toggleAccordion);

    // Только на мобильных устройствах: кликаем по заголовку
    if (window.innerWidth <= 768) { // ширина для мобильных (можно настроить)
        header.addEventListener('click', toggleAccordion);
    }
});


document.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth <= 768) { // Проверяем, что это мобильное устройство
        const img1 = document.getElementById('aboutImg1');
        const img2 = document.getElementById('aboutImg2');

        img1.addEventListener('click', () => {
            img1.style.display = 'none';
            img2.style.display = 'block';
        });

        img2.addEventListener('click', () => {
            img2.style.display = 'none';
            img1.style.display = 'block';
        });
    }
});

// Функция для показа кастомного алерта
function showAlert(message) {
    const alertBox = document.getElementById('custom-alert');
    const alertText = document.getElementById('alert-text');

    alertText.textContent = message;
    alertBox.style.display = 'block';
}

// Функция для закрытия кастомного алерта
function closeAlert() {
    const alertBox = document.getElementById('custom-alert');
    alertBox.style.display = 'none';
}


// Отправка формы
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const nameInput = document.getElementById('nameInput');
    const contactInput = document.getElementById('contactInput');
    const messageInput = document.getElementById('infoInput');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const contact = contactInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !contact || !message) {
            showAlert('Пожалуйста, заполните все поля!');
            return;
        }

        const text = `
📝 Новая заявка:
👤 Имя: ${name}
📞 Контакт: ${contact}
🕒 Пожелания: ${message}
        `;

        try {
            await fetch(`https://api.telegram.org/bot7705167644:AAGA9hAxTRgSP8r9P0jrLV_zvZi200G8u8w/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: '1594946238',
                    text: text
                })
            });

            form.reset();
            showAlert('Ваша заявка успешно отправлена!');
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            showAlert('Произошла ошибка при отправке. Попробуйте позже.');
        }
    });
});

