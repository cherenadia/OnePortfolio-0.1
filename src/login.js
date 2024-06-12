document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Получаем значения поля email и пароля
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Получаем сохраненные значения из локального хранилища
        const savedEmail = localStorage.getItem('email');
        const savedPassword = localStorage.getItem('password');

        // Проверяем, совпадают ли введенные данные с сохраненными данными
        if (email === savedEmail && password === savedPassword) {
            // Если совпадают, перенаправляем пользователя на страницу меню
            window.location.href = 'menu.html';
        } else {
            // Если данные не совпадают, выводим сообщение об ошибке
            alert('Неверный email или пароль');

            // Очищаем поля формы
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
        }
    });
});
