const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Путь к файлу, в котором будут храниться данные о проектах
const projectDataFilePath = path.join(app.getPath('userData'), 'projects.json');

// Функция для чтения файла с данными о проектах
function readProjectData() {
  try {
      if (fs.existsSync(projectDataFilePath)) {
          const data = fs.readFileSync(projectDataFilePath, 'utf8');
          const parsedData = JSON.parse(data);
          return Array.isArray(parsedData) ? parsedData : []; // Проверяем, являются ли прочитанные данные массивом
      }
      return []; // Возвращаем пустой массив, если файла не существует
  } catch (error) {
      console.error('Ошибка при чтении данных о проектах:', error);
      return []; // Возвращаем пустой массив в случае ошибки
  }
}

// Функция для записи файла с данными о проектах
function writeProjectData(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(projectDataFilePath, jsonData, 'utf8');
        console.log('Project data successfully written to file'); // Добавлено для отладки
    } catch (error) {
        console.error('Error writing project data:', error);
    }
}

// Создание окна приложения
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadURL(`file://${__dirname}/menu.html`);

    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

// Обработчик для загрузки данных о проектах
ipcMain.on('load-project-data', (event) => {
    try {
        const projectData = readProjectData();
        console.log('Loaded project data:', projectData); // Логирование для отладки
        event.sender.send('project-data-loaded', projectData);
    } catch (error) {
        console.error('Error loading project data:', error);
        event.sender.send('load-project-data-error', error.message);
    }
});

// Обработчик для создания нового проекта
ipcMain.on('project-created', (event, projectData) => {
    try {
        const projects = readProjectData();
        console.log('Current projects:', projects); // Логирование для отладки

        // Проверяем, что projects это массив
        if (!Array.isArray(projects)) {
            console.error('Project data is not an array:', projects);
            return;
        }

        projects.push(projectData);
        writeProjectData(projects);

        // Отправка обновленных данных обратно в рендерерный процесс
        mainWindow.webContents.send('project-data-loaded', projects);
        // Отправка сообщения для отображения модального окна
        mainWindow.webContents.send('show-success-modal');
    } catch (error) {
        console.error('Error creating project:', error);
    }
});

// Обработчик для удаления проекта
ipcMain.on('delete-project', (event, projectToDelete) => {
    try {
        let projects = readProjectData();
        console.log('Current projects before deletion:', projects); // Логирование для отладки

        projects = projects.filter(project => project.id !== projectToDelete.id);

        writeProjectData(projects);

        // Отправка обновленных данных обратно в рендерерный процесс
        mainWindow.webContents.send('project-data-loaded', projects);
    } catch (error) {
        console.error('Error deleting project:', error);
    }
});

// Обработчик для увеличения количества лайков проекта
ipcMain.on('like-project', (event, projectId) => {
    try {
        let projects = readProjectData();
        console.log('Current projects before liking:', projects); // Логирование для отладки

        // Находим проект по идентификатору
        const projectToUpdate = projects.find(project => project.id === projectId);

        if (projectToUpdate) {
            projectToUpdate.likes++;
            writeProjectData(projects);

            // Отправка обновленных данных обратно в рендерерный процесс
            mainWindow.webContents.send('project-data-loaded', projects);
        } else {
            console.error('Project not found:', projectId);
        }
    } catch (error) {
        console.error('Error liking project:', error);
    }
});

// Обработчик для обновления проекта
ipcMain.on('update-project', (event, updatedProject) => {
  try {
    let projects = readProjectData();
    const index = projects.findIndex(p => p.id === parseInt(updatedProject.id));
    if (index !== -1) {
      projects[index] = Object.assign({}, projects[index], updatedProject);
      writeProjectData(projects);

      // Отправка обновленных данных обратно в рендерерный процесс
      mainWindow.webContents.send('project-data-loaded', projects);
      // Отправка сообщения для отображения модального окна
      mainWindow.webContents.send('show-success-modal');
    } else {
      console.error('Project not found for update:', updatedProject.id);
    }
  } catch (error) {
    console.error('Error updating project:', error);
  }
});
