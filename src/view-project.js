document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const commentsContainer = document.getElementById('comments-container');

    // Функция для загрузки комментариев из localStorage
    function loadComments() {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        comments.forEach(comment => addCommentToDOM(comment));
    }

    // Функция для добавления комментария в DOM
    function addCommentToDOM(commentText) {
        const commentDiv = document.createElement('div');
        commentDiv.className = 'comment';

        const commentContent = document.createElement('p');
        commentContent.textContent = commentText;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.innerHTML = '<i class="fa fa-times"></i>';
        deleteButton.addEventListener('click', () => {
            commentDiv.remove();
            saveComments();
        });

        commentDiv.appendChild(commentContent);
        commentDiv.appendChild(deleteButton);
        commentsContainer.appendChild(commentDiv);
    }

    // Функция для сохранения комментариев в localStorage
    function saveComments() {
        const comments = [];
        commentsContainer.querySelectorAll('.comment p').forEach(comment => {
            comments.push(comment.textContent);
        });
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    // Обработчик отправки формы
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const commentText = commentInput.value.trim();
        if (commentText) {
            addCommentToDOM(commentText);
            saveComments();
            commentInput.value = '';
        }
    });

    // Загрузка комментариев при загрузке страницы
    loadComments();
});
