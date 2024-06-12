const { ipcRenderer } = require('electron');

// Отправка запроса на загрузку данных о проектах при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  ipcRenderer.send('load-project-data');
});

document.getElementById('create-project-btn').addEventListener('click', () => {
  window.location.href = 'project.html';
});

document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', () => {
        const likeCount = button.nextElementSibling; // Получаем элемент для отображения количества лайков
        let count = parseInt(likeCount.innerText); // Получаем текущее количество лайков и преобразуем в число
        console.log('Текущее количество лайков:', count); // Добавляем вывод текущего значения в консоль
        count++; // Увеличиваем количество лайков
        console.log('Новое количество лайков:', count); // Добавляем вывод нового значения в консоль
        likeCount.innerText = count; // Обновляем отображение количества лайков
    });
});


ipcRenderer.on('new-project', (event, projectData) => {
  addProjectToUI(projectData);
});

ipcRenderer.on('project-data-loaded', (event, projectData) => {
  // Отобразить загруженные проекты на странице
  projectData.forEach(project => {
    addProjectToUI(project);
  });
});

ipcRenderer.on('show-success-modal', () => {
  const modal = document.getElementById('success-modal');
  modal.style.display = 'block';

  // Закрытие модального окна через 1 секунду
  setTimeout(() => {
    modal.style.display = 'none';
  }, 1000);
});

// Функция для добавления проекта в UI
function addProjectToUI(project) {
  const projectsContainer = document.getElementById('projects-container');

  const projectElement = document.createElement('div');
  projectElement.classList.add('project');
  projectElement.setAttribute('data-name', project.name.toLowerCase()); // Добавляем атрибут для поиска

  const projectImage = document.createElement('img');
  projectImage.src = project.image;
  projectElement.appendChild(projectImage);

  const projectName = document.createElement('h3');
  projectName.innerText = project.name;
  projectElement.appendChild(projectName);

  // Контейнер для кнопок лайка, редактирования и удаления
  const buttonsContainer = document.createElement('div');
  buttonsContainer.classList.add('buttons-container');

  // Создание кнопки лайка с иконкой
  const likeButton = document.createElement('button');
  likeButton.classList.add('like-button');
  likeButton.innerHTML = '<i class="fas fa-heart"></i>'; // Иконка лайка
  buttonsContainer.appendChild(likeButton);

  // Элемент для отображения количества лайков
  const likeCount = document.createElement('span');
  likeCount.innerText = project.likes.toString(); // Используем количество лайков из данных проекта
  likeCount.classList.add('like-count');
  buttonsContainer.appendChild(likeCount);

  likeButton.addEventListener('click', () => {
    // Проверяем, был ли проект уже лайкнут
    if (!project.liked) {
      // Отправляем событие для увеличения количества лайков
      ipcRenderer.send('like-project', project);
      let count = parseInt(likeCount.innerText); // Получаем текущее количество лайков и преобразуем в число
      count++; // Увеличиваем количество лайков
      likeCount.innerText = count; // Обновляем отображение количества лайков

      // Устанавливаем флаг liked в true, чтобы предотвратить повторное нажатие на кнопку лайка
      project.liked = true;
    } else {
      // Если проект уже был лайкнут, выводим сообщение об этом
      console.log('Проект уже лайкнут');
    }
  });

  // Создание кнопки "Редактировать" с иконкой
  const editButton = document.createElement('button');
  editButton.classList.add('edit-project-btn');
  editButton.innerHTML = '<i class="fas fa-edit"></i>'; // Иконка редактирования
  editButton.addEventListener('click', () => {
    // Перенаправление на страницу редактирования проекта
    window.location.href = `project.html?id=${project.id}`;
  });
  buttonsContainer.appendChild(editButton);

  // Создание кнопки "Удалить" с иконкой
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-project-btn');
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Иконка удаления
  deleteButton.addEventListener('click', () => {
    ipcRenderer.send('delete-project', project);
    projectElement.remove();
  });
  buttonsContainer.appendChild(deleteButton);

  // Создание кнопки "Просмотр" с иконкой
  const viewButton = document.createElement('button');
  viewButton.classList.add('view-project-btn');
  viewButton.innerText = 'Просмотр'; // Текст кнопки "Просмотр"
  viewButton.addEventListener('click', () => {
    // Перенаправление на страницу просмотра проекта
    window.location.href = `view-project.html?id=${project.id}`;
  });
  buttonsContainer.appendChild(viewButton);

  // Добавляем контейнер с кнопками в проект
  projectElement.appendChild(buttonsContainer);

  projectsContainer.appendChild(projectElement);
}

// Обработчик для поиска проектов
document.getElementById('searchInput').addEventListener('input', (event) => {
  const searchValue = event.target.value.toLowerCase();
  const projects = document.querySelectorAll('.project');

  projects.forEach(project => {
    const projectName = project.getAttribute('data-name');
    if (projectName.includes(searchValue)) {
      project.style.display = '';
    } else {
      project.style.display = 'none';
    }
  });
});

