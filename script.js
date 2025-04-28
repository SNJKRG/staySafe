// Акордеон
const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const toggleButton = item.querySelector('.accordion-toggle');

    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        item.classList.toggle('active');

        // Меняем иконку
        toggleButton.src = item.classList.contains('active') 
            ? "assets/icons/Minus.svg" 
            : "assets/icons/Plus.svg";
    });
});

document.addEventListener('DOMContentLoaded', () => {
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
});

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
            alert('Пожалуйста, заполните все поля!');
            return;
        }

        const text = `
📝 Новая заявка:
👤 Имя: ${name}
📞 Контакт: ${contact}
🕒 Пожелания: ${message}
        `;

        try {
            await fetch(`https://api.telegram.org/bot<TOKEN>/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: '<TELEGRAM_CHAT_ID>',
                    text: text
                })
            });

            form.reset();
        } catch (error) {
            console.error('Ошибка при отправке:', error);
        }
    });
});

