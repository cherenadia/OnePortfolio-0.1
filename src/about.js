document.addEventListener('DOMContentLoaded', function() {
    const editableElements = document.querySelectorAll('.editable');

    editableElements.forEach(element => {
        element.addEventListener('blur', function() {
            localStorage.setItem(element.id, element.textContent);
        });

        const savedValue = localStorage.getItem(element.id);
        if (savedValue) {
            element.textContent = savedValue;
        }
    });

    document.getElementById('imageWrapper').addEventListener('click', function() {
        document.getElementById('imageUpload').click();
    });

    document.getElementById('imageUpload').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById('uploadedImage').src = e.target.result;
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });

    // Получаем ссылки на кнопки и модальное окно
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const editModal = document.getElementById('editModal');
    const closeBtn = document.getElementsByClassName('close-btn')[0];

    // При нажатии на кнопку "Редактировать" открываем модальное окно
    editProfileBtn.addEventListener('click', function() {
        localStorage.removeItem('username');
        localStorage.removeItem('country');
        localStorage.removeItem('city');
        localStorage.removeItem('email');
        localStorage.removeItem('phone');
        localStorage.removeItem('socialLinks');
        localStorage.removeItem('workHours');
        localStorage.removeItem('description');
        editModal.style.display = 'block'; // Показываем модальное окно

        // Заполняем поля формы текущими значениями профиля
        document.getElementById('editUsername').value = document.getElementById('username').textContent;
        document.getElementById('editCountry').value = document.getElementById('country').textContent;
        document.getElementById('editCity').value = document.getElementById('city').textContent;
        document.getElementById('editEmail').value = document.getElementById('email').textContent;
        document.getElementById('editPhone').value = document.getElementById('phone').textContent;
        document.getElementById('editSocialLinks').value = document.getElementById('socialLinks').textContent;
        document.getElementById('editWorkHours').value = document.getElementById('workHours').textContent;
        document.getElementById('editDescription').value = document.getElementById('description').textContent;
    });

    // При нажатии на кнопку "Сохранить" сохраняем изменения в профиле и обновляем отображение профиля
    saveProfileBtn.addEventListener('click', function() {
        // Обновляем отображение профиля с новыми значениями из формы
        document.getElementById('username').textContent = document.getElementById('editUsername').value;
        document.getElementById('country').textContent = document.getElementById('editCountry').value;
        document.getElementById('city').textContent = document.getElementById('editCity').value;
        document.getElementById('email').textContent = document.getElementById('editEmail').value;
        document.getElementById('phone').textContent = document.getElementById('editPhone').value;
        document.getElementById('socialLinks').innerHTML = '<a href="#">' + document.getElementById('editSocialLinks').value + '</a>';
        document.getElementById('workHours').textContent = document.getElementById('editWorkHours').value;
        document.getElementById('description').textContent = document.getElementById('editDescription').value;
        
        // Закрываем модальное окно
        editModal.style.display = 'none';
    });

    // Закрываем модальное окно при нажатии на кнопку "закрыть" (x)
    closeBtn.addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Закрываем модальное окно при клике вне его области
    window.addEventListener('click', function(event) {
        if (event.target == editModal) {
            editModal.style.display = 'none';
        }
    });
});
