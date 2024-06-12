document.addEventListener('DOMContentLoaded', function () {
    const settingsForm = document.getElementById('settingsForm');
    const successMessage = document.getElementById('successMessage');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');

    // Обработчик отправки формы
    settingsForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Получаем значения из формы
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Валидация пароля
        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }

        // Здесь вы можете добавить логику для отправки данных на сервер
        console.log('Email:', email);
        console.log('Password:', password);

        // Показываем сообщение об успешном сохранении настроек
        successMessage.classList.remove('hidden');
        setTimeout(() => successMessage.classList.add('hidden'), 3000);
    });

    // Обработчик удаления аккаунта
    deleteAccountBtn.addEventListener('click', function () {
        if (confirm('Вы уверены, что хотите удалить аккаунт?')) {
            // Здесь вы можете добавить логику для удаления аккаунта
            console.log('Аккаунт удален');
            // Перенаправление на страницу регистрации
            window.location.href = 'registration.html';
        }
    });
});
