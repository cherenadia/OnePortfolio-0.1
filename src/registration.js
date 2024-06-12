document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Получаем значения поля email и пароля
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Проверяем поддержку localStorage
        if (typeof(Storage) !== "undefined") {
            // Сохраняем значения в локальное хранилище
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);

            // Выводим сохраненные данные в консоль для проверки
            console.log('Данные сохранены в локальном хранилище:');
            console.log('Email:', email);
            console.log('Пароль:', password);

            // Перенаправляем пользователя на страницу меню
            window.location.href = 'menu.html';
        } else {
            // Если локальное хранилище не поддерживается, вы можете использовать альтернативный метод сохранения данных
            console.log('Локальное хранилище не поддерживается');
            // Тут можно использовать другие методы сохранения данных
        }
    });
});
