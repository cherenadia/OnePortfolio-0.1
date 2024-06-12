const { ipcRenderer } = require('electron');

// Проверяем, если передан ID проекта в URL (при редактировании)
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

if (projectId) {
  // Загружаем данные проекта для редактирования
  ipcRenderer.send('load-project-data');
  ipcRenderer.on('project-data-loaded', (event, projects) => {
    const project = projects.find(p => p.id === parseInt(projectId));
    if (project) {
      document.getElementById('project-name').value = project.name;
      const imgElement = document.createElement('img');
      imgElement.src = project.image;
      imgElement.width = 400;
      imgElement.height = 250;
      document.getElementById('project-image-container').appendChild(imgElement);
    }
  });
}

document.getElementById('project-image').addEventListener('change', (event) => {
  const projectImage = event.target.files[0];
  const projectImageContainer = document.getElementById('project-image-container');

  if (projectImage) {
    // Очищаем контейнер перед добавлением нового изображения
    projectImageContainer.innerHTML = '';

    // Создаем элемент изображения
    const imgElement = document.createElement('img');

    // Загружаем выбранное изображение
    const reader = new FileReader();
    reader.onload = () => {
      imgElement.src = reader.result;
      imgElement.width = 400; // Устанавливаем уменьшенную ширину
      imgElement.height = 250; // Устанавливаем уменьшенную высоту
      projectImageContainer.appendChild(imgElement);
    };
    reader.readAsDataURL(projectImage);
  }
});

document.getElementById('create-project-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const projectName = document.getElementById('project-name').value;
  const projectImage = document.getElementById('project-image').files[0];

  if (!projectName || !projectImage) {
    alert("Введите название проекта и выберите изображение");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const projectData = {
      id: projectId ? parseInt(projectId) : Date.now(), // Используем существующий ID для обновления или новый ID для создания
      name: projectName,
      image: reader.result, // Base64 представление изображения
      likes: 0,
      views: 0,
    };

    // Отправляем данные о проекте в основной процесс
    if (projectId) {
      ipcRenderer.send('update-project', projectData);
    } else {
      ipcRenderer.send('project-created', projectData);
    }
  };

  reader.readAsDataURL(projectImage);
});

// Обработчик для отображения модального окна после сохранения проекта
ipcRenderer.on('show-success-modal', () => {
  const modal = document.getElementById('success-modal');
  modal.style.display = 'block';

  // Закрытие модального окна через 2 секунды
  setTimeout(() => {
    modal.style.display = 'none';
  }, 1000);
});

// Обработчик для закрытия модального окна
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('success-modal').style.display = 'none';
});
