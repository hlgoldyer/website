// Kiểm tra đăng nhập
const user = JSON.parse(localStorage.getItem('user'));

if (!user) {
  // Nếu chưa login thì chuyển hướng
  window.location.href = '/account/login.html';
} else {
  // Nếu đã login thì hiển thị avatar và tên người dùng
  const avatar = document.getElementById('user-avatar');
  avatar.src = user.avatar || 'images/default-avatar.png';
  avatar.classList.remove('hidden');

  avatar.onclick = () => {
    document.getElementById('dropdown').classList.toggle('hidden');
  };

  // Hiển thị tên người dùng đầu tiên trong dropdown
  const dropdown = document.getElementById('dropdown');
  const usernameDisplay = document.createElement('p');
  usernameDisplay.textContent = `👋 Xin chào, ${user.username}`;
  usernameDisplay.style.fontWeight = 'bold';
  usernameDisplay.style.marginBottom = '10px';
  usernameDisplay.style.background = 'rgb(253, 255, 146';
  usernameDisplay.style.color = 'black'
  dropdown.insertBefore(usernameDisplay, dropdown.firstChild);
}

// Xử lý logout
function logout() {
  localStorage.removeItem('user');
  window.location.href = '/account/login.html';
}

// Điều hướng các mục trong menu
document.querySelectorAll('#dropdown p')[1].onclick = () => location.href = '/account/rename.html';
document.querySelectorAll('#dropdown p')[2].onclick = () => location.href = '/account/changeemail.html';
document.querySelectorAll('#dropdown p')[3].onclick = () => location.href = '/account/changepassword.html';
document.querySelectorAll('#dropdown p')[4].onclick = () => location.href = '/account/changeavatar.html';
